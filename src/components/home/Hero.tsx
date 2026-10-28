"use client";

import { useRef } from "react";
import { Download } from "lucide-react";
import { HeroVisual } from "@/components/three/HeroVisual";
import { MagneticButton } from "@/components/motion/MagneticButton";
import type { HomePage, Profile } from "@/content/types";

/**
 * Hero: the name as architecture. A full-bleed expanded wordmark sits on the column grid;
 * the glass J/ monogram floats in front of it. All words are real, server-rendered text.
 */
export function Hero({ home, profile }: { home: HomePage; profile: Profile }) {
  const ref = useRef<HTMLElement>(null);
  const resumeHref = profile.resumeUrl ?? "/resume";
  const first = profile.name.split(" ")[0];

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden pt-16">
      <h1 id="hero-title" className="sr-only">
        {profile.name}, {profile.title}. {home.heroHeadline.join(" ")}
      </h1>

      <div className="container-site relative flex flex-1 flex-col justify-center pb-10 pt-[clamp(3rem,10vh,7rem)]">
        {/* Line 1: two short words pinned to the outer column rules */}
        <div aria-hidden className="display flex items-end justify-between text-[clamp(1.2rem,5.3vw,4.25rem)] leading-none">
          <span className="rise" style={{ "--i": 0 } as React.CSSProperties}>
            Hello, I&apos;m
          </span>
          <span className="rise text-right" style={{ "--i": 1 } as React.CSSProperties}>
            Beyond code
          </span>
        </div>

        {/* Line 2: the name, as wide as the grid */}
        <p aria-hidden className="display rise -mx-[0.04em] mt-[0.12em] text-center text-[clamp(4.4rem,19.6vw,19.5rem)] leading-[0.82] tracking-[-0.01em]" style={{ "--i": 2 } as React.CSSProperties}>
          {first}
        </p>

        {/* Glass monogram, centred over the wordmark */}
        <div className="pointer-events-none absolute inset-x-0 top-[14%] h-[34%] z-10 mx-auto w-full max-w-[1100px] md:top-0 md:bottom-[24%] md:h-auto">
          <HeroVisual targetRef={ref} />
        </div>

        {/* Line 3: actions left, statement right, both on the column grid */}
        <div className="relative z-20 mt-[clamp(2.5rem,6vh,5rem)] grid gap-10 md:grid-cols-4 md:items-end">
          <div className="rise flex flex-wrap items-center gap-3 md:col-span-2" style={{ "--i": 4 } as React.CSSProperties}>
            <MagneticButton href={home.primaryCta.href}>{home.primaryCta.label}</MagneticButton>
            <MagneticButton href={home.secondaryCta.href} variant="secondary">
              {home.secondaryCta.label}
            </MagneticButton>
            <MagneticButton href={resumeHref} variant="ghost" size="md" download={Boolean(profile.resumeUrl)} external={Boolean(profile.resumeUrl)}>
              <Download className="size-4" aria-hidden /> Resume
            </MagneticButton>
          </div>
          <div className="rise md:col-span-2 md:col-start-3 md:pl-[var(--gutter)]" style={{ "--i": 3 } as React.CSSProperties}>
            <p className="font-display text-[length:var(--step-1)] font-semibold leading-tight text-fg">{home.heroHeadline.join(" ")}</p>
            <p className="mt-3 max-w-[46ch] text-fg-3">{home.heroSupporting}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
