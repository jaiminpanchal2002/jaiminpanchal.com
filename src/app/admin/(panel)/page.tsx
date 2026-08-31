import Link from "next/link";
import {
  FolderKanban,
  Briefcase,
  Sparkles,
  KanbanSquare,
  Bookmark,
  Mail,
  Eye,
  CalendarClock,
  Users,
  type LucideIcon,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { AnimatedCounter } from "@/components/admin/AnimatedCounter";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: number;
  hint?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-white/40">
          {label}
        </p>
        <Icon size={18} className="text-white/40" />
      </div>
      <AnimatedCounter
        value={value}
        className="mt-3 block text-3xl font-semibold text-white"
      />
      {hint ? <p className="mt-1 text-xs text-white/40">{hint}</p> : null}
    </div>
  );
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default async function DashboardPage() {
  const since = new Date();
  since.setDate(since.getDate() - 13);
  const sinceDay = startOfDay(since);
  const now = new Date();
  const todayStart = startOfDay(now);

  const [
    projects,
    featuredProjects,
    experience,
    skills,
    applications,
    offers,
    interviews,
    savedJobs,
    unreadMessages,
    portfolioViews,
    viewEvents,
    followUps,
    recentApplications,
    recentActivity,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { featured: true } }),
    prisma.experience.count(),
    prisma.skill.count(),
    prisma.jobApplication.count(),
    prisma.jobApplication.count({ where: { status: "Offer" } }),
    prisma.interview.count(),
    prisma.job.count({ where: { status: "saved" } }),
    prisma.contactMessage.count({ where: { status: "unread" } }),
    prisma.analyticsEvent.count({ where: { type: "page_view" } }),
    prisma.analyticsEvent.findMany({
      where: { type: "page_view", createdAt: { gte: sinceDay } },
      select: { createdAt: true },
    }),
    prisma.jobApplication.findMany({
      where: { followUpDate: { not: null } },
      orderBy: { followUpDate: "asc" },
      take: 6,
    }),
    prisma.jobApplication.findMany({ orderBy: { updatedAt: "desc" }, take: 6 }),
    prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const successRate =
    applications > 0 ? Math.round((offers / applications) * 100) : 0;

  // Build 14-day view buckets.
  const days: { key: string; label: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(todayStart);
    d.setDate(d.getDate() - i);
    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { day: "numeric" }),
      count: 0,
    });
  }
  const dayIndex = new Map(days.map((d, i) => [d.key, i]));
  for (const ev of viewEvents) {
    const key = startOfDay(ev.createdAt).toISOString().slice(0, 10);
    const idx = dayIndex.get(key);
    if (idx !== undefined) days[idx].count += 1;
  }
  const viewMax = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="px-8 py-8">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#C81FB4]">
          Jaimin OS
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-white/50">
          Live overview of your portfolio and job search.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Portfolio views"
          value={portfolioViews}
          hint="all-time"
          icon={Eye}
        />
        <StatCard
          label="Projects"
          value={projects}
          hint={`${featuredProjects} featured`}
          icon={FolderKanban}
        />
        <StatCard
          label="Experience"
          value={experience}
          hint="roles on timeline"
          icon={Briefcase}
        />
        <StatCard label="Skills" value={skills} hint="listed" icon={Sparkles} />
        <StatCard
          label="Applications"
          value={applications}
          hint={`${successRate}% offer rate`}
          icon={KanbanSquare}
        />
        <StatCard
          label="Interviews"
          value={interviews}
          hint="scheduled / logged"
          icon={Users}
        />
        <StatCard
          label="Saved jobs"
          value={savedJobs}
          hint="in discovery"
          icon={Bookmark}
        />
        <StatCard
          label="Unread messages"
          value={unreadMessages}
          hint="from contact form"
          icon={Mail}
        />
      </section>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Views chart */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:col-span-2">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white/60">
            Portfolio views · last 14 days
          </h2>
          <div className="flex items-end gap-1.5" style={{ height: 120 }}>
            {days.map((d) => (
              <div
                key={d.key}
                className="group flex flex-1 flex-col items-center justify-end gap-1.5"
                title={`${d.count} views`}
              >
                <div
                  className="w-full rounded-t bg-[#C81FB4]/70 transition-colors group-hover:bg-[#C81FB4]"
                  style={{
                    height: `${(d.count / viewMax) * 100}%`,
                    minHeight: d.count > 0 ? 3 : 0,
                  }}
                />
                <span className="font-mono text-[0.6rem] text-white/30">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming follow-ups */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center gap-2">
            <CalendarClock size={16} className="text-[#C81FB4]" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">
              Follow-ups
            </h2>
          </div>
          {followUps.length === 0 ? (
            <p className="py-8 text-center text-sm text-white/40">
              No follow-ups scheduled. Add a follow-up date on any application.
            </p>
          ) : (
            <ul className="space-y-3">
              {followUps.map((app) => {
                const due = app.followUpDate as Date;
                const overdue = due < todayStart;
                return (
                  <li key={app.id} className="flex items-start gap-3">
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                        overdue ? "bg-red-400" : "bg-emerald-400"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-white/80">
                        {app.jobTitle}
                      </p>
                      <p className="text-xs text-white/40">
                        {app.company} ·{" "}
                        <span className={overdue ? "text-red-300" : ""}>
                          {overdue ? "overdue " : ""}
                          {due.toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">
              Recent applications
            </h2>
            <Link
              href="/admin/applications"
              className="text-xs text-white/40 hover:text-white"
            >
              View all →
            </Link>
          </div>
          {recentApplications.length === 0 ? (
            <p className="py-8 text-center text-sm text-white/40">
              No applications yet.
            </p>
          ) : (
            <ul className="divide-y divide-white/5">
              {recentApplications.map((app) => (
                <li
                  key={app.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {app.jobTitle}
                    </p>
                    <p className="text-xs text-white/40">{app.company}</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[0.65rem] uppercase tracking-wider text-white/60">
                    {app.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/60">
            Activity
          </h2>
          {recentActivity.length === 0 ? (
            <p className="py-8 text-center text-sm text-white/40">
              No activity recorded yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((entry) => (
                <li key={entry.id} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C81FB4]" />
                  <div>
                    <p className="text-sm text-white/80">{entry.message}</p>
                    <p className="text-xs text-white/30">
                      {entry.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
