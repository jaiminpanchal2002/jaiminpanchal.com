"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { str, optionalStr, int } from "@/lib/form";

export interface EduFormState {
  error?: string;
}

function revalidateAll() {
  revalidatePath("/admin/education");
  revalidatePath("/");
}

function dataFrom(formData: FormData) {
  return {
    institution: str(formData, "institution"),
    degree: str(formData, "degree"),
    field: optionalStr(formData, "field"),
    period: optionalStr(formData, "period"),
    description: optionalStr(formData, "description"),
    order: int(formData, "order"),
  };
}

export async function createEducation(
  _prev: EduFormState,
  formData: FormData,
): Promise<EduFormState> {
  const data = dataFrom(formData);
  if (!data.institution) return { error: "Institution is required." };
  if (!data.degree) return { error: "Degree is required." };
  await prisma.education.create({ data });
  revalidateAll();
  redirect("/admin/education");
}

export async function updateEducation(
  id: string,
  _prev: EduFormState,
  formData: FormData,
): Promise<EduFormState> {
  const data = dataFrom(formData);
  if (!data.institution) return { error: "Institution is required." };
  if (!data.degree) return { error: "Degree is required." };
  await prisma.education.update({ where: { id }, data });
  revalidateAll();
  redirect("/admin/education");
}

export async function deleteEducation(id: string, _formData?: FormData) {
  await prisma.education.delete({ where: { id } });
  revalidateAll();
  redirect("/admin/education");
}
