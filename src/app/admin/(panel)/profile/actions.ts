"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { str, optionalStr, commaList, lineList } from "@/lib/form";

export interface ProfileFormState {
  error?: string;
  ok?: boolean;
}

/** Parse "Label | https://url" lines into social links. */
function parseSocials(formData: FormData): { platform: string; url: string }[] {
  return lineList(formData, "socials")
    .map((line) => {
      const [label, ...rest] = line.split("|");
      return { platform: (label ?? "").trim(), url: rest.join("|").trim() };
    })
    .filter((s) => s.platform && s.url);
}

export async function saveProfile(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const name = str(formData, "name");
  const title = str(formData, "title");
  if (!name) return { error: "Name is required." };
  if (!title) return { error: "Title is required." };

  const data = {
    name,
    title,
    roles: JSON.stringify(commaList(formData, "roles")),
    tagline: optionalStr(formData, "tagline"),
    bio: optionalStr(formData, "bio"),
    location: optionalStr(formData, "location"),
    email: optionalStr(formData, "email"),
    phone: optionalStr(formData, "phone"),
    avatarUrl: optionalStr(formData, "avatarUrl"),
    resumeUrl: optionalStr(formData, "resumeUrl"),
    availability: optionalStr(formData, "availability"),
  };

  const existing = await prisma.profile.findFirst({ select: { id: true } });
  const profileId = existing
    ? (await prisma.profile.update({ where: { id: existing.id }, data })).id
    : (await prisma.profile.create({ data })).id;

  // Sync social links.
  const socials = parseSocials(formData);
  await prisma.socialLink.deleteMany({ where: { profileId } });
  for (let i = 0; i < socials.length; i++) {
    await prisma.socialLink.create({
      data: { ...socials[i], order: i, profileId },
    });
  }

  revalidatePath("/admin/profile");
  revalidatePath("/");
  return { ok: true };
}
