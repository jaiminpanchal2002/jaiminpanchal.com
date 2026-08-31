import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { JobForm } from "@/components/admin/JobForm";
import { addJob } from "../actions";

export default function NewJobPage() {
  return (
    <div className="px-8 py-8">
      <Link
        href="/admin/jobs"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} />
        Back to jobs
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-white">Add job</h1>
      <p className="mb-6 max-w-xl text-sm text-white/40">
        Add a job manually. Its match score is computed from the skills you
        enter against your portfolio skills and title.
      </p>
      <JobForm action={addJob} />
    </div>
  );
}
