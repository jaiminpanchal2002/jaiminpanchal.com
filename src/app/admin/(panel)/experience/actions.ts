"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { str, optionalStr, bool, int, commaList, lineList } from "@/lib/form";

export interface ExpFormState {
  error?: string;
}

function revalidateAll() {
  revalidatePath("/admin/experience");
  revalidatePath("/");
}

function dataFrom(formData: FormData) {
  return {
    position: str(formData, "position"),
    company: str(formData, "company"),
    period: optionalStr(formData, "period"),
    location: optionalStr(formData, "location"),
    employmentType: optionalStr(formData, "employmentType"),
    description: optionalStr(formData, "description"),
    achievements: JSON.stringify(lineList(formData, "achievements")),
    technologies: JSON.stringify(commaList(formData, "technologies")),
    current: bool(formData, "current"),
    order: int(formData, "order"),
  };
}

export async function createExperience(
  _prev: ExpFormState,
  formData: FormData,
): Promise<ExpFormState> {
  const data = dataFrom(formData);
  if (!data.position) return { error: "Role is required." };
  if (!data.company) return { error: "Company is required." };
  await prisma.experience.create({ data });
  revalidateAll();
  redirect("/admin/experience");
}

export async function updateExperience(
  id: string,
  _prev: ExpFormState,
  formData: FormData,
): Promise<ExpFormState> {
  const data = dataFrom(formData);
  if (!data.position) return { error: "Role is required." };
  if (!data.company) return { error: "Company is required." };
  await prisma.experience.update({ where: { id }, data });
  revalidateAll();
  redirect("/admin/experience");
}

export async function deleteExperience(id: string, _formData?: FormData) {
  await prisma.experience.delete({ where: { id } });
  revalidateAll();
  redirect("/admin/experience");
}
