"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { str, optionalStr, int } from "@/lib/form";

export interface FormState {
  error?: string;
}

function revalidateAll() {
  revalidatePath("/admin/services");
  revalidatePath("/"); // public services section
}

export async function createService(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = str(formData, "name");
  const description = str(formData, "description");
  if (!name) return { error: "Name is required." };
  if (!description) return { error: "Description is required." };

  const count = await prisma.service.count();
  await prisma.service.create({
    data: {
      name,
      description,
      number: optionalStr(formData, "number") ?? String(count + 1).padStart(2, "0"),
      order: int(formData, "order", count),
    },
  });

  revalidateAll();
  redirect("/admin/services");
}

export async function updateService(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = str(formData, "name");
  const description = str(formData, "description");
  if (!name) return { error: "Name is required." };
  if (!description) return { error: "Description is required." };

  await prisma.service.update({
    where: { id },
    data: {
      name,
      description,
      number: str(formData, "number"),
      order: int(formData, "order"),
    },
  });

  revalidateAll();
  redirect("/admin/services");
}

export async function deleteService(id: string, _formData?: FormData) {
  await prisma.service.delete({ where: { id } });
  revalidateAll();
  redirect("/admin/services");
}
