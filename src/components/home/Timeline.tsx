"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Plus } from "lucide-react";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { Reveal } from "@/components/motion/Reveal";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { cn, formatRange } from "@/lib/utils";
import type { Experience } from "@/content/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const typeLabel: Record<Experience["employmentType"], string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  freelance: "Freelance",
  internship: "Internship",
};

/** Vertical career timeline: the progress line draws with scroll; each role expands for detail. */
export function Timeline({ items, compact = false, preview = false }: { items: Experience[]; compact?: boolean; preview?: boolean }) {
  const root = useRef<HTMLOListElement>(null);
  const { reduceMotion } = useExperience();
  const [open, setOpen] = useState<string | null>(compact ? null : (items[0]?._id ?? null));

  useGSAP(
    () => {
      if (reduceMotion) return;
      gsap.fromTo(
        "[data-progress]",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 60%", scrub: 0.6 } },
      );
    },
    { scope: root, dependencies: [reduceMotion] },
  );

  return (
    <ol ref={root} className="relative grid gap-3 pl-8 md:pl-12">
      <span aria-hidden className="absolute left-[7px] top-2 bottom-2 w-px bg-line md:left-[11px]" />
      <span aria-hidden data-progress className="absolute left-[7px] top-2 bottom-2 w-px origin-top bg-accent md:left-[11px]" />
      {items.map((e, i) => {
        const isOpen = open === e._id;
        const range = formatRange(e.startDate, e.endDate, e.current);
        return (
          <Reveal as="li" key={e._id} delay={i * 80} className="relative">
            <span aria-hidden className={cn("absolute -left-8 top-6 size-[15px] rounded-full border-2 bg-bg md:-left-12 md:size-[23px]", e.current ? "border-accent" : "border-line-strong")}>
              {e.current && <span className="absolute inset-1 rounded-full bg-accent md:inset-1.5" />}
            </span>
            <div className={cn("rounded-[var(--radius-lg)] border transition-colors", isOpen ? "border-line-strong bg-surface/60" : "border-transparent hover:border-line")}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`exp-${e._id}`}
                onClick={() => setOpen(isOpen ? null : e._id)}
                className="grid w-full grid-cols-[1fr_auto] items-start gap-4 p-5 text-left md:p-6"
              >
                <span>
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-3">
                    {range && <span>{range}</span>}
                    <span>{typeLabel[e.employmentType]}</span>
                    <VerificationBadge verified={e.verified} />
                  </span>
                  <span className="mt-2 block font-display text-[length:var(--step-2)] leading-tight tracking-[-0.01em] text-fg">{e.role}</span>
                  <span className="mt-1 block text-fg-2">{e.company}</span>
                </span>
                <Plus className={cn("mt-2 size-5 text-fg-2 transition-transform duration-300 ease-[var(--ease-out)]", isOpen && "rotate-45 text-accent")} aria-hidden />
              </button>
              <div id={`exp-${e._id}`} hidden={!isOpen} className="px-5 pb-6 md:px-6">
                <p className="max-w-[62ch] text-fg-2">{e.summary}</p>
                {e.responsibilities.length > 0 && (
                  <ul className="mt-4 grid gap-1.5 text-fg-2 list-disc pl-5 marker:text-accent">
                    {e.responsibilities.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                )}
                {e.achievements.length > 0 && (
                  <div className="mt-5">
                    <h4 className="text-sm font-medium text-fg">Highlights</h4>
                    <ul className="mt-2 grid gap-1.5 text-fg-2 list-disc pl-5 marker:text-accent">
                      {e.achievements.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {e.technologies.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                    {e.technologies.map((t) => (
                      <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-fg-2">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                {e.projectSlugs.length > 0 && (
                  <p className="mt-5 text-sm text-fg-2">
                    Related:{" "}
                    {e.projectSlugs.map((s, j) => (
                      <span key={s}>
                        <Link href={`/work/${s}`} className="text-fg underline decoration-accent underline-offset-4">
                          {s.replace(/-/g, " ")}
                        </Link>
                        {j < e.projectSlugs.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                )}
                {preview && e.verificationNotes && <p className="mt-4 text-sm text-danger">Preview note (hidden in production): {e.verificationNotes}</p>}
              </div>
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
}
