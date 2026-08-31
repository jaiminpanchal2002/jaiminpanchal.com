"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function RotatingTitle({ titles }: { titles: string[] }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % titles.length),
      2600,
    );
    return () => clearInterval(id);
  }, [titles.length, reduce]);

  if (reduce) {
    return <span>{titles.join(" · ")}</span>;
  }

  return (
    <span className="relative inline-flex h-[1.4em] items-center justify-center overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={titles[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="whitespace-nowrap text-[#C81FB4]"
        >
          {titles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
