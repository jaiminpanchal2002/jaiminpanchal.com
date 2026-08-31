"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { str, optionalStr, optionalDate, commaList } from "@/lib/form";
import { isApplicationStatus } from "@/lib/jobs/constants";

export interface AppFormState {
  error?: string;
}

function revalidateAll() {
  revalidatePath("/admin/applications");
  revalidatePath("/admin/analytics");
  revalidatePath("/admin");
}

function dataFrom(formData: FormData) {
  const status = str(formData, "status") || "Saved";
  return {
    company: str(formData, "company"),
    jobTitle: str(formData, "jobTitle"),
    jobUrl: optionalStr(formData, "jobUrl"),
    source: optionalStr(formData, "source"),
    location: optionalStr(formData, "location"),
    workMode: optionalStr(formData, "workMode"),
    salary: optionalStr(formData, "salary"),
    status: isApplicationStatus(status) ? status : "Saved",
    priority: optionalStr(formData, "priority"),
    recruiter: optionalStr(formData, "recruiter"),
    recruiterContact: optionalStr(formData, "recruiterContact"),
    notes: optionalStr(formData, "notes"),
    tags: JSON.stringify(commaList(formData, "tags")),
    dateApplied: optionalDate(formData, "dateApplied"),
    followUpDate: optionalDate(formData, "followUpDate"),
  };
}

export async function createApplication(
  _prev: AppFormState,
  formData: FormData,
): Promise<AppFormState> {
  const data = dataFrom(formData);
  if (!data.company) return { error: "Company is required." };
  if (!data.jobTitle) return { error: "Job title is required." };

  await prisma.jobApplication.create({ data });
  await prisma.activityLog.create({
    data: {
      type: "application.created",
      message: `Added application: ${data.jobTitle} at ${data.company}.`,
    },
  });

  revalidateAll();
  redirect("/admin/applications");
}

export async function updateApplication(
  id: string,
  _prev: AppFormState,
  formData: FormData,
): Promise<AppFormState> {
  const data = dataFrom(formData);
  if (!data.company) return { error: "Company is required." };
  if (!data.jobTitle) return { error: "Job title is required." };

  await prisma.jobApplication.update({ where: { id }, data });
  revalidateAll();
  redirect("/admin/applications");
}

/** Move an application between pipeline stages (Kanban drag / table select). */
export async function setApplicationStatus(id: string, status: string) {
  if (!isApplicationStatus(status)) return;

  const app = await prisma.jobApplication.update({
    where: { id },
    data: {
      status,
      // Stamp the applied date the first time it enters/after Applied.
      ...(status === "Applied" ? { dateApplied: new Date() } : {}),
    },
  });
  await prisma.activityLog.create({
    data: {
      type: "application.moved",
      message: `${app.jobTitle} at ${app.company} → ${status}.`,
    },
  });

  revalidateAll();
}

export async function deleteApplication(id: string, _formData?: FormData) {
  await prisma.jobApplication.delete({ where: { id } });
  revalidateAll();
}
