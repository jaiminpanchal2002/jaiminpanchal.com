"use client";

import { useEffect } from "react";
import { useExperience } from "@/components/layout/ExperienceProvider";

/**
 * Opt-in Lenis smooth scrolling (off by default; enabled from the settings panel).
 * Never runs under reduced motion. Kept in sync with GSAP ScrollTrigger.
 */
export function SmoothScroll() {
  const { smoothScroll, reduceMotion } = useExperience();

  useEffect(() => {
    if (!smoothScroll || reduceMotion) return;
    let cancelled = false;
    let cleanup = () => {};
    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [smoothScroll, reduceMotion]);

  return null;
}
