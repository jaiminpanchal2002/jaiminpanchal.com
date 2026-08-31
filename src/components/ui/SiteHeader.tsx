"use client";

import { useEffect, useState } from "react";
import { Menu, X, FileText } from "lucide-react";
import { nav } from "@/content/portfolio";
import type { PublicProfile } from "@/lib/queries";

export function SiteHeader({ profile }: { profile: PublicProfile }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[9997] transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-[#0C0C0C]/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        {/* Monogram + name */}
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 font-mono text-sm font-bold text-white transition-colors group-hover:border-[#C81FB4]">
            JP
          </span>
          <span className="hidden text-sm font-semibold uppercase tracking-[0.15em] text-white sm:inline">
            {profile.name}
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 lg:flex">
          {nav.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-mono text-xs uppercase tracking-wider text-white/60 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Resume + mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href={profile.resumeUrl}
            className="hidden items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 font-mono text-xs uppercase tracking-wider text-white transition-colors hover:border-[#C81FB4] hover:text-[#C81FB4] sm:flex"
          >
            <FileText size={13} /> Resume
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open ? (
        <div className="border-t border-white/10 bg-[#0C0C0C]/95 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {nav.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 font-mono text-sm uppercase tracking-wider text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href={profile.resumeUrl}
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center gap-2 rounded-lg px-3 py-3 font-mono text-sm uppercase tracking-wider text-[#C81FB4]"
            >
              <FileText size={15} /> Resume
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
