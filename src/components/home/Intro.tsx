"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const KEY = "jp-intro-seen";
const DURATION = 2600;

/**
 * Optional opening sequence (home page, once per session).
 * An energy point appears, particles converge into a structured ring, a light pass crosses,
 * and the brand resolves before the overlay wipes away to reveal the already-rendered page.
 *
 * Never blocks: Skip button, Escape or any click ends it; reduced motion never starts it;
 * a boot-script safety timeout removes the cover even if this component fails to load.
 */
export function Intro({ enabled }: { enabled: boolean }) {
  const [active, setActive] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    setLeaving(true);
    setTimeout(() => {
      document.documentElement.removeAttribute("data-intro");
      setActive(false);
    }, 650);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute("data-intro")) return;
    if (!enabled) {
      root.removeAttribute("data-intro");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(true);
  }, [enabled]);

  useEffect(() => {
    if (!active || leaving) return;
    skipRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(finish, DURATION);

    const c = canvas.current;
    const ctx = c?.getContext("2d");
    let raf = 0;
    if (c && ctx) {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = (c.width = innerWidth * dpr);
      const h = (c.height = innerHeight * dpr);
      const cs = getComputedStyle(document.documentElement);
      const accent = cs.getPropertyValue("--accent").trim() || "#4c8dff";
      const cyan = cs.getPropertyValue("--glow-cyan").trim() || "#49e3f5";
      const N = innerWidth < 768 ? 160 : 320;
      const R = Math.min(w, h) * 0.22;
      const parts = Array.from({ length: N }, (_, i) => {
        const a = Math.random() * Math.PI * 2;
        const d = Math.max(w, h) * (0.4 + Math.random() * 0.4);
        const ring = i % 3; // three concentric "strata"
        const ta = (i / N) * Math.PI * 2 * 3;
        return { sx: w / 2 + Math.cos(a) * d, sy: h / 2 + Math.sin(a) * d, tx: w / 2 + Math.cos(ta) * R * (0.6 + ring * 0.2), ty: h / 2 + Math.sin(ta) * R * (0.6 + ring * 0.2) * 0.42, delay: Math.random() * 0.25, c: i % 7 === 0 ? cyan : accent };
      });
      const start = performance.now();
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const draw = (now: number) => {
        const t = (now - start) / DURATION;
        ctx.clearRect(0, 0, w, h);
        // energy point
        const core = Math.min(1, t / 0.15);
        const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, R * 0.5 * core);
        g.addColorStop(0, cyan);
        g.addColorStop(1, "transparent");
        ctx.globalAlpha = 0.35 * core;
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        // converging particles
        for (const p of parts) {
          const k = ease(Math.min(1, Math.max(0, (t - 0.08 - p.delay) / 0.5)));
          ctx.globalAlpha = 0.25 + 0.75 * k;
          ctx.fillStyle = p.c;
          ctx.beginPath();
          ctx.arc(p.sx + (p.tx - p.sx) * k, p.sy + (p.ty - p.sy) * k, 1.4 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
        // light pass
        const lp = (t - 0.45) / 0.35;
        if (lp > 0 && lp < 1) {
          const x = w * lp;
          const lg = ctx.createLinearGradient(x - 160 * dpr, 0, x + 160 * dpr, 0);
          lg.addColorStop(0, "transparent");
          lg.addColorStop(0.5, cyan);
          lg.addColorStop(1, "transparent");
          ctx.globalAlpha = 0.18 * Math.sin(lp * Math.PI);
          ctx.fillStyle = lg;
          ctx.fillRect(0, 0, w, h);
        }
        ctx.globalAlpha = 1;
        if (t < 1) raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);
    }
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, leaving, finish]);

  if (!active) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Intro animation"
      onClick={finish}
      className="fixed inset-0 z-[var(--z-intro)] grid place-items-center bg-bg transition-[clip-path] duration-[650ms] ease-[var(--ease-in-out)]"
      style={{ clipPath: leaving ? "inset(0 0 100% 0)" : "inset(0 0 0 0)" }}
    >
      <canvas ref={canvas} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />
      <p className="intro-mark relative font-display text-[clamp(1.6rem,1rem+3vw,3.4rem)] tracking-[-0.01em]">
        <span className="font-semibold text-fg">JAIMIN</span> <span className="text-accent">/</span> <span className="text-fg-2">BEYOND CODE</span>
      </p>
      <button
        ref={skipRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
        className="pressable absolute bottom-8 right-8 z-10 rounded-full border border-line-strong bg-bg/70 px-5 py-2.5 text-sm text-fg hover:bg-surface"
      >
        Skip intro
      </button>
    </div>
  );
}
