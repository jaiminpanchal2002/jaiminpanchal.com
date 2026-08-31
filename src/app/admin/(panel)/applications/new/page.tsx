import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ApplicationForm } from "@/components/admin/ApplicationForm";
import { createApplication } from "../actions";

export default function NewApplicationPage() {
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
        New application
      </h1>
      <ApplicationForm action={createApplication} />
    </div>
  );
}
