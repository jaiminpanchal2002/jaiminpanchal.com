"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { str, optionalStr, commaList } from "@/lib/form";

export interface ResumeFormState {
  error?: string;
}

function revalidateAll() {
  revalidatePath("/admin/resumes");
  revalidatePath("/admin/ats");
}

function dataFrom(formData: FormData) {
  return {
    name: str(formData, "name"),
    version: optionalStr(formData, "version"),
    targetRole: optionalStr(formData, "targetRole"),
    summary: optionalStr(formData, "summary"),
    content: optionalStr(formData, "content"),
    fileUrl: optionalStr(formData, "fileUrl"),
    skills: JSON.stringify(commaList(formData, "skills")),
    status: str(formData, "status") || "active",
  };
}

export async function createResume(
  _prev: ResumeFormState,
  formData: FormData,
): Promise<ResumeFormState> {
  const data = dataFrom(formData);
  if (!data.name) return { error: "Resume name is required." };
  await prisma.resume.create({ data });
  revalidateAll();
  redirect("/admin/resumes");
}

export async function updateResume(
  id: string,
  _prev: ResumeFormState,
  formData: FormData,
): Promise<ResumeFormState> {
  const data = dataFrom(formData);
  if (!data.name) return { error: "Resume name is required." };
  await prisma.resume.update({ where: { id }, data });
  revalidateAll();
  redirect("/admin/resumes");
}

export async function deleteResume(id: string, _formData?: FormData) {
  await prisma.resume.delete({ where: { id } });
  revalidateAll();
  redirect("/admin/resumes");
}
