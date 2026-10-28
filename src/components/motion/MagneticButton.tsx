"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { buttonClass } from "@/components/ui/styles";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
  strength?: number;
  download?: boolean;
  external?: boolean;
};

/**
 * CTA that leans toward the pointer. Pure motion values: no React re-render per pointer move.
 * Only active for fine pointers with hover, and disabled under reduced motion.
 */
export function MagneticButton({ href, children, variant = "primary", size = "lg", className, strength = 0.28, download, external }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { reduceMotion } = useExperience();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (reduceMotion || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const cls = buttonClass(variant, size, className);
  const inner = <motion.span style={{ x: sx, y: sy }} className="inline-flex items-center gap-2">{children}</motion.span>;

  if (external || download) {
    return (
      <a ref={ref} href={href} className={cls} onPointerMove={onMove} onPointerLeave={reset} download={download} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <Link ref={ref} href={href} className={cls} onPointerMove={onMove} onPointerLeave={reset}>
      {inner}
    </Link>
  );
}
