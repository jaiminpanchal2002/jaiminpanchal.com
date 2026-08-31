import Link from "next/link";
import { Pencil, FileText } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteResume } from "./actions";

export const dynamic = "force-dynamic";

export default async function ResumesPage() {
  const resumes = await prisma.resume.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="px-8 py-8">
      <PageHeader
        title="Resumes"
        subtitle="Maintain multiple versions to target different roles."
        action={{ href: "/admin/resumes/new", label: "New resume" }}
      />

      {resumes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-sm text-white/50">No resume versions yet.</p>
          <Link
            href="/admin/resumes/new"
            className="mt-2 inline-block text-sm text-[#B600A8] hover:underline"
          >
            Add your first resume
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.03]">
          {resumes.map((resume) => (
            <li
              key={resume.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-white/30" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {resume.name}
                    {resume.version ? (
                      <span className="ml-2 text-xs text-white/40">
                        {resume.version}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-white/40">
                    {resume.targetRole ?? "No target role"}
                    {resume.content ? "" : " · no text yet"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/resumes/${resume.id}`}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/60 hover:bg-white/5 hover:text-white"
                >
                  <Pencil size={13} /> Edit
                </Link>
                <DeleteButton
                  action={deleteResume.bind(null, resume.id)}
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
