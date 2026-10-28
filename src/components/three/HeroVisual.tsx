"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useScroll } from "motion/react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState, type RefObject } from "react";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { cn } from "@/lib/utils";

// Three.js + R3F + drei live in their own chunk, requested only on capable devices.
const GlassMonogram = dynamic(() => import("./GlassMonogram"), { ssr: false });

/**
 * AdaptiveCanvas for the hero. A pre-rendered still of the glass monogram is the poster
 * (and the permanent visual when WebGL is unavailable); the live scene fades in over it.
 */
export function HeroVisual({ targetRef, className }: { targetRef: RefObject<HTMLElement | null>; className?: string }) {
  const { tier, tierDetected, reduceMotion } = useExperience();
  const { resolvedTheme } = useTheme();
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end start"] });
  const getProgress = useCallback(() => scrollYProgress.get(), [scrollYProgress]);
  const [ready, setReady] = useState(false);
  const [wide, setWide] = useState<boolean | null>(null);
  // Decided after mount so server and client render the same markup (poster first).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Hold the live scene until the intro cover is gone: no GPU work behind an opaque overlay.
  const [introActive, setIntroActive] = useState(true);
  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIntroActive(root.hasAttribute("data-intro"));
    update();
    const mo = new MutationObserver(update);
    mo.observe(root, { attributes: true, attributeFilter: ["data-intro"] });
    return () => mo.disconnect();
  }, []);

  const theme = resolvedTheme === "light" ? "light" : "dark";
  // High tier: live glass. Low tier: live (cheaper material) on desktop widths only; phones keep the poster.
  const use3D = wide !== null && !introActive && tierDetected && (tier === "high" || (tier === "low" && wide));

  return (
    <div className={cn("absolute inset-0", className)}>
      <Image
        src="/monogram.png"
        alt=""
        aria-hidden
        width={1100}
        height={636}
        priority
        sizes="(min-width: 768px) 60vw, 100vw"
        className={cn("absolute inset-0 h-full w-full object-contain transition-opacity duration-700", use3D && ready ? "opacity-0" : "opacity-100")}
      />
      {use3D && (
        <div className={cn("absolute inset-0 transition-opacity duration-[1200ms] ease-[var(--ease-out)]", ready ? "opacity-100" : "opacity-0")}>
          <GlassMonogram quality={tier === "high" ? "high" : "low"} theme={theme} scrollProgress={getProgress} reduceMotion={reduceMotion} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
