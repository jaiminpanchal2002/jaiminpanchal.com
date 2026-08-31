import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { AchievementForm } from "@/components/admin/AchievementForm";
import { updateAchievement } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditAchievementPage({
  params,
}: {
  params: { id: string };
}) {
  const a = await prisma.achievement.findUnique({ where: { id: params.id } });
  if (!a) notFound();

  return (
    <div className="px-8 py-8">
      <Link
        href="/admin/achievements"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} /> Back
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-white">
        Edit achievement
      </h1>
      <AchievementForm
        action={updateAchievement.bind(null, a.id)}
        achievement={{
          title: a.title,
          description: a.description,
          order: a.order,
        }}
      />
    </div>
  );
}
