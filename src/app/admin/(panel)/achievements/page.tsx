import Link from "next/link";
import { Pencil, Award } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteAchievement } from "./actions";

export const dynamic = "force-dynamic";

export default async function AchievementsPage() {
  const rows = await prisma.achievement.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="px-8 py-8">
      <PageHeader
        title="Achievements"
        subtitle="Awards and credentials shown in Foundations."
        action={{ href: "/admin/achievements/new", label: "New achievement" }}
      />
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-sm text-white/50">No achievements yet.</p>
          <Link
            href="/admin/achievements/new"
            className="mt-2 inline-block text-sm text-[#B600A8] hover:underline"
          >
            Add your first achievement
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.03]">
          {rows.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <Award size={16} className="text-white/30" />
                <div>
                  <p className="text-sm font-medium text-white">{a.title}</p>
                  <p className="text-xs text-white/40">{a.description ?? ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/achievements/${a.id}`}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/60 hover:bg-white/5 hover:text-white"
                >
                  <Pencil size={13} /> Edit
                </Link>
                <DeleteButton
                  action={deleteAchievement.bind(null, a.id)}
                  compact
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
