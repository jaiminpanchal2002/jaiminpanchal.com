"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// WebGL scene is client-only and lazy — never part of the server bundle.
const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroScene),
  { ssr: false },
);

/**
 * Decorative hero backdrop. Renders the WebGL particle field only on capable,
 * motion-friendly desktops; everywhere else falls back to a static glow so the
 * hero still has depth without the GPU cost.
 */
export function HeroBackground() {
  const [enable3D, setEnable3D] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarseOrSmall =
      window.innerWidth < 768 ||
      window.matchMedia("(pointer: coarse)").matches;

    let webgl = false;
    try {
      const canvas = document.createElement("canvas");
      webgl = !!(
        canvas.getContext("webgl2") || canvas.getContext("webgl")
      );
    } catch {
      webgl = false;
    }

    if (!reduceMotion && !coarseOrSmall && webgl) setEnable3D(true);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Always-present static glow (also the mobile / reduced-motion look). */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 35%, rgba(118,33,176,0.16), transparent 70%)",
        }}
      />
      {enable3D ? <HeroScene /> : null}
    </div>
  );
}
