"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { str, optionalStr, commaList, int } from "@/lib/form";
import { buildCandidate } from "@/lib/jobs/candidate";
import { scoreJob } from "@/lib/matching";
import {
  fetchJobsFromApify,
  ApifyNotConfiguredError,
} from "@/lib/jobs/apify";

export interface JobFormState {
  error?: string;
}

export interface SyncState {
  error?: string;
  message?: string;
  added?: number;
}

function revalidateJobs() {
  revalidatePath("/admin/jobs");
}

export async function addJob(
  _prev: JobFormState,
  formData: FormData,
): Promise<JobFormState> {
  const title = str(formData, "title");
  const company = str(formData, "company");
  if (!title) return { error: "Job title is required." };
  if (!company) return { error: "Company is required." };

  const skills = commaList(formData, "skills");
  const workMode = optionalStr(formData, "workMode");

  const candidate = await buildCandidate();
  const match = scoreJob({ title, skills, workMode }, candidate);

  await prisma.job.create({
    data: {
      title,
      company,
      location: optionalStr(formData, "location"),
      workMode,
      url: optionalStr(formData, "url"),
      salary: optionalStr(formData, "salary"),
      description: optionalStr(formData, "description"),
      source: optionalStr(formData, "source") ?? "manual",
      skills: JSON.stringify(skills),
      matchScore: match.score,
      matchReasons: JSON.stringify(match.reasons),
      status: "new",
    },
  });

  revalidateJobs();
  redirect("/admin/jobs");
}

export async function saveJob(id: string, _formData?: FormData) {
  await prisma.job.update({ where: { id }, data: { status: "saved" } });
  revalidateJobs();
}

export async function ignoreJob(id: string, _formData?: FormData) {
  await prisma.job.update({ where: { id }, data: { status: "ignored" } });
  revalidateJobs();
}

export async function deleteJob(id: string, _formData?: FormData) {
  await prisma.job.delete({ where: { id } });
  revalidateJobs();
}

/** Create a tracked application from a discovered job. */
export async function trackJob(id: string, _formData?: FormData) {
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return;

  await prisma.jobApplication.create({
    data: {
      company: job.company,
      jobTitle: job.title,
      jobUrl: job.url,
      source: job.source,
      location: job.location,
      workMode: job.workMode,
      salary: job.salary,
      status: "Saved",
      jobId: job.id,
    },
  });
  await prisma.job.update({ where: { id }, data: { status: "applied" } });
  await prisma.activityLog.create({
    data: {
      type: "application.created",
      message: `Started tracking ${job.title} at ${job.company}.`,
    },
  });

  revalidateJobs();
  revalidatePath("/admin/applications");
  revalidatePath("/admin");
  redirect("/admin/applications");
}

export async function syncFromApify(
  _prev: SyncState,
  formData: FormData,
): Promise<SyncState> {
  const query = str(formData, "query");
  if (!query) return { error: "Enter a role to search for." };

  const location = optionalStr(formData, "location") ?? undefined;
  const country = optionalStr(formData, "country") ?? undefined;
  const datePosted = optionalStr(formData, "datePosted") ?? undefined;
  const limit = int(formData, "limit", 20);

  try {
    const jobs = await fetchJobsFromApify({
      query,
      location,
      limit,
      country,
      datePosted,
    });
    const candidate = await buildCandidate();

    let added = 0;
    for (const job of jobs) {
      // De-dupe on URL when present.
      if (job.url) {
        const existing = await prisma.job.findFirst({
          where: { url: job.url },
          select: { id: true },
        });
        if (existing) continue;
      }
      const match = scoreJob(job, candidate);
      await prisma.job.create({
        data: {
          title: job.title,
          company: job.company,
          location: job.location,
          workMode: job.workMode,
          url: job.url,
          salary: job.salary,
          description: job.description,
          source: job.source,
          skills: JSON.stringify(job.skills),
          postedAt: job.postedAt,
          matchScore: match.score,
          matchReasons: JSON.stringify(match.reasons),
          status: "new",
        },
      });
      added += 1;
    }

    revalidateJobs();
    return {
      added,
      message:
        added > 0
          ? `Imported ${added} new job${added === 1 ? "" : "s"} from Apify.`
          : "No new jobs found (duplicates skipped).",
    };
  } catch (err) {
    if (err instanceof ApifyNotConfiguredError) {
      return {
        error:
          "Apify is not configured. Set APIFY_API_TOKEN in your environment to enable live job discovery.",
      };
    }
    console.error("Apify sync failed:", err);
    return { error: "Job sync failed. Check the server logs and try again." };
  }
}
