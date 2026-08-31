import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { updateService } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: { id: string };
}) {
  const service = await prisma.service.findUnique({ where: { id: params.id } });
  if (!service) notFound();

  return (
    <div className="px-8 py-8">
      <Link
        href="/admin/services"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} />
        Back to services
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-white">Edit service</h1>
      <ServiceForm
        action={updateService.bind(null, service.id)}
        service={{
          number: service.number,
          name: service.name,
          description: service.description,
          order: service.order,
        }}
      />
    </div>
  );
}
