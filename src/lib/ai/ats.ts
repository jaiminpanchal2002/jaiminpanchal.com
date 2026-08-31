// ATS resume analyzer. The scoring is deterministic and transparent — it works
// with zero external services. When an AI provider is configured it adds a
// polished summary + tailored recommendations on top (never replacing the
// hard numbers).
import {
  tokenSet,
  extractKeywords,
  detectSkills,
  hasSkill,
} from "./text";
import { getAIProvider } from "./provider";

export interface AtsInput {
  resumeText: string;
  jobText: string;
  jobTitle?: string;
  /** Known required skills (e.g. from a saved Job). Merged with detected ones. */
  jobSkills?: string[];
}

export interface AtsResult {
  score: number; // 0-100 overall
  keywordMatch: number; // %
  skillsMatch: number; // %
  experienceMatch: number; // %
  matchedKeywords: string[];
  missingKeywords: string[];
  matchedSkills: string[];
  missingSkills: string[];
  formattingIssues: string[];
  recommendations: string[];
  summary: string;
  aiPowered: boolean;
}

function uniqueLower(values: string[]): string[] {
  return Array.from(new Set(values.map((v) => v.toLowerCase())));
}

function checkFormatting(resumeText: string): string[] {
  const issues: string[] = [];
  const text = resumeText;
  const words = text.split(/\s+/).filter(Boolean);

  if (!/[\w.+-]+@[\w-]+\.[\w.-]+/.test(text)) {
    issues.push("No email address detected — recruiters need a contact.");
  }
  if (!/(experience|employment|work history)/i.test(text)) {
    issues.push('Missing a clear "Experience" section header.');
  }
  if (!/(education|degree|university|b\.?s\.?|b\.?tech)/i.test(text)) {
    issues.push('Missing an "Education" section.');
  }
  if (!/(skills|technologies|tech stack)/i.test(text)) {
    issues.push('Add a "Skills" section — ATS parsers scan it directly.');
  }
  if (!/\d+%|\d+\+|\$\d|\bby \d+/i.test(text)) {
    issues.push(
      "No quantified achievements — add metrics (e.g. “cut load time by 40%”).",
    );
  }
  if (words.length < 200) {
    issues.push("Resume looks short (<200 words) — expand impact detail.");
  }
  if (words.length > 1000) {
    issues.push("Resume is long (>1000 words) — tighten to the most relevant.");
  }
  return issues;
}

/** Deterministic analysis. Always available. */
export function analyzeAts(input: AtsInput): AtsResult {
  const resumeText = input.resumeText ?? "";
  const jobText = input.jobText ?? "";
  const resumeTokens = tokenSet(resumeText);

  // Keywords from the job description.
  const jobKeywords = extractKeywords(jobText, 25);
  const matchedKeywords = jobKeywords.filter((k) => resumeTokens.has(k));
  const missingKeywords = jobKeywords.filter((k) => !resumeTokens.has(k));
  const keywordMatch = jobKeywords.length
    ? Math.round((matchedKeywords.length / jobKeywords.length) * 100)
    : 0;

  // Skills: provided + detected in the job text.
  const jobSkills = uniqueLower([
    ...(input.jobSkills ?? []),
    ...detectSkills(jobText),
  ]);
  const matchedSkills = jobSkills.filter((s) => hasSkill(resumeText, s));
  const missingSkills = jobSkills.filter((s) => !hasSkill(resumeText, s));
  const skillsMatch = jobSkills.length
    ? Math.round((matchedSkills.length / jobSkills.length) * 100)
    : keywordMatch;

  // Experience: overlap of job-title words with the resume.
  const titleWords = (input.jobTitle ?? "")
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2);
  const titleHits = titleWords.filter((w) => resumeTokens.has(w)).length;
  const experienceMatch = titleWords.length
    ? Math.round((titleHits / titleWords.length) * 100)
    : 70;

  const formattingIssues = checkFormatting(resumeText);
  const formattingPenalty = Math.min(20, formattingIssues.length * 4);

  const score = Math.max(
    0,
    Math.round(
      keywordMatch * 0.4 +
        skillsMatch * 0.35 +
        experienceMatch * 0.25 -
        formattingPenalty,
    ),
  );

  // Deterministic recommendations.
  const recommendations: string[] = [];
  for (const skill of missingSkills.slice(0, 6)) {
    recommendations.push(
      `Add “${skill}” — it appears in the job description and is missing from your resume.`,
    );
  }
  for (const kw of missingKeywords.slice(0, 4)) {
    if (!missingSkills.some((s) => s.toLowerCase() === kw)) {
      recommendations.push(`Work in the keyword “${kw}” where it genuinely applies.`);
    }
  }
  recommendations.push(...formattingIssues);

  const summary =
    score >= 80
      ? "Strong match — your resume aligns well with this role's requirements."
      : score >= 60
        ? "Decent match — a few targeted additions would lift your ATS score."
        : "Weak match — significant gaps in required skills and keywords.";

  return {
    score,
    keywordMatch,
    skillsMatch,
    experienceMatch,
    matchedKeywords,
    missingKeywords,
    matchedSkills,
    missingSkills,
    formattingIssues,
    recommendations: recommendations.slice(0, 12),
    summary,
    aiPowered: false,
  };
}

/**
 * Optional AI enrichment. If a provider is configured, replaces the summary and
 * prepends tailored recommendations. Falls back silently to the deterministic
 * result on any error, so this never breaks the feature.
 */
export async function enrichAtsWithAI(
  base: AtsResult,
  input: AtsInput,
): Promise<AtsResult> {
  const provider = getAIProvider();
  if (!provider.available) return base;

  try {
    const system =
      "You are an expert technical recruiter and ATS optimization assistant. Be concise, specific, and honest. Never invent skills or experience the candidate does not have.";
    const user = [
      `JOB TITLE: ${input.jobTitle ?? "N/A"}`,
      `MISSING SKILLS: ${base.missingSkills.join(", ") || "none"}`,
      `MISSING KEYWORDS: ${base.missingKeywords.join(", ") || "none"}`,
      `ATS SCORE: ${base.score}/100`,
      "",
      "JOB DESCRIPTION:",
      input.jobText.slice(0, 4000),
      "",
      "RESUME:",
      input.resumeText.slice(0, 4000),
      "",
      "Return a 2-sentence summary, then 3-5 specific, actionable recommendations as a bulleted list. Do not fabricate experience.",
    ].join("\n");

    const text = await provider.generate(system, user);
    if (!text) return base;

    // First paragraph = summary; bullet lines = recommendations.
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const bullets = lines
      .filter((l) => /^[-*•]/.test(l))
      .map((l) => l.replace(/^[-*•]\s*/, ""));
    const summaryLine = lines.find((l) => !/^[-*•]/.test(l)) ?? base.summary;

    return {
      ...base,
      summary: summaryLine,
      recommendations:
        bullets.length > 0
          ? [...bullets, ...base.formattingIssues].slice(0, 12)
          : base.recommendations,
      aiPowered: true,
    };
  } catch (err) {
    console.error("AI enrichment failed, using deterministic result:", err);
    return base;
  }
}
