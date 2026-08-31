"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { str, optionalStr } from "@/lib/form";
import { parseStringArray } from "@/lib/json";
import { analyzeAts, enrichAtsWithAI, type AtsResult } from "@/lib/ai/ats";

export interface AtsState {
  error?: string;
  result?: AtsResult;
}

export async function runAtsAnalysis(
  _prev: AtsState,
  formData: FormData,
): Promise<AtsState> {
  // Resolve resume text: stored resume takes precedence over pasted text.
  const resumeId = optionalStr(formData, "resumeId");
  let resumeText = str(formData, "resumeText");
  if (resumeId) {
    const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
    if (resume?.content) resumeText = resume.content;
  }
  if (!resumeText || resumeText.length < 40) {
    return {
      error:
        "Provide a resume — select a saved version or paste at least a few lines.",
    };
  }

  // Resolve job: saved job takes precedence over pasted text.
  const jobId = optionalStr(formData, "jobId");
  let jobText = str(formData, "jobText");
  let jobTitle = str(formData, "jobTitle");
  let jobSkills: string[] = [];
  let hasSavedJob = false;
  if (jobId) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (job) {
      jobSkills = parseStringArray(job.skills);
      // Fold skills in so keyword extraction has signal even when the saved
      // job has no full description.
      jobText = [job.title, job.description ?? "", jobSkills.join(" ")]
        .filter(Boolean)
        .join("\n");
      jobTitle = job.title;
      hasSavedJob = true;
    }
  }
  // A saved job (title + skills) is enough; only pasted text needs a minimum.
  if (!hasSavedJob && (!jobText || jobText.length < 40)) {
    return {
      error:
        "Provide a job description — select a saved job or paste one in.",
    };
  }

  const base = analyzeAts({ resumeText, jobText, jobTitle, jobSkills });
  const result = await enrichAtsWithAI(base, {
    resumeText,
    jobText,
    jobTitle,
    jobSkills,
  });

  await prisma.aTSAnalysis.create({
    data: {
      score: result.score,
      keywordMatch: result.keywordMatch,
      skillsMatch: result.skillsMatch,
      experienceMatch: result.experienceMatch,
      missingKeywords: JSON.stringify(result.missingKeywords),
      missingSkills: JSON.stringify(result.missingSkills),
      recommendations: JSON.stringify(result.recommendations),
      summary: result.summary,
      resumeId: resumeId ?? null,
      jobId: jobId ?? null,
    },
  });
  await prisma.activityLog.create({
    data: {
      type: "ats.analyzed",
      message: `Ran ATS analysis${jobTitle ? ` for ${jobTitle}` : ""} — scored ${result.score}/100.`,
    },
  });

  revalidatePath("/admin/ats");
  revalidatePath("/admin");
  return { result };
}
