import Link from "next/link";
import { Pencil, Briefcase } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteExperience } from "./actions";

export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="px-8 py-8">
      <PageHeader
        title="Experience"
        subtitle="Your career timeline on the public site."
        action={{ href: "/admin/experience/new", label: "New role" }}
      />
      {experiences.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-sm text-white/50">No experience yet.</p>
          <Link
            href="/admin/experience/new"
            className="mt-2 inline-block text-sm text-[#B600A8] hover:underline"
          >
            Add your first role
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.03]">
          {experiences.map((exp) => (
            <li
              key={exp.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <Briefcase size={16} className="text-white/30" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {exp.position}
                    <span className="ml-2 text-xs text-white/40">
                      {exp.company}
                    </span>
                  </p>
                  <p className="text-xs text-white/40">
                    {exp.period ?? "No period"}
                    {exp.current ? " · current" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/experience/${exp.id}`}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/60 hover:bg-white/5 hover:text-white"
                >
                  <Pencil size={13} /> Edit
                </Link>
                <DeleteButton
                  action={deleteExperience.bind(null, exp.id)}
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
