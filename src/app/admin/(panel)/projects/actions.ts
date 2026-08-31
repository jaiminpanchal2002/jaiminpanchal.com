"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  str,
  optionalStr,
  bool,
  int,
  optionalDate,
  commaList,
  lineList,
  slugify,
} from "@/lib/form";

export interface FormState {
  error?: string;
}

function revalidateAll() {
  revalidatePath("/admin/projects");
  revalidatePath("/"); // public projects section
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "project";
  let slug = root;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    n += 1;
    slug = `${root}-${n}`;
  }
}

function dataFrom(formData: FormData) {
  return {
    name: str(formData, "name"),
    summary: optionalStr(formData, "summary"),
    description: optionalStr(formData, "description"),
    categoryId: optionalStr(formData, "categoryId"),
    technologies: JSON.stringify(commaList(formData, "technologies")),
    images: JSON.stringify(lineList(formData, "images")),
    coverUrl: optionalStr(formData, "coverUrl"),
    githubUrl: optionalStr(formData, "githubUrl"),
    liveUrl: optionalStr(formData, "liveUrl"),
    featured: bool(formData, "featured"),
    published: bool(formData, "published"),
    isAiProject: bool(formData, "isAiProject"),
    order: int(formData, "order"),
    date: optionalDate(formData, "date"),
  };
}

export async function createProject(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const base = dataFrom(formData);
  if (!base.name) return { error: "Project name is required." };

  const slugInput = optionalStr(formData, "slug") ?? base.name;
  const slug = await uniqueSlug(slugInput);

  await prisma.project.create({ data: { ...base, slug } });
  revalidateAll();
  redirect("/admin/projects");
}

export async function updateProject(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const base = dataFrom(formData);
  if (!base.name) return { error: "Project name is required." };

  const slugInput = optionalStr(formData, "slug") ?? base.name;
  const slug = await uniqueSlug(slugInput, id);

  await prisma.project.update({ where: { id }, data: { ...base, slug } });
  revalidateAll();
  redirect("/admin/projects");
}

export async function deleteProject(id: string, _formData?: FormData) {
  await prisma.project.delete({ where: { id } });
  revalidateAll();
  redirect("/admin/projects");
}
