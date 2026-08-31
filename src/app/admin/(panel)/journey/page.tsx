import Link from "next/link";
import { Pencil, Route } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteJourneyStep } from "./actions";

export const dynamic = "force-dynamic";

export default async function JourneyPage() {
  const steps = await prisma.journeyStep.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="px-8 py-8">
      <PageHeader
        title="Engineering Journey"
        subtitle="Your progression, shown on the homepage."
        action={{ href: "/admin/journey/new", label: "New step" }}
      />
      {steps.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-sm text-white/50">No journey steps yet.</p>
          <Link
            href="/admin/journey/new"
            className="mt-2 inline-block text-sm text-[#B600A8] hover:underline"
          >
            Add your first step
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.03]">
          {steps.map((s, i) => (
            <li
              key={s.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-white/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Route size={16} className="text-white/30" />
                <div>
                  <p className="text-sm font-medium text-white">{s.step}</p>
                  <p className="text-xs text-white/40">{s.note ?? ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/journey/${s.id}`}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/60 hover:bg-white/5 hover:text-white"
                >
                  <Pencil size={13} /> Edit
                </Link>
                <DeleteButton
                  action={deleteJourneyStep.bind(null, s.id)}
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
