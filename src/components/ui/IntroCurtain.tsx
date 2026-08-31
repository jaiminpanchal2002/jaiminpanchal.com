"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Brief cinematic opening: a full-screen panel showing the name, then it slides
 * away to reveal the hero. Skipped entirely for reduced-motion users.
 */
export function IntroCurtain() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reduce) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(false), 1600);
    return () => clearTimeout(timer);
  }, [reduce]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="curtain"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#0C0C0C]"
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.15em" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hero-heading text-3xl font-black uppercase sm:text-5xl"
          >
            jaimin
          </motion.span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
