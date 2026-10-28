"use client";

import { useEffect, useRef } from "react";
import { useExperience } from "@/components/layout/ExperienceProvider";

const fmt = new Intl.NumberFormat("en-IN");

/**
 * Counts up once when scrolled into view. Writes textContent directly (no React state per frame).
 * Server HTML contains the final value, so the number is correct without JS.
 */
export function MetricCounter({ value, prefix = "", suffix = "", duration = 1600 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { reduceMotion } = useExperience();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4); // ease-out quart: fast start, gentle settle
          el.textContent = `${prefix}${fmt.format(Math.round(value * eased))}${suffix}`;
          if (t < 1) raf = requestAnimationFrame(step);
        };
        el.textContent = `${prefix}0${suffix}`;
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, prefix, suffix, duration, reduceMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {fmt.format(value)}
      {suffix}
    </span>
  );
}
