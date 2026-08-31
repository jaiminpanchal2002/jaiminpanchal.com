import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { createService } from "../actions";

export default function NewServicePage() {
  return (
    <div className="px-8 py-8">
      <Link
        href="/admin/services"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} />
        Back to services
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-white">New service</h1>
      <ServiceForm action={createService} />
    </div>
  );
}
