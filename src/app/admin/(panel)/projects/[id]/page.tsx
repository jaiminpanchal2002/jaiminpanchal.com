import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { parseStringArray } from "@/lib/json";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { updateProject } from "../actions";

export const dynamic = "force-dynamic";

function toDateInput(date: Date | null): string | null {
  if (!date) return null;
  return date.toISOString().slice(0, 10);
}

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const [project, categories] = await Promise.all([
    prisma.project.findUnique({ where: { id: params.id } }),
    prisma.projectCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!project) notFound();

  return (
    <div className="px-8 py-8">
      <Link
        href="/admin/projects"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} />
        Back to projects
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-white">Edit project</h1>
      <ProjectForm
        action={updateProject.bind(null, project.id)}
        categories={categories}
        project={{
          name: project.name,
          slug: project.slug,
          summary: project.summary,
          description: project.description,
          categoryId: project.categoryId,
          technologies: parseStringArray(project.technologies),
          images: parseStringArray(project.images),
          coverUrl: project.coverUrl,
          githubUrl: project.githubUrl,
          liveUrl: project.liveUrl,
          featured: project.featured,
          published: project.published,
          isAiProject: project.isAiProject,
          order: project.order,
          date: toDateInput(project.date),
        }}
      />
    </div>
  );
}
