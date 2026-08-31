import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { createExperience } from "../actions";

export default function NewExperiencePage() {
  return (
    <div className="px-8 py-8">
      <Link
        href="/admin/experience"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} /> Back to experience
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-white">New role</h1>
      <ExperienceForm action={createExperience} />
    </div>
  );
}
