import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { EducationForm } from "@/components/admin/EducationForm";
import { updateEducation } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditEducationPage({
  params,
}: {
  params: { id: string };
}) {
  const e = await prisma.education.findUnique({ where: { id: params.id } });
  if (!e) notFound();

  return (
    <div className="px-8 py-8">
      <Link
        href="/admin/education"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} /> Back
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-white">Edit education</h1>
      <EducationForm
        action={updateEducation.bind(null, e.id)}
        education={{
          institution: e.institution,
          degree: e.degree,
          field: e.field,
          period: e.period,
          description: e.description,
          order: e.order,
        }}
      />
    </div>
  );
}
