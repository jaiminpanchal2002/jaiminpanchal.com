import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { SkillCategoryForm } from "@/components/admin/SkillCategoryForm";
import { updateSkillCategory } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditSkillCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await prisma.skillCategory.findUnique({
    where: { id: params.id },
    include: { skills: { orderBy: { order: "asc" } } },
  });
  if (!category) notFound();

  return (
    <div className="px-8 py-8">
      <Link
        href="/admin/skills"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} /> Back to skills
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-white">Edit category</h1>
      <SkillCategoryForm
        action={updateSkillCategory.bind(null, category.id)}
        category={{
          name: category.name,
          order: category.order,
          skills: category.skills.map((s) => s.name),
        }}
      />
    </div>
  );
}
