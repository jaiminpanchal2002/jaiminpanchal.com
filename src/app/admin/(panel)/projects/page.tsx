import Link from "next/link";
import { Pencil, Star, Eye, EyeOff } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteProject } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    include: { category: true },
  });

  return (
    <div className="px-8 py-8">
      <PageHeader
        title="Projects"
        subtitle="Drives the Projects section on the public site."
        action={{ href: "/admin/projects/new", label: "New project" }}
      />

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-sm text-white/50">No projects yet.</p>
          <Link
            href="/admin/projects/new"
            className="mt-2 inline-block text-sm text-[#B600A8] hover:underline"
          >
            Add your first project
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.03]">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-white">
                    {project.name}
                  </p>
                  {project.featured ? (
                    <Star size={13} className="text-[#B600A8]" fill="#B600A8" />
                  ) : null}
                  {project.published ? (
                    <Eye size={13} className="text-white/30" />
                  ) : (
                    <EyeOff size={13} className="text-white/30" />
                  )}
                </div>
                <p className="truncate text-xs text-white/40">
                  {project.category?.name ?? "No category"}
                  {project.summary ? ` — ${project.summary}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <Pencil size={13} />
                  Edit
                </Link>
                <DeleteButton
                  action={deleteProject.bind(null, project.id)}
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
