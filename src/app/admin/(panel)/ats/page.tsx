import { prisma } from "@/lib/db";
import { parseStringArray } from "@/lib/json";
import { getAIProvider } from "@/lib/ai/provider";
import { PageHeader } from "@/components/admin/PageHeader";
import { AtsAnalyzer } from "@/components/admin/AtsAnalyzer";

export const dynamic = "force-dynamic";

export default async function AtsPage() {
  const [resumes, jobs, analyses] = await Promise.all([
    prisma.resume.findMany({
      where: { content: { not: null } },
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true, version: true },
    }),
    prisma.job.findMany({
      orderBy: { discoveredAt: "desc" },
      take: 30,
      select: { id: true, title: true, company: true },
    }),
    prisma.aTSAnalysis.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { job: { select: { title: true } } },
    }),
  ]);

  const aiOn = getAIProvider().available;

  return (
    <div className="px-8 py-8">
      <PageHeader
        title="ATS Resume Analyzer"
        subtitle="Score a resume against a job description — keyword, skill, and formatting analysis."
      />

      <div className="mb-5 flex items-center gap-2 text-xs">
        <span
          className={`h-2 w-2 rounded-full ${aiOn ? "bg-emerald-400" : "bg-white/30"}`}
        />
        <span className="text-white/50">
          {aiOn
            ? "AI enhancement active — analyses include tailored LLM recommendations."
            : "Running in deterministic mode. Set AI_PROVIDER_API_KEY for AI-enhanced recommendations."}
        </span>
      </div>

      <AtsAnalyzer
        resumes={resumes.map((r) => ({
          id: r.id,
          label: `${r.name}${r.version ? ` (${r.version})` : ""}`,
        }))}
        jobs={jobs.map((j) => ({ id: j.id, label: `${j.title} — ${j.company}` }))}
      />

      {analyses.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/60">
            Recent analyses
          </h2>
          <ul className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.03]">
            {analyses.map((a) => {
              const missing = parseStringArray(a.missingSkills);
              return (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-4 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-white/80">
                      {a.job?.title ?? "Pasted job description"}
                    </p>
                    <p className="truncate text-xs text-white/40">
                      {missing.length > 0
                        ? `Gaps: ${missing.slice(0, 6).join(", ")}`
                        : "No skill gaps"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/40">
                      {a.createdAt.toLocaleDateString()}
                    </span>
                    <span className="rounded-full border border-white/15 px-2.5 py-1 text-xs font-semibold text-white">
                      {a.score}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
