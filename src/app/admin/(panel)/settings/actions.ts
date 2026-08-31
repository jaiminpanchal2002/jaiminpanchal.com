"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { str, optionalStr } from "@/lib/form";

export interface SettingsFormState {
  error?: string;
  ok?: boolean;
}

export async function saveSettings(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const data = {
    siteName: optionalStr(formData, "siteName"),
    seoTitle: optionalStr(formData, "seoTitle"),
    seoDescription: optionalStr(formData, "seoDescription"),
    ogImageUrl: optionalStr(formData, "ogImageUrl"),
  };
  if (!str(formData, "seoTitle")) return { error: "SEO title is required." };

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { ok: true };
}
