import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { JourneyForm } from "@/components/admin/JourneyForm";
import { createJourneyStep } from "../actions";

export default function NewJourneyPage() {
  return (
    <div className="px-8 py-8">
      <Link
        href="/admin/journey"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} /> Back
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-white">New step</h1>
      <JourneyForm action={createJourneyStep} />
    </div>
  );
}
