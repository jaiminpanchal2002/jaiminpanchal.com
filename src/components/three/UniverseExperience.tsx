"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Keyboard, Pause, Play, X } from "lucide-react";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { darkPalette, lightPalette } from "./palette";
import { cn } from "@/lib/utils";
import type { Station } from "./UniverseScene";

const UniverseScene = dynamic(() => import("./UniverseScene"), { ssr: false });

export type StationInfo = { id: string; label: string; href: string; summary: string; shape: Station["shape"] };

const SECRET = "You found the core. Every system here started as a single decision. Thanks for exploring.";

export function UniverseExperience({ stations }: { stations: StationInfo[] }) {
  const { tier, tierDetected, reduceMotion, quality, set } = useExperience();
  const { resolvedTheme } = useTheme();
  const [active, setActive] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [paused, setPaused] = useState(false);
  const [secret, setSecret] = useState(false);
  const [help, setHelp] = useState(true);

  const placed: Station[] = useMemo(
    () =>
      stations.map((s, i) => {
        const a = (i / stations.length) * Math.PI * 2;
        const r = i % 2 ? 6.2 : 4.4;
        return { id: s.id, label: s.label, shape: s.shape, position: [Math.cos(a) * r, (i % 3) * 0.6 - 0.6, Math.sin(a) * r] };
      }),
    [stations],
  );

  const select = useCallback((id: string) => {
    if (!id) return setActive(null);
    setActive(id);
    setVisited((v) => new Set(v).add(id));
  }, []);

  // Keyboard navigation: arrows cycle stations, Esc closes the panel, P pauses.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const idx = stations.findIndex((s) => s.id === active);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        select(stations[(idx + 1 + stations.length) % stations.length].id);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        select(stations[(idx - 1 + stations.length) % stations.length].id);
      } else if (e.key === "Escape") setActive(null);
      else if (e.key.toLowerCase() === "p") setPaused((p) => !p);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, stations, select]);

  const current = stations.find((s) => s.id === active);
  const palette = resolvedTheme === "light" ? lightPalette : darkPalette;
  const webgl = tierDetected && tier !== "none";

  return (
    <div className="relative min-h-[100dvh] overflow-hidden pt-16">
      {/* Scene (decorative): the station list below is the accessible interface */}
      <div className="absolute inset-0" aria-hidden>
        {webgl ? (
          <UniverseScene stations={placed} activeId={active} visited={visited} onSelect={select} onSecret={() => setSecret(true)} palette={palette} paused={paused} quality={tier === "high" ? "high" : "low"} reduceMotion={reduceMotion} />
        ) : (
          <div className="tech-grid absolute inset-0 opacity-60" />
        )}
      </div>

      {/* Controls */}
      <div className="relative z-[var(--z-content)] container-site flex flex-wrap items-center justify-between gap-3 pt-6">
        <div>
          <h1 className="font-display text-[length:var(--step-2)] tracking-[-0.01em] text-fg">Enter the universe</h1>
          <p className="text-sm text-fg-2">
            {visited.size} of {stations.length} systems explored
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {webgl && (
            <>
              <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} className="pressable inline-flex h-10 items-center gap-2 rounded-full border border-line-strong bg-bg/70 px-4 text-sm backdrop-blur">
                {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />} {paused ? "Resume" : "Pause"}
              </button>
              <label className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong bg-bg/70 px-4 text-sm backdrop-blur">
                Quality
                <select value={quality} onChange={(e) => set("quality", e.target.value as "auto" | "low" | "high" | "off")} className="bg-transparent text-fg focus:outline-none">
                  <option value="auto">Auto</option>
                  <option value="low">Low</option>
                  <option value="high">High</option>
                  <option value="off">Off</option>
                </select>
              </label>
            </>
          )}
          <button type="button" onClick={() => setHelp((h) => !h)} aria-expanded={help} className="pressable inline-flex size-10 items-center justify-center rounded-full border border-line-strong bg-bg/70 backdrop-blur" aria-label="Keyboard instructions">
            <Keyboard className="size-4" aria-hidden />
          </button>
          <Link href="/" className="pressable inline-flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-sm font-medium text-accent-contrast">
            <X className="size-4" aria-hidden /> Exit to site
          </Link>
        </div>
      </div>

      {help && (
        <p className="relative z-[var(--z-content)] container-site mt-4 text-sm text-fg-2">
          {webgl ? "Move the pointer to look around. Click a system, or use the arrow keys. Esc closes a panel, P pauses." : "3D is off on this device. Choose a destination below."}
        </p>
      )}

      {/* Accessible station list: always available, the primary interface on mobile */}
      <nav aria-label="Systems" className="absolute inset-x-0 bottom-0 z-[var(--z-content)]">
        <ul className="container-site flex snap-x gap-2 overflow-x-auto pb-6 pt-2 [scrollbar-width:none]">
          {stations.map((s) => (
            <li key={s.id} className="snap-start">
              <button
                type="button"
                aria-pressed={active === s.id}
                onClick={() => select(s.id)}
                className={cn(
                  "pressable whitespace-nowrap rounded-full border px-4 py-2 text-sm backdrop-blur",
                  active === s.id ? "border-accent bg-accent text-accent-contrast" : visited.has(s.id) ? "border-violet/60 bg-bg/70 text-fg" : "border-line-strong bg-bg/70 text-fg-2",
                )}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Floating information panel */}
      <AnimatePresence>
        {current && (
          <motion.aside
            key={current.id}
            role="region"
            aria-live="polite"
            aria-label={`${current.label} system`}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-[var(--gutter)] top-40 z-[var(--z-content)] w-[min(24rem,calc(100vw-2*var(--gutter)))] rounded-[var(--radius-lg)] border border-line-strong bg-bg-raised/90 p-6 backdrop-blur-xl max-md:top-auto max-md:bottom-24"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display text-[length:var(--step-2)] text-fg">{current.label}</h2>
              <button type="button" onClick={() => setActive(null)} className="rounded-full p-1 text-fg-2 hover:text-fg" aria-label="Close panel">
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <p className="mt-2 text-fg-2">{current.summary}</p>
            <Link href={current.href} className="mt-5 inline-flex items-center gap-1 text-fg underline decoration-accent underline-offset-4">
              Open {current.label} <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </motion.aside>
        )}
      </AnimatePresence>

      {(secret || visited.size === stations.length) && (
        <div role="status" className="absolute left-1/2 top-1/2 z-[var(--z-content)] w-[min(28rem,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-lg)] border border-cyan/50 bg-bg/90 p-6 text-center backdrop-blur" onClick={() => setSecret(false)}>
          <p className="text-fg">{secret ? SECRET : "Every system explored. You know the map as well as I do now."}</p>
          <button type="button" className="mt-4 text-sm text-fg-2 underline" onClick={() => { setSecret(false); setVisited(new Set()); }}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
