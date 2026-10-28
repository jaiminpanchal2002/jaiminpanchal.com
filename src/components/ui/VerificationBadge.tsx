import { cn } from "@/lib/utils";

/** Visible only for unverified records, which only render in preview mode. */
export function VerificationBadge({ verified, className }: { verified: boolean; className?: string }) {
  if (verified) return null;
  return (
    <span className={cn("inline-flex items-center rounded-full border border-danger/50 bg-danger/10 px-2.5 py-0.5 font-display tabular-nums text-[0.68rem] uppercase tracking-[0.14em] text-danger", className)}>
      Needs verification
    </span>
  );
}
