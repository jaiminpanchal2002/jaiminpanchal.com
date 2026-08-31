"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, #B600A8 0%, #7621B0 55%, #BE4C00 100%)",
      }}
      className="fixed left-0 top-0 z-[9998] h-0.5 w-full origin-left"
      aria-hidden="true"
    />
  );
}
