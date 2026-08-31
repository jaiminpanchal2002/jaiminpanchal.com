"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { str, optionalStr, int } from "@/lib/form";

export interface AchFormState {
  error?: string;
}

function revalidateAll() {
  revalidatePath("/admin/achievements");
  revalidatePath("/");
}

export async function createAchievement(
  _prev: AchFormState,
  formData: FormData,
): Promise<AchFormState> {
  const title = str(formData, "title");
  if (!title) return { error: "Title is required." };
  await prisma.achievement.create({
    data: {
      title,
      description: optionalStr(formData, "description"),
      order: int(formData, "order"),
    },
  });
  revalidateAll();
  redirect("/admin/achievements");
}

export async function updateAchievement(
  id: string,
  _prev: AchFormState,
  formData: FormData,
): Promise<AchFormState> {
  const title = str(formData, "title");
  if (!title) return { error: "Title is required." };
  await prisma.achievement.update({
    where: { id },
    data: {
      title,
      description: optionalStr(formData, "description"),
      order: int(formData, "order"),
    },
  });
  revalidateAll();
  redirect("/admin/achievements");
}

export async function deleteAchievement(id: string, _formData?: FormData) {
  await prisma.achievement.delete({ where: { id } });
  revalidateAll();
  redirect("/admin/achievements");
}
