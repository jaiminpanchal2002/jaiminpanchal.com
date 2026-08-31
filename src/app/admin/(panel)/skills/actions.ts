"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { str, int, commaList } from "@/lib/form";

export interface SkillFormState {
  error?: string;
}

function revalidateAll() {
  revalidatePath("/admin/skills");
  revalidatePath("/");
}

async function syncSkills(categoryId: string, skills: string[]) {
  await prisma.skill.deleteMany({ where: { categoryId } });
  for (let i = 0; i < skills.length; i++) {
    await prisma.skill.create({
      data: { name: skills[i], order: i, categoryId },
    });
  }
}

export async function createSkillCategory(
  _prev: SkillFormState,
  formData: FormData,
): Promise<SkillFormState> {
  const name = str(formData, "name");
  if (!name) return { error: "Category name is required." };
  const category = await prisma.skillCategory.create({
    data: { name, order: int(formData, "order") },
  });
  await syncSkills(category.id, commaList(formData, "skills"));
  revalidateAll();
  redirect("/admin/skills");
}

export async function updateSkillCategory(
  id: string,
  _prev: SkillFormState,
  formData: FormData,
): Promise<SkillFormState> {
  const name = str(formData, "name");
  if (!name) return { error: "Category name is required." };
  await prisma.skillCategory.update({
    where: { id },
    data: { name, order: int(formData, "order") },
  });
  await syncSkills(id, commaList(formData, "skills"));
  revalidateAll();
  redirect("/admin/skills");
}

export async function deleteSkillCategory(id: string, _formData?: FormData) {
  await prisma.skill.deleteMany({ where: { categoryId: id } });
  await prisma.skillCategory.delete({ where: { id } });
  revalidateAll();
  redirect("/admin/skills");
}
