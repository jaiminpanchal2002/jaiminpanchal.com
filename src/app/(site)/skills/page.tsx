import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { getSkills } from "@/content/api";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Skills",
  description: "Engineering capabilities of Jaimin Panchal across backend, frontend, APIs, databases, AI-enabled applications and delivery.",
  path: "/skills",
});

/** Capabilities as structured groups. No progress bars or percentages: descriptions and evidence instead. */
export default async function SkillsPage() {
  const { categories, skills } = await getSkills();
  const groups = categories.map((c) => ({ ...c, skills: skills.filter((s) => s.category === c.slug) })).filter((g) => g.skills.length > 0);

  return (
    <>
      <PageHeader title="Capabilities" intro="What I work with, grouped by the problems it solves. Linked projects show where each skill was applied." />
      <div className="container-site border-b border-line pb-0 mb-[var(--space-section)]">
        {groups.map((g, i) => (
          <Reveal
            as="section"
            key={g._id}
            delay={Math.min(i, 3) * 60}
            aria-labelledby={`cat-${g.slug}`}
            className="grid gap-8 border-t border-line py-12 md:grid-cols-4 md:gap-0"
          >
            <div className="md:col-span-2 md:pr-8">
              <h2 id={`cat-${g.slug}`} className="display text-[length:var(--step-3)] text-fg">{g.title}</h2>
              <p className="mt-3 max-w-[40ch] text-fg-3">{g.description}</p>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 md:col-span-2 md:pl-[var(--gutter)]">
              {g.skills.map((s) => (
                <li key={s._id}>
                  <p className="flex flex-wrap items-center gap-2 font-medium text-fg">
                    {s.name}
                    {s.proficiency && <span className="text-xs font-normal text-fg-3">{s.proficiency}</span>}
                    <VerificationBadge verified={s.verified} />
                  </p>
                  <p className="mt-1 text-sm text-fg-2">{s.description}</p>
                  {s.projectSlugs.length > 0 && (
                    <p className="mt-2 text-xs text-fg-3">
                      Used in{" "}
                      {s.projectSlugs.map((p, j) => (
                        <span key={p}>
                          <Link href={`/work/${p}`} className="text-fg-2 underline decoration-accent/60 underline-offset-2 hover:text-fg">{p.replace(/-/g, " ")}</Link>
                          {j < s.projectSlugs.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </>
  );
}
