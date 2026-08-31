import Link from "next/link";
import { Pencil, LayoutGrid, Table as TableIcon } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { KanbanBoard } from "@/components/admin/KanbanBoard";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { deleteApplication } from "./actions";

export const dynamic = "force-dynamic";

function ViewToggle({ view }: { view: string }) {
  const base =
    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors";
  return (
    <div className="flex gap-1 rounded-lg border border-white/10 p-1">
      <Link
        href="/admin/applications"
        className={`${base} ${view === "board" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}
      >
        <LayoutGrid size={15} /> Board
      </Link>
      <Link
        href="/admin/applications?view=table"
        className={`${base} ${view === "table" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}
      >
        <TableIcon size={15} /> Table
      </Link>
    </div>
  );
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: { view?: string };
}) {
  const view = searchParams.view === "table" ? "table" : "board";
  const applications = await prisma.jobApplication.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });

  return (
    <div className="px-8 py-8">
      <PageHeader
        title="Applications"
        subtitle="Track every application through the pipeline."
        action={{ href: "/admin/applications/new", label: "New application" }}
      />

      <div className="mb-5">
        <ViewToggle view={view} />
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-sm text-white/50">No applications yet.</p>
          <p className="mt-1 text-xs text-white/30">
            Add one manually, or track a job from Discovery.
          </p>
        </div>
      ) : view === "board" ? (
        <KanbanBoard applications={applications} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
              <tr>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Applied</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="px-4 py-3 font-medium text-white">
                    {app.jobTitle}
                  </td>
                  <td className="px-4 py-3 text-white/60">{app.company}</td>
                  <td className="px-4 py-3">
                    <StatusSelect id={app.id} status={app.status} />
                  </td>
                  <td className="px-4 py-3 text-white/40">
                    {app.dateApplied
                      ? app.dateApplied.toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/applications/${app.id}`}
                        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/60 hover:bg-white/5 hover:text-white"
                      >
                        <Pencil size={13} /> Edit
                      </Link>
                      <DeleteButton
                        action={deleteApplication.bind(null, app.id)}
                        compact
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
