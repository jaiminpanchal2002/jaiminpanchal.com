"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0C0C0C] px-6 text-center">
      <p
        className="hero-heading font-black uppercase leading-none tracking-tight"
        style={{ fontSize: "clamp(2.5rem, 10vw, 120px)" }}
      >
        Something broke
      </p>
      <p className="mt-4 max-w-md text-sm uppercase tracking-wide text-[#D7E2EA]">
        An unexpected error occurred. You can try again.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10"
      >
        Try again
      </button>
    </main>
  );
}
