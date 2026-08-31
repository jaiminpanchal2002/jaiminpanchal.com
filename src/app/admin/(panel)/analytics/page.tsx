import { prisma } from "@/lib/db";
import {
  APPLICATION_STATUSES,
  INTERVIEW_STATUSES,
  type ApplicationStatus,
} from "@/lib/jobs/constants";

export const dynamic = "force-dynamic";

const NOT_APPLIED: ApplicationStatus[] = ["Saved", "Interested", "Withdrawn"];

function pct(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}

function Bar({
  label,
  value,
  max,
  accent = "#B600A8",
}: {
  label: string;
  value: number;
  max: number;
  accent?: string;
}) {
  const width = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-40 shrink-0 truncate text-xs text-white/50">
        {label}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full"
          style={{ width: `${width}%`, background: accent }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-xs text-white/60">
        {value}
      </span>
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs uppercase tracking-widest text-white/40">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      {hint ? <p className="mt-1 text-xs text-white/40">{hint}</p> : null}
    </div>
  );
}

export default async function AnalyticsPage() {
  const applications = await prisma.jobApplication.findMany();
  const total = applications.length;

  const statusCounts = new Map<string, number>();
  const sourceCounts = new Map<string, number>();
  const monthCounts = new Map<string, number>();

  for (const app of applications) {
    statusCounts.set(app.status, (statusCounts.get(app.status) ?? 0) + 1);
    const source = app.source ?? "unknown";
    sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
    const d = app.dateApplied ?? app.createdAt;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1);
  }

  const applied = applications.filter(
    (a) => !NOT_APPLIED.includes(a.status as ApplicationStatus),
  ).length;
  const interviewed = applications.filter((a) =>
    (INTERVIEW_STATUSES as string[]).includes(a.status) || a.status === "Offer",
  ).length;
  const offers = statusCounts.get("Offer") ?? 0;
  const rejected = statusCounts.get("Rejected") ?? 0;

  const statusMax = Math.max(1, ...Array.from(statusCounts.values()));
  const sourceMax = Math.max(1, ...Array.from(sourceCounts.values()));

  // Last 6 months.
  const months: { key: string; count: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push({ key, count: monthCounts.get(key) ?? 0 });
  }
  const monthMax = Math.max(1, ...months.map((m) => m.count));

  return (
    <div className="px-8 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Job Analytics</h1>
        <p className="mt-1 text-sm text-white/50">
          Conversion and pipeline health across your applications.
        </p>
      </header>

      {total === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-sm text-white/50">No application data yet.</p>
          <p className="mt-1 text-xs text-white/30">
            Analytics appear once you start tracking applications.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Metric label="Total" value={String(total)} hint={`${applied} applied`} />
            <Metric
              label="Interview rate"
              value={`${pct(interviewed, applied)}%`}
              hint={`${interviewed} reached interview`}
            />
            <Metric
              label="Offer rate"
              value={`${pct(offers, applied)}%`}
              hint={`${offers} offer${offers === 1 ? "" : "s"}`}
            />
            <Metric
              label="Rejection rate"
              value={`${pct(rejected, applied)}%`}
              hint={`${rejected} rejected`}
            />
          </section>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/60">
                By status
              </h2>
              <div className="space-y-2.5">
                {APPLICATION_STATUSES.filter(
                  (s) => (statusCounts.get(s) ?? 0) > 0,
                ).map((s) => (
                  <Bar
                    key={s}
                    label={s}
                    value={statusCounts.get(s) ?? 0}
                    max={statusMax}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/60">
                By source
              </h2>
              <div className="space-y-2.5">
                {Array.from(sourceCounts.entries())
                  .sort((a, b) => b[1] - a[1])
                  .map(([source, count]) => (
                    <Bar
                      key={source}
                      label={source}
                      value={count}
                      max={sourceMax}
                      accent="#7621B0"
                    />
                  ))}
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/60">
              Applications over time
            </h2>
            <div className="flex items-end gap-3" style={{ height: 140 }}>
              {months.map((m) => (
                <div
                  key={m.key}
                  className="flex flex-1 flex-col items-center justify-end gap-2"
                >
                  <div
                    className="w-full rounded-t bg-[#B600A8]"
                    style={{
                      height: `${(m.count / monthMax) * 100}%`,
                      minHeight: m.count > 0 ? 4 : 0,
                    }}
                  />
                  <span className="text-[0.65rem] text-white/40">
                    {m.key.slice(2)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
