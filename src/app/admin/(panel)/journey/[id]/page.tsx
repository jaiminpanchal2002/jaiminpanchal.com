import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { JourneyForm } from "@/components/admin/JourneyForm";
import { updateJourneyStep } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditJourneyPage({
  params,
}: {
  params: { id: string };
}) {
  const step = await prisma.journeyStep.findUnique({ where: { id: params.id } });
  if (!step) notFound();

  return (
    <div className="px-8 py-8">
      <Link
        href="/admin/journey"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} /> Back
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-white">Edit step</h1>
      <JourneyForm
        action={updateJourneyStep.bind(null, step.id)}
        item={{ step: step.step, note: step.note, order: step.order }}
      />
    </div>
  );
}
