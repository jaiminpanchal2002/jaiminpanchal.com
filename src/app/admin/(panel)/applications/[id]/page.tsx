import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { parseStringArray } from "@/lib/json";
import { ApplicationForm } from "@/components/admin/ApplicationForm";
import { updateApplication } from "../actions";

export const dynamic = "force-dynamic";

function toDateInput(date: Date | null): string | null {
  return date ? date.toISOString().slice(0, 10) : null;
}

export default async function EditApplicationPage({
  params,
}: {
  params: { id: string };
}) {
  const app = await prisma.jobApplication.findUnique({
    where: { id: params.id },
  });
  if (!app) notFound();

  return (
    <div className="px-8 py-8">
      <Link
        href="/admin/applications"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} />
        Back to applications
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-white">
        Edit application
      </h1>
      <ApplicationForm
        action={updateApplication.bind(null, app.id)}
        application={{
          company: app.company,
          jobTitle: app.jobTitle,
          status: app.status,
          priority: app.priority,
          workMode: app.workMode,
          location: app.location,
          salary: app.salary,
          source: app.source,
          jobUrl: app.jobUrl,
          recruiter: app.recruiter,
          recruiterContact: app.recruiterContact,
          tags: parseStringArray(app.tags),
          notes: app.notes,
          dateApplied: toDateInput(app.dateApplied),
          followUpDate: toDateInput(app.followUpDate),
        }}
      />
    </div>
  );
}
