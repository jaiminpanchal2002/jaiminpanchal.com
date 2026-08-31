"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { nav, profile } from "@/content/portfolio";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between px-6 py-5 md:px-10 md:py-6">
      <a
        href="#top"
        className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-white"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-xs">
          {profile.firstName[0]}
          {profile.lastName[0]}
        </span>
        <span className="hidden sm:inline">{profile.name}</span>
      </a>

      {/* Desktop links */}
      <div className="hidden items-center gap-8 md:flex">
        {nav.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-60"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Mobile toggle */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white md:hidden"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile menu */}
      {open ? (
        <div className="absolute left-4 right-4 top-full z-50 mt-2 flex flex-col gap-1 rounded-2xl border border-white/10 bg-[#111] p-3 md:hidden">
          {nav.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-colors hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </nav>
  );
}
