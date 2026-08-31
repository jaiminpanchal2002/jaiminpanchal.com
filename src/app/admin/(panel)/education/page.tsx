import Link from "next/link";
import { Pencil, GraduationCap } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteEducation } from "./actions";

export const dynamic = "force-dynamic";

export default async function EducationPage() {
  const rows = await prisma.education.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="px-8 py-8">
      <PageHeader
        title="Education"
        subtitle="Shown in the Foundations section."
        action={{ href: "/admin/education/new", label: "New entry" }}
      />
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-sm text-white/50">No education entries yet.</p>
          <Link
            href="/admin/education/new"
            className="mt-2 inline-block text-sm text-[#B600A8] hover:underline"
          >
            Add your first entry
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.03]">
          {rows.map((e) => (
            <li
              key={e.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <GraduationCap size={16} className="text-white/30" />
                <div>
                  <p className="text-sm font-medium text-white">{e.degree}</p>
                  <p className="text-xs text-white/40">
                    {e.institution}
                    {e.period ? ` · ${e.period}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/education/${e.id}`}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/60 hover:bg-white/5 hover:text-white"
                >
                  <Pencil size={13} /> Edit
                </Link>
                <DeleteButton
                  action={deleteEducation.bind(null, e.id)}
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
