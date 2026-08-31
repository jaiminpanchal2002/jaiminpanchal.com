import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteSkillCategory } from "./actions";

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const categories = await prisma.skillCategory.findMany({
    orderBy: { order: "asc" },
    include: { skills: { orderBy: { order: "asc" } } },
  });

  return (
    <div className="px-8 py-8">
      <PageHeader
        title="Skills"
        subtitle="Grouped by category, shown on the public site."
        action={{ href: "/admin/skills/new", label: "New category" }}
      />
      {categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-sm text-white/50">No skill categories yet.</p>
          <Link
            href="/admin/skills/new"
            className="mt-2 inline-block text-sm text-[#B600A8] hover:underline"
          >
            Add your first category
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-mono text-sm uppercase tracking-widest text-white">
                  {cat.name}
                </h3>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/skills/${cat.id}`}
                    className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/60 hover:bg-white/5 hover:text-white"
                  >
                    <Pencil size={13} /> Edit
                  </Link>
                  <DeleteButton
                    action={deleteSkillCategory.bind(null, cat.id)}
                    compact
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.length === 0 ? (
                  <span className="text-xs text-white/30">No skills yet.</span>
                ) : (
                  cat.skills.map((s) => (
                    <span
                      key={s.id}
                      className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-white/60"
                    >
                      {s.name}
                    </span>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
