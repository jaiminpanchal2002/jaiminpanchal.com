"use client";

import { CSSProperties, ReactNode, useRef, useState } from "react";

/**
 * Mouse-driven 3D tilt. Rotates toward the cursor with a subtle max angle and
 * a soft glare that follows the pointer. Disabled for reduced-motion users.
 */
export function TiltCard({
  children,
  className,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>("");
  const [glare, setGlare] = useState<CSSProperties>({ opacity: 0 });

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * max * 2;
    const ry = (px - 0.5) * max * 2;
    setTransform(
      `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`,
    );
    setGlare({
      opacity: 1,
      background: `radial-gradient(300px circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.10), transparent 60%)`,
    });
  }

  function onLeave() {
    setTransform("perspective(900px) rotateX(0deg) rotateY(0deg)");
    setGlare({ opacity: 0 });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{
        transform: transform || undefined,
        transition: "transform 0.25s ease-out",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={glare}
      />
    </div>
  );
}
