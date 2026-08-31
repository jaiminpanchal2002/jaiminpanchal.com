import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { parseStringArray } from "@/lib/json";
import { ResumeForm } from "@/components/admin/ResumeForm";
import { updateResume } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditResumePage({
  params,
}: {
  params: { id: string };
}) {
  const resume = await prisma.resume.findUnique({ where: { id: params.id } });
  if (!resume) notFound();

  return (
    <div className="px-8 py-8">
      <Link
        href="/admin/resumes"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} />
        Back to resumes
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-white">Edit resume</h1>
      <ResumeForm
        action={updateResume.bind(null, resume.id)}
        resume={{
          name: resume.name,
          version: resume.version,
          targetRole: resume.targetRole,
          summary: resume.summary,
          content: resume.content,
          fileUrl: resume.fileUrl,
          skills: parseStringArray(resume.skills),
          status: resume.status,
        }}
      />
    </div>
  );
}
