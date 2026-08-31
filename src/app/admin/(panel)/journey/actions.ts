"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { str, optionalStr, int } from "@/lib/form";

export interface JourneyFormState {
  error?: string;
}

function revalidateAll() {
  revalidatePath("/admin/journey");
  revalidatePath("/");
}

export async function createJourneyStep(
  _prev: JourneyFormState,
  formData: FormData,
): Promise<JourneyFormState> {
  const step = str(formData, "step");
  if (!step) return { error: "Step is required." };
  await prisma.journeyStep.create({
    data: {
      step,
      note: optionalStr(formData, "note"),
      order: int(formData, "order"),
    },
  });
  revalidateAll();
  redirect("/admin/journey");
}

export async function updateJourneyStep(
  id: string,
  _prev: JourneyFormState,
  formData: FormData,
): Promise<JourneyFormState> {
  const step = str(formData, "step");
  if (!step) return { error: "Step is required." };
  await prisma.journeyStep.update({
    where: { id },
    data: {
      step,
      note: optionalStr(formData, "note"),
      order: int(formData, "order"),
    },
  });
  revalidateAll();
  redirect("/admin/journey");
}

export async function deleteJourneyStep(id: string, _formData?: FormData) {
  await prisma.journeyStep.delete({ where: { id } });
  revalidateAll();
  redirect("/admin/journey");
}
