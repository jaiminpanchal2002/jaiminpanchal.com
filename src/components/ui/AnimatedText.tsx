"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { CSSProperties, useRef } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

interface CharProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

function Char({ char, progress, range }: CharProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const display = char === " " ? " " : char;

  return (
    <span className="relative inline-block">
      {/* Invisible placeholder holds layout width. */}
      <span style={{ opacity: 0 }}>{display}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>
        {display}
      </motion.span>
    </span>
  );
}

/**
 * Character-by-character scroll-reveal. Each character fades from 0.2 -> 1
 * opacity based on its position in the text relative to scroll progress.
 */
export function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const container = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.8", "end 0.2"],
  });

  const chars = text.split("");

  return (
    <p ref={container} className={className} style={style}>
      {chars.map((char, i) => {
        const start = i / chars.length;
        const end = start + 1 / chars.length;
        return (
          <Char
            key={i}
            char={char}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
}
