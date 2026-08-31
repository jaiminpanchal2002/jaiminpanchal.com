import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { parseStringArray } from "@/lib/json";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { updateExperience } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({
  params,
}: {
  params: { id: string };
}) {
  const exp = await prisma.experience.findUnique({ where: { id: params.id } });
  if (!exp) notFound();

  return (
    <div className="px-8 py-8">
      <Link
        href="/admin/experience"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} /> Back to experience
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-white">Edit role</h1>
      <ExperienceForm
        action={updateExperience.bind(null, exp.id)}
        experience={{
          position: exp.position,
          company: exp.company,
          period: exp.period,
          location: exp.location,
          description: exp.description,
          achievements: parseStringArray(exp.achievements),
          technologies: parseStringArray(exp.technologies),
          current: exp.current,
          order: exp.order,
        }}
      />
    </div>
  );
}
