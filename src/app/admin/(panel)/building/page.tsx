import Link from "next/link";
import { Pencil, Hammer } from "lucide-react";
import { prisma } from "@/lib/db";
import { parseStringArray } from "@/lib/json";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteBuilding } from "./actions";

export const dynamic = "force-dynamic";

export default async function BuildingPage() {
  const items = await prisma.building.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="px-8 py-8">
      <PageHeader
        title="Currently Building"
        subtitle="Live status of what you're working on."
        action={{ href: "/admin/building/new", label: "New item" }}
      />
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-sm text-white/50">Nothing here yet.</p>
          <Link
            href="/admin/building/new"
            className="mt-2 inline-block text-sm text-[#B600A8] hover:underline"
          >
            Add what you&apos;re building
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.03]">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <Hammer size={16} className="text-white/30" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {item.title}
                    <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-white/50">
                      {item.status}
                    </span>
                  </p>
                  <p className="text-xs text-white/40">
                    {item.progress}% · {parseStringArray(item.tech).join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/building/${item.id}`}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/60 hover:bg-white/5 hover:text-white"
                >
                  <Pencil size={13} /> Edit
                </Link>
                <DeleteButton
                  action={deleteBuilding.bind(null, item.id)}
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
