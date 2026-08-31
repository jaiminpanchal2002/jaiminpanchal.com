import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SkillCategoryForm } from "@/components/admin/SkillCategoryForm";
import { createSkillCategory } from "../actions";

export default function NewSkillCategoryPage() {
  return (
    <div className="px-8 py-8">
      <Link
        href="/admin/skills"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} /> Back to skills
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-white">New category</h1>
      <SkillCategoryForm action={createSkillCategory} />
    </div>
  );
}
