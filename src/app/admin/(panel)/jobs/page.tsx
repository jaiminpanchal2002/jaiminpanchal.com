import Link from "next/link";
import { Bookmark, X, Send, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";
import { parseJson, parseStringArray } from "@/lib/json";
import type { MatchReasons } from "@/lib/matching";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SyncJobsPanel } from "@/components/admin/SyncJobsButton";
import { saveJob, ignoreJob, trackJob, deleteJob } from "./actions";

export const dynamic = "force-dynamic";
// Live scrapes can take longer than the 10s default (Vercel Hobby allows 60s;
// Pro allows up to 300s). Keep Sync limits modest on Hobby.
export const maxDuration = 60;

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-300 border-emerald-400/40";
  if (score >= 60) return "text-amber-300 border-amber-400/40";
  return "text-white/50 border-white/20";
}

function IconAction({
  action,
  children,
  title,
}: {
  action: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        title={title}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-white/60 transition-colors hover:bg-white/5 hover:text-white"
      >
        {children}
      </button>
    </form>
  );
}

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    where: { status: { not: "ignored" } },
    orderBy: [{ matchScore: "desc" }, { discoveredAt: "desc" }],
  });

  return (
    <div className="px-8 py-8">
      <PageHeader
        title="Job Discovery"
        subtitle="Ranked by a transparent match against your skills & titles."
        action={{ href: "/admin/jobs/new", label: "Add job" }}
      />

      <div className="mb-6">
        <SyncJobsPanel />
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-sm text-white/50">No jobs yet.</p>
          <p className="mt-1 text-xs text-white/30">
            Add one manually, or sync from Apify above.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {jobs.map((job) => {
            const reasons = parseJson<MatchReasons | null>(
              job.matchReasons,
              null,
            );
            const skills = parseStringArray(job.skills);
            const score = job.matchScore ?? 0;

            return (
              <li
                key={job.id}
                className={`rounded-2xl border bg-white/[0.03] p-5 ${
                  job.status === "saved"
                    ? "border-[#B600A8]/30"
                    : "border-white/10"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${scoreColor(score)}`}
                      >
                        {score}% match
                      </span>
                      <p className="text-sm font-medium text-white">
                        {job.title}
                      </p>
                      {job.status === "saved" ? (
                        <span className="rounded-full bg-[#B600A8]/20 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-[#e084d8]">
                          Saved
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs text-white/40">
                      {job.company}
                      {job.location ? ` · ${job.location}` : ""}
                      {job.workMode ? ` · ${job.workMode}` : ""}
                      {job.salary ? ` · ${job.salary}` : ""}
                    </p>
                  </div>
                  {job.url ? (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex shrink-0 items-center gap-1 text-xs text-white/40 hover:text-white"
                    >
                      Open <ExternalLink size={12} />
                    </a>
                  ) : null}
                </div>

                {reasons ? (
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/40">
                    <span>Skills {reasons.skill}%</span>
                    <span>Role {reasons.role}%</span>
                    <span>Location {reasons.location}%</span>
                    {reasons.matchedSkills.length > 0 ? (
                      <span className="text-emerald-300/70">
                        ✓ {reasons.matchedSkills.join(", ")}
                      </span>
                    ) : null}
                    {reasons.missingSkills.length > 0 ? (
                      <span className="text-white/30">
                        missing: {reasons.missingSkills.join(", ")}
                      </span>
                    ) : null}
                  </div>
                ) : skills.length > 0 ? (
                  <p className="mt-3 text-xs text-white/40">
                    {skills.join(", ")}
                  </p>
                ) : null}

                <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3">
                  {job.status !== "saved" ? (
                    <IconAction
                      action={saveJob.bind(null, job.id)}
                      title="Save job"
                    >
                      <Bookmark size={13} /> Save
                    </IconAction>
                  ) : null}
                  <IconAction
                    action={trackJob.bind(null, job.id)}
                    title="Track as application"
                  >
                    <Send size={13} /> Track
                  </IconAction>
                  <IconAction
                    action={ignoreJob.bind(null, job.id)}
                    title="Ignore job"
                  >
                    <X size={13} /> Ignore
                  </IconAction>
                  <DeleteButton
                    action={deleteJob.bind(null, job.id)}
                    compact
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
