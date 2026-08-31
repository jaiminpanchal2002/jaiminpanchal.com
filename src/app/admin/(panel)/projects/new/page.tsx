import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { createProject } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const categories = await prisma.projectCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="px-8 py-8">
      <Link
        href="/admin/projects"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} />
        Back to projects
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-white">New project</h1>
      <ProjectForm action={createProject} categories={categories} />
    </div>
  );
}
