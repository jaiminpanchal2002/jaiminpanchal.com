import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ResumeForm } from "@/components/admin/ResumeForm";
import { createResume } from "../actions";

export default function NewResumePage() {
  return (
    <div className="px-8 py-8">
      <Link
        href="/admin/resumes"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} />
        Back to resumes
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-white">New resume</h1>
      <ResumeForm action={createResume} />
    </div>
  );
}
