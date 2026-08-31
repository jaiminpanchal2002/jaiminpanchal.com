"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { str, optionalStr, int, commaList } from "@/lib/form";

export interface BuildingFormState {
  error?: string;
}

const STATUSES = ["Planning", "Building", "Testing", "Live"];

function revalidateAll() {
  revalidatePath("/admin/building");
  revalidatePath("/");
}

function dataFrom(formData: FormData) {
  const status = str(formData, "status");
  let progress = int(formData, "progress");
  progress = Math.max(0, Math.min(100, progress));
  return {
    title: str(formData, "title"),
    status: STATUSES.includes(status) ? status : "Building",
    progress,
    description: optionalStr(formData, "description"),
    tech: JSON.stringify(commaList(formData, "tech")),
    link: optionalStr(formData, "link"),
    order: int(formData, "order"),
  };
}

export async function createBuilding(
  _prev: BuildingFormState,
  formData: FormData,
): Promise<BuildingFormState> {
  const data = dataFrom(formData);
  if (!data.title) return { error: "Title is required." };
  await prisma.building.create({ data });
  revalidateAll();
  redirect("/admin/building");
}

export async function updateBuilding(
  id: string,
  _prev: BuildingFormState,
  formData: FormData,
): Promise<BuildingFormState> {
  const data = dataFrom(formData);
  if (!data.title) return { error: "Title is required." };
  await prisma.building.update({ where: { id }, data });
  revalidateAll();
  redirect("/admin/building");
}

export async function deleteBuilding(id: string, _formData?: FormData) {
  await prisma.building.delete({ where: { id } });
  revalidateAll();
  redirect("/admin/building");
}
