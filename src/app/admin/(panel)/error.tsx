"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function AdminError({
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-8 text-center">
      <AlertTriangle className="mb-4 text-amber-400" size={32} />
      <h1 className="text-xl font-semibold text-white">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-white/50">
        This admin page failed to load. The error was logged — try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-[#B600A8] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
