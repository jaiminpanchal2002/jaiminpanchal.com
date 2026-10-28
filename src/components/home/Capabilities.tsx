"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { SplitHeading } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";
import type { Skill, SkillCategory } from "@/content/types";

/**
 * Capabilities as an index: capability groups set large in the expanded face (an ARIA
 * tab list, arrow keys move between groups), with the selected group's skills beside it.
 * No proficiency percentages.
 */
export function Capabilities({ categories, skills }: { categories: SkillCategory[]; skills: Skill[] }) {
  const cats = categories.filter((c) => skills.some((s) => s.category === c.slug));
  const [active, setActive] = useState(cats[0]?.slug);
  const { reduceMotion } = useExperience();
  const id = useId();
  const current = cats.find((c) => c.slug === active);
  const list = skills.filter((s) => s.category === active);

  const onKey = (e: React.KeyboardEvent, idx: number) => {
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = cats[(idx + dir + cats.length) % cats.length];
    setActive(next.slug);
    document.getElementById(`${id}-tab-${next.slug}`)?.focus();
  };

  return (
    <section aria-labelledby="cap-title" className="section-y">
      <div className="container-site">
        <SplitHeading as="h2" id="cap-title" text="Capabilities" className="display text-[length:var(--step-5)]" />
        <div className="mt-14 grid gap-12 md:grid-cols-4">
          <div role="tablist" aria-label="Capability groups" aria-orientation="vertical" className="flex flex-col md:col-span-2">
            {cats.map((c, i) => {
              const selected = c.slug === active;
              return (
                <button
                  key={c.slug}
                  id={`${id}-tab-${c.slug}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`${id}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(c.slug)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={cn(
                    "font-display group flex items-center justify-between border-t border-line py-4 text-left text-[clamp(1.05rem,0.7rem+1.4vw,1.9rem)] font-bold uppercase leading-tight transition-colors last:border-b",
                    selected ? "text-fg" : "text-fg-3 hover:text-fg-2",
                  )}
                >
                  {c.title}
                  <span aria-hidden className={cn("size-2 rounded-full bg-fg transition-transform duration-300 ease-[var(--ease-out)]", selected ? "scale-100" : "scale-0")} />
                </button>
              );
            })}
          </div>

          <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} tabIndex={0} className="md:col-span-2 md:col-start-3 md:pl-[var(--gutter)]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={reduceMotion ? false : { opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.12 } }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                <p className="text-[length:var(--step-1)] leading-snug text-fg-2">{current?.description}</p>
                <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  {list.map((s) => (
                    <li key={s._id}>
                      <p className="font-display font-semibold text-fg">
                        {s.name}
                        {s.proficiency && <span className="ml-2 text-xs font-normal text-fg-3">{s.proficiency}</span>}
                      </p>
                      <p className="mt-1 text-sm text-fg-3">{s.description}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
