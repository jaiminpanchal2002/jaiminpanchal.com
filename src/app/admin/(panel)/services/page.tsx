import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteService } from "./actions";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="px-8 py-8">
      <PageHeader
        title="Services"
        subtitle="Shown on the public landing page."
        action={{ href: "/admin/services/new", label: "New service" }}
      />

      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-sm text-white/50">No services yet.</p>
          <Link
            href="/admin/services/new"
            className="mt-2 inline-block text-sm text-[#B600A8] hover:underline"
          >
            Add your first service
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.03]">
          {services.map((service) => (
            <li
              key={service.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-white/40">
                  {service.number}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">
                    {service.name}
                  </p>
                  <p className="max-w-xl truncate text-xs text-white/40">
                    {service.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/services/${service.id}`}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <Pencil size={13} />
                  Edit
                </Link>
                <DeleteButton
                  action={deleteService.bind(null, service.id)}
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
