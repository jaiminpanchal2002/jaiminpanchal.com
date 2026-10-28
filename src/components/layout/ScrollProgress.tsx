"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin reading-progress bar. Driven by a motion value, so it never re-renders React. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="no-print fixed inset-x-0 top-0 z-[calc(var(--z-header)+1)] h-0.5 origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
