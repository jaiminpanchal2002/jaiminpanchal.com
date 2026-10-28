"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { SplitHeading } from "@/components/motion/Reveal";
import type { HomePage } from "@/content/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "How I build": a technical flow. A signal travels along the connector as the visitor
 * scrolls, lighting each stage in order. Stages are a real ordered list.
 */
export function Process({ steps }: { steps: HomePage["processSteps"] }) {
  const root = useRef<HTMLElement>(null);
  const { reduceMotion } = useExperience();

  useGSAP(
    () => {
      if (reduceMotion) {
        gsap.set("[data-step]", { attr: { "data-lit": "" } });
        return;
      }
      const stepsEl = gsap.utils.toArray<HTMLElement>("[data-step]");
      gsap.fromTo(
        "[data-signal]",
        { scaleX: 0, scaleY: 0 },
        {
          scaleX: 1,
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-flow]",
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.8,
            // Light each stage as the signal reaches it (and un-light when scrolling back).
            onUpdate: (self) => stepsEl.forEach((el, i) => el.toggleAttribute("data-lit", self.progress >= i / stepsEl.length + 0.02)),
          },
        },
      );
    },
    { scope: root, dependencies: [reduceMotion] },
  );

  return (
    <section ref={root} aria-labelledby="process-title" className="section-y relative overflow-hidden">
      <div className="container-site relative">
        <SplitHeading as="h2" id="process-title" text="How I build" className="display text-[length:var(--step-5)]" />
        <p className="mt-6 max-w-[52ch] text-[length:var(--step-1)] leading-snug text-fg-2">Engineering judgement and product thinking, applied in the same order every time.</p>
        <ol data-flow className="relative mt-20 grid gap-10 lg:grid-cols-5 lg:gap-6">
          {/* connector: vertical on mobile, horizontal on desktop */}
          <span aria-hidden className="absolute left-[11px] top-0 bottom-0 w-px bg-line lg:left-0 lg:right-0 lg:top-[11px] lg:bottom-auto lg:h-px lg:w-auto" />
          <span
            aria-hidden
            data-signal
            className="absolute left-[11px] top-0 bottom-0 w-px origin-top bg-gradient-to-b from-accent to-cyan lg:left-0 lg:right-0 lg:top-[11px] lg:bottom-auto lg:h-px lg:w-auto lg:origin-left lg:bg-gradient-to-r"
          />
          {steps.map((s, i) => (
            <li key={s.title} data-step className="group relative pl-12 lg:pl-0 lg:pt-14">
              <span
                aria-hidden
                className="absolute left-0 top-0 grid size-[23px] place-items-center rounded-full border border-line-strong bg-bg transition-colors duration-500 group-data-[lit]:border-accent"
              >
                <span className="size-2 rounded-full bg-line-strong transition-colors duration-500 group-data-[lit]:bg-accent" />
              </span>
              <p className="font-display tabular-nums text-sm text-fg-3 transition-colors duration-500 group-data-[lit]:text-accent">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 font-display text-[length:var(--step-2)] leading-tight tracking-[-0.01em] text-fg">{s.title}</h3>
              <p className="mt-3 text-fg-2">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
