import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BuildingForm } from "@/components/admin/BuildingForm";
import { createBuilding } from "../actions";

export default function NewBuildingPage() {
  return (
    <div className="px-8 py-8">
      <Link
        href="/admin/building"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} /> Back
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-white">New item</h1>
      <BuildingForm action={createBuilding} />
    </div>
  );
}
