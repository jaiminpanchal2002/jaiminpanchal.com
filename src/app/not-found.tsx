import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found — Jaimin Panchal",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0C0C0C] px-6 text-center">
      <p
        className="hero-heading font-black uppercase leading-none tracking-tight"
        style={{ fontSize: "clamp(4rem, 18vw, 220px)" }}
      >
        404
      </p>
      <p className="mt-4 max-w-md text-sm uppercase tracking-wide text-[#D7E2EA]">
        This page drifted off into the void. Let&apos;s get you back.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10"
      >
        Back home
      </Link>
    </main>
  );
}
