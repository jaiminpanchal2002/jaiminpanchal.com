import { SplitHeading } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/** Shared page opening: oversized display title over a soft radial glow. */
export function PageHeader({ title, intro, children, className }: { title: string; intro?: string; children?: React.ReactNode; className?: string }) {
  return (
    <header className={cn("relative isolate overflow-hidden pt-36 pb-16 md:pt-44 md:pb-20", className)}>
      <div aria-hidden className="absolute -top-1/3 right-[-10%] -z-10 size-[min(80vw,900px)] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--ice)_8%,transparent),transparent)]" />
      <div className="container-site">
        <SplitHeading as="h1" text={title} className="display max-w-[22ch] text-[length:var(--step-5)]" />
        {intro && <p className="rise mt-8 max-w-[56ch] text-[length:var(--step-1)] leading-snug text-fg-2" style={{ "--i": 3 } as React.CSSProperties}>{intro}</p>}
        {children}
      </div>
    </header>
  );
}

export function EmptyState({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="grid gap-4 rounded-[var(--radius-xl)] border border-dashed border-line-strong p-10 md:p-14">
      <p className="font-display text-[length:var(--step-2)] text-fg">{title}</p>
      <p className="max-w-[56ch] text-fg-2">{body}</p>
      {children}
    </div>
  );
}
