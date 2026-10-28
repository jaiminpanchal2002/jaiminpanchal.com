"use client";

import Link from "next/link";
import { buttonClass } from "@/components/ui/styles";
import { useEffect } from "react";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="container-site grid min-h-[80dvh] place-items-center py-32">
      <div className="max-w-xl text-center">
        <h1 className="display text-[length:var(--step-4)]">Something went wrong.</h1>
        <p className="mt-5 text-fg-2">This section failed to load. You can try again, or continue to another page.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className={buttonClass("primary")}>Try again</button>
          <Link href="/" className={buttonClass("secondary")}>Back home</Link>
        </div>
        {error.digest && <p className="mt-6 font-display tabular-nums text-xs text-fg-3">Reference: {error.digest}</p>}
      </div>
    </section>
  );
}
