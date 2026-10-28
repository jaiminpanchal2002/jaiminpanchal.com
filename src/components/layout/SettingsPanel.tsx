"use client";

import * as Popover from "@radix-ui/react-popover";
import { useTheme } from "next-themes";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useExperience } from "./ExperienceProvider";
import { cn } from "@/lib/utils";

function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 text-xs font-medium text-fg-2">{label}</legend>
      <div className="grid gap-1 rounded-full border border-line p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              "cursor-pointer rounded-full px-2 py-1.5 text-center text-xs transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent",
              value === o.value ? "bg-accent text-accent-contrast" : "text-fg-2 hover:text-fg",
            )}
          >
            <input type="radio" className="sr-only" name={label} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <span>
        <span className="block text-xs font-medium text-fg">{label}</span>
        <span className="block text-xs text-fg-3">{hint}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn("relative h-6 w-10 shrink-0 rounded-full border transition-colors", checked ? "border-accent bg-accent" : "border-line-strong bg-surface")}
      >
        <span className={cn("absolute top-0.5 size-4 rounded-full bg-fg transition-transform duration-200 ease-[var(--ease-out)]", checked ? "translate-x-[1.1rem] bg-accent-contrast" : "translate-x-0.5")} />
        <span className="sr-only">{label}</span>
      </button>
    </label>
  );
}

export function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  const exp = useExperience();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  return (
    <Popover.Root>
      <Popover.Trigger className="pressable inline-flex size-10 items-center justify-center rounded-full border border-line-strong text-fg hover:bg-surface/60" aria-label="Display, motion and sound settings">
        <SlidersHorizontal className="size-4" strokeWidth={1.75} aria-hidden />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={10}
          className="z-[var(--z-menu)] w-[min(20rem,calc(100vw-2rem))] origin-[var(--radix-popover-content-transform-origin)] rounded-[var(--radius-lg)] border border-line bg-bg-raised/95 p-5 shadow-[0_24px_60px_-20px_hsl(var(--shadow-tint)/0.6)] backdrop-blur-xl data-[state=open]:animate-[pop_180ms_var(--ease-out)]"
        >
          <p className="mb-4 font-display text-base text-fg">Experience settings</p>
          {mounted && (
            <div className="grid gap-5">
              <Segmented
                label="Theme"
                value={(theme as "dark" | "light" | "system") ?? "dark"}
                onChange={setTheme}
                options={[
                  { value: "dark", label: "Dark" },
                  { value: "light", label: "Light" },
                  { value: "system", label: "System" },
                ]}
              />
              <Segmented
                label="Motion"
                value={exp.motion}
                onChange={(v) => exp.set("motion", v)}
                options={[
                  { value: "system", label: "System" },
                  { value: "reduced", label: "Reduced" },
                  { value: "full", label: "Full" },
                ]}
              />
              <Segmented
                label="3D quality"
                value={exp.quality}
                onChange={(v) => exp.set("quality", v)}
                options={[
                  { value: "auto", label: "Auto" },
                  { value: "low", label: "Low" },
                  { value: "high", label: "High" },
                  { value: "off", label: "Off" },
                ]}
              />
              {exp.tierDetected && exp.tier === "none" && exp.quality !== "off" && <p className="text-xs text-fg-3">WebGL is unavailable on this device, so static artwork is shown instead.</p>}
              <div className="grid gap-4 border-t border-line pt-4">
                <Toggle label="Smooth scrolling" hint="Eased scroll on desktop" checked={exp.smoothScroll} onChange={(v) => exp.set("smoothScroll", v)} />
                <Toggle label="Ambient sound" hint="Quiet generated soundscape" checked={exp.sound} onChange={(v) => exp.set("sound", v)} />
              </div>
            </div>
          )}
          <Popover.Arrow className="fill-line" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
