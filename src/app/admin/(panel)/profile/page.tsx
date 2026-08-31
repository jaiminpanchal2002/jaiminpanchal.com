import { prisma } from "@/lib/db";
import { parseStringArray } from "@/lib/json";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { saveProfile } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const profile = await prisma.profile.findFirst({
    include: { socials: { orderBy: { order: "asc" } } },
  });

  return (
    <div className="px-8 py-8">
      <PageHeader
        title="Profile"
        subtitle="Drives your hero, contact section and footer."
      />
      <ProfileForm
        action={saveProfile}
        profile={
          profile
            ? {
                name: profile.name,
                title: profile.title,
                roles: parseStringArray(profile.roles),
                tagline: profile.tagline,
                bio: profile.bio,
                location: profile.location,
                email: profile.email,
                phone: profile.phone,
                avatarUrl: profile.avatarUrl,
                resumeUrl: profile.resumeUrl,
                availability: profile.availability,
                socials: profile.socials.map((s) => ({
                  platform: s.platform,
                  url: s.url,
                })),
              }
            : undefined
        }
      />
    </div>
  );
}
