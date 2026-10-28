import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectArt } from "@/components/work/ProjectArt";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { buttonClass } from "@/components/ui/styles";
import type { Project } from "@/content/types";

/**
 * Work index: one row per project on the column grid. The title carries the row in the
 * expanded face; the cover sits in the last column and opens up on hover (fine pointers).
 */
export function SelectedWork({ projects }: { projects: Project[] }) {
  return (
    <section aria-labelledby="work-title" className="section-y">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SplitHeading as="h2" id="work-title" text="Selected work" className="display text-[length:var(--step-5)]" />
          {projects.length > 0 && (
            <Link href="/work" className={buttonClass("secondary")}>
              All projects
            </Link>
          )}
        </div>
        {projects.length === 0 ? (
          <Reveal className="mt-14 grid gap-6 border-y border-line py-12">
            <p className="max-w-[52ch] text-[length:var(--step-1)] text-fg-2">
              Project write-ups are being prepared and verified. In the meantime I&apos;m happy to walk through recent work in conversation.
            </p>
            <div>
              <Link href="/contact" className={buttonClass("secondary")}>
                Let&apos;s connect
              </Link>
            </div>
          </Reveal>
        ) : (
          <ol className="mt-14 border-b border-line">
            {projects.map((p, i) => (
              <Reveal as="li" key={p._id} delay={i * 60} className="border-t border-line">
                <Link href={`/work/${p.slug}`} className="group grid items-center gap-5 py-7 md:grid-cols-4 md:gap-0 md:py-9">
                  <h3 className="display text-[clamp(1.6rem,0.8rem+3.2vw,3.6rem)] transition-transform duration-500 ease-[var(--ease-out)] md:col-span-2 md:pr-6 [@media(hover:hover)]:group-hover:translate-x-2">
                    {p.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-fg-3 md:pl-[var(--gutter)]">
                    <span>{p.category}</span>
                    {p.year && <span>{p.year}</span>}
                    <VerificationBadge verified={p.verified} />
                    <p className="w-full text-fg-2 md:max-w-[30ch]">{p.summary}</p>
                  </div>
                  <div className="relative flex items-center gap-4 md:pl-[var(--gutter)]">
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-lg)] border border-line transition-[clip-path] duration-500 ease-[var(--ease-out)] [@media(hover:hover)]:[clip-path:inset(8%_8%_8%_8%_round_20px)] [@media(hover:hover)]:group-hover:[clip-path:inset(0_0_0_0_round_20px)]">
                      <ProjectArt project={p} className="h-full w-full" sizes="(min-width: 768px) 22vw, 100vw" />
                    </div>
                    <ArrowUpRight className="hidden size-6 shrink-0 text-fg-3 transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-fg md:block" aria-hidden />
                  </div>
                </Link>
              </Reveal>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
