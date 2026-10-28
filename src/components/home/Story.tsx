"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { SplitHeading, Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";
import { monogramSvgPath } from "@/components/three/monogram";
import type { HomePage } from "@/content/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Pinned storytelling (desktop, motion allowed): the section pins and the beats advance
 * with scroll, while an abstract orbit visual turns. Mobile / reduced motion: a plain
 * stacked list. No scroll hijacking: native scroll always drives progress.
 */
export function Story({ home, portraitUrl, portraitAlt }: { home: HomePage; portraitUrl: string | null; portraitAlt?: string }) {
  const root = useRef<HTMLElement>(null);
  const { reduceMotion } = useExperience();
  const beats = home.storyBeats;

  useGSAP(
    () => {
      if (reduceMotion) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-beat]");
        const setActive = (idx: number) => items.forEach((el, i) => el.toggleAttribute("data-active", i === idx));
        setActive(0);
        // The section is tall; its inner stage is CSS-sticky. ScrollTrigger only reports progress
        // (no GSAP pinning, so no reparenting or transform conflicts).
        ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => setActive(Math.min(beats.length - 1, Math.floor(self.progress * beats.length))),
        });
        gsap.to("[data-orbit]", {
          rotate: -18,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1 },
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [reduceMotion, beats.length] },
  );

  return (
    <section
      ref={root}
      aria-labelledby="story-title"
      className="relative"
      // Scroll runway for the sticky stage: ~70vh per beat on desktop when motion is allowed.
      style={reduceMotion ? undefined : ({ "--runway": `${100 + beats.length * 70}dvh` } as React.CSSProperties)}
    >
      <div className={cn("lg:h-[var(--runway,auto)]", reduceMotion && "lg:h-auto")}>
      <div
        data-story-pin
        className={cn(
          "container-site grid items-center gap-12 py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-20",
          reduceMotion ? "min-h-[100dvh]" : "lg:sticky lg:top-0 lg:h-[100dvh] lg:pt-24 lg:pb-10",
        )}
      >
        <div>
          <SplitHeading as="h2" id="story-title" text={home.storyHeadline} className="display max-w-[20ch] text-[length:var(--step-3)]" />
          <ol className="mt-12 grid gap-8 lg:gap-0">
            {beats.map((b) => (
              <li
                key={b.title}
                data-beat
                className={cn(
                  "group grid gap-4 transition-[opacity,transform] duration-500 ease-[var(--ease-out)]",
                  "lg:border-l lg:border-line lg:py-4 lg:pl-6 lg:opacity-35 lg:data-[active]:translate-x-1 lg:data-[active]:border-accent lg:data-[active]:opacity-100",
                  reduceMotion && "lg:opacity-100",
                )}
              >
                <div>
                  <h3 className="font-display text-[length:var(--step-1)] font-semibold text-fg">{b.title}</h3>
                  <p className="mt-1.5 max-w-[48ch] text-fg-2">{b.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <Reveal variant="fade" className="relative mx-auto aspect-[4/5] w-full max-w-[460px]">
          {portraitUrl ? (
            <Image src={portraitUrl} alt={portraitAlt ?? "Portrait of Jaimin Panchal"} fill sizes="(min-width: 1024px) 460px, 100vw" className="rounded-[var(--radius-xl)] object-cover" />
          ) : (
            // No portrait yet: the J/ mark drawn as an outline, turning slowly with scroll.
            <div data-orbit aria-hidden className="absolute inset-0 grid place-items-center">
              <svg viewBox="-0.6 -0.1 3.05 2.2" className="w-[88%] text-fg" fill="none" stroke="currentColor" strokeWidth="0.012">
                <path d={monogramSvgPath()} />
              </svg>
            </div>
          )}
        </Reveal>
      </div>
      </div>
    </section>
  );
}
