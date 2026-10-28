import { cn } from "@/lib/utils";

// Radius rule: interactive controls are full pills; panels use --radius-lg; inputs --radius-md.
export function buttonClass(variant: "primary" | "secondary" | "ghost" = "primary", size: "md" | "lg" = "md", extra?: string) {
  return cn(
    "pressable font-display inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold uppercase tracking-[0.03em] select-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
    size === "lg" ? "h-13 px-7 text-[0.8rem]" : "h-11 px-5 text-[0.72rem]",
    variant === "primary" && "bg-accent text-accent-contrast hover:bg-accent-strong",
    variant === "secondary" && "border border-line-strong text-fg hover:border-fg-3 hover:bg-surface/60",
    variant === "ghost" && "text-fg-2 hover:text-fg",
    extra,
  );
}

export const eyebrowClass = "font-display text-[0.72rem] font-medium uppercase tracking-[0.08em] text-fg-3";
export const panelClass = "rounded-[var(--radius-lg)] border border-line bg-surface/50";
