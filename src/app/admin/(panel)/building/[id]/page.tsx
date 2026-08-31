import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { parseStringArray } from "@/lib/json";
import { BuildingForm } from "@/components/admin/BuildingForm";
import { updateBuilding } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditBuildingPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await prisma.building.findUnique({ where: { id: params.id } });
  if (!item) notFound();

  return (
    <div className="px-8 py-8">
      <Link
        href="/admin/building"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} /> Back
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-white">Edit item</h1>
      <BuildingForm
        action={updateBuilding.bind(null, item.id)}
        item={{
          title: item.title,
          status: item.status,
          progress: item.progress,
          description: item.description,
          tech: parseStringArray(item.tech),
          link: item.link,
          order: item.order,
        }}
      />
    </div>
  );
}
