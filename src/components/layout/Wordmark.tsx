import Link from "next/link";
import { cn } from "@/lib/utils";
import { monogramSvgPath } from "@/components/three/monogram";

const path = monogramSvgPath();

/** The J/ mark (same geometry as the 3D glass monogram). */
export function MonogramMark({ className }: { className?: string }) {
  return (
    <svg viewBox="-0.6 -0.1 3.05 2.2" className={cn("h-7 w-auto", className)} aria-hidden fill="currentColor">
      <path d={path} />
    </svg>
  );
}

export function Wordmark({ className, withName = false }: { className?: string; withName?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex shrink-0 items-center gap-3 whitespace-nowrap text-fg", className)} aria-label="Jaimin Panchal, home">
      <MonogramMark className="transition-transform duration-300 ease-[var(--ease-out)] group-hover:-rotate-6" />
      {withName && <span className="font-display text-sm font-semibold uppercase tracking-[0.02em]">Jaimin Panchal</span>}
    </Link>
  );
}
