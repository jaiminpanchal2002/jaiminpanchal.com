"use client";

import { useEffect } from "react";
import { useExperience } from "@/components/layout/ExperienceProvider";

/**
 * Optional ambient soundscape, synthesised with Web Audio (no audio files to download).
 * OFF by default. Only starts after the visitor turns it on (a user gesture),
 * fades in/out gently, and pauses while the tab is hidden.
 */
export function AmbientSound() {
  const { sound } = useExperience();

  useEffect(() => {
    if (!sound) return;
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    filter.connect(master).connect(ctx.destination);

    // Two detuned drones (A1 + E2) with a slow LFO on the filter: calm, non-rhythmic.
    const oscs = [55, 82.41, 110.3].map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 2 ? "sine" : "triangle";
      o.frequency.value = f;
      o.detune.value = i * 4;
      const g = ctx.createGain();
      g.gain.value = i === 2 ? 0.05 : 0.11;
      o.connect(g).connect(filter);
      o.start();
      return o;
    });
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.05;
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    master.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 2.5);

    const onVis = () => (document.hidden ? ctx.suspend() : ctx.resume());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0, t + 0.6);
      setTimeout(() => {
        [...oscs, lfo].forEach((o) => o.stop());
        ctx.close();
      }, 700);
    };
  }, [sound]);

  return null;
}
