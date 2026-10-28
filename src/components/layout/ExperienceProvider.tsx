"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";

export type MotionPref = "system" | "reduced" | "full";
export type QualityPref = "auto" | "low" | "high" | "off";
export type Tier = "none" | "low" | "high";

type Prefs = { motion: MotionPref; quality: QualityPref; sound: boolean; smoothScroll: boolean };
type Ctx = Prefs & {
  set: <K extends keyof Prefs>(key: K, value: Prefs[K]) => void;
  /** Resolved: true when animation should collapse to static/instant. */
  reduceMotion: boolean;
  /** Resolved rendering tier for WebGL work. "none" = no WebGL, use static art. */
  tier: Tier;
  tierDetected: boolean;
};

const STORAGE_KEY = "jp-experience";
const DEFAULTS: Prefs = { motion: "system", quality: "auto", sound: false, smoothScroll: false };

const ExperienceContext = createContext<Ctx | null>(null);

function readPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function detectAutoTier(): Tier {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") ?? c.getContext("webgl");
    if (!gl) return "none";
  } catch {
    return "none";
  }
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return "low";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  const weak = (nav.deviceMemory ?? 8) < 4 || (nav.hardwareConcurrency ?? 8) <= 4;
  if ((coarse && small) || weak) return "low";
  return "high";
}

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [autoTier, setAutoTier] = useState<Tier | null>(null); // null until detected after mount

  const osReduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  useEffect(() => {
    // Hydrate from storage after mount to keep SSR markup deterministic.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefs(readPrefs());
    setAutoTier(detectAutoTier());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (prefs.motion === "system") root.removeAttribute("data-motion");
    else root.setAttribute("data-motion", prefs.motion);
  }, [prefs.motion]);

  const set = useCallback<Ctx["set"]>((key, value) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable: preference lasts for this page view only */
      }
      return next;
    });
  }, []);

  const reduceMotion = prefs.motion === "reduced" || (prefs.motion === "system" && osReduced);
  const tier: Tier = autoTier === null || autoTier === "none" || prefs.quality === "off" ? "none" : prefs.quality === "auto" ? autoTier : prefs.quality;
  const tierDetected = autoTier !== null;

  const value = useMemo(() => ({ ...prefs, set, reduceMotion, tier, tierDetected }), [prefs, set, reduceMotion, tier, tierDetected]);
  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useExperience must be used inside <ExperienceProvider>");
  return ctx;
}
