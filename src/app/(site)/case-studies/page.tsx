import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { getCaseStudies } from "@/content/api";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Case studies",
  description: "Long-form case studies by Jaimin Panchal on decisions, trade-offs, execution and results.",
  path: "/case-studies",
});

const templateLabel = { engineering: "Engineering", "product-delivery": "Product delivery" } as const;

export default async function CaseStudiesPage() {
  const studies = await getCaseStudies();
  return (
    <>
      <PageHeader title="Case studies" intro="The reasoning behind the work: context, constraints, decisions, trade-offs and what happened next." />
      <section className="container-site pb-[var(--space-section)]">
        {studies.length === 0 ? (
          <EmptyState title="Case studies are in preparation." body="Each one is published only once every claim in it has been verified." />
        ) : (
          <ol className="border-b border-line">
            {studies.map((s, i) => (
              <Reveal as="li" key={s._id} delay={i * 80} className="border-t border-line">
                <Link href={`/case-studies/${s.slug}`} className="group grid gap-4 py-10 md:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-fg-3">
                      <span>{templateLabel[s.template]}</span>
                      <VerificationBadge verified={s.verified} />
                    </div>
                    <h2 className="mt-3 max-w-[26ch] font-display text-[length:var(--step-3)] leading-[1.08] tracking-[-0.01em] text-fg transition-colors group-hover:text-accent">{s.title}</h2>
                    <p className="mt-3 max-w-[62ch] text-fg-2">{s.excerpt}</p>
                  </div>
                  <ArrowUpRight className="size-7 text-fg-3 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" aria-hidden />
                </Link>
              </Reveal>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}
