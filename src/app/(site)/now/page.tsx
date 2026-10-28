import type { Metadata } from "next";
import { PageHeader, EmptyState } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { getNowPage } from "@/content/api";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({ title: "Now", description: "What Jaimin Panchal is focused on right now.", path: "/now" });

export default async function NowPage() {
  const now = await getNowPage();
  return (
    <>
      <PageHeader title="Now" intro={now?.intro}>
        {now && <p className="mt-6 text-sm text-fg-3">Last updated {formatDate(now.updatedAt)}</p>}
      </PageHeader>
      <section className="container-site max-w-4xl pb-[var(--space-section)]">
        {!now ? (
          <EmptyState title="Nothing to share yet." body="This page will list current work and focus areas once published." />
        ) : (
          <dl className="grid">
            {now.items.map((i, idx) => (
              <Reveal key={i.label} delay={idx * 80} className="grid gap-2 border-t border-line py-8 md:grid-cols-[12rem_1fr] md:gap-10">
                <dt className="font-display text-[length:var(--step-1)] text-accent">{i.label}</dt>
                <dd className="text-[length:var(--step-1)] leading-snug text-fg">{i.body}</dd>
              </Reveal>
            ))}
          </dl>
        )}
      </section>
    </>
  );
}
