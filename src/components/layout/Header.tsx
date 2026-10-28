"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { Wordmark } from "./Wordmark";
import { FullScreenMenu } from "./FullScreenMenu";
import { SettingsPanel } from "./SettingsPanel";
import { cn } from "@/lib/utils";
import type { NavItem, SocialLink } from "@/content/types";

export function Header({ nav, allLinks, socials, email }: { nav: NavItem[]; allLinks: NavItem[]; socials: SocialLink[]; email?: string }) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  // Only flips React state when crossing the threshold, not on every scroll frame.
  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > 24;
    if (next !== scrolled) setScrolled(next);
  });
  const links = [...nav, { label: "Contact", href: "/contact", visible: true }];

  return (
    <header
      className={cn(
        "no-print fixed inset-x-0 top-0 z-[var(--z-header)] border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled ? "border-line bg-bg/75 backdrop-blur-xl" : "border-line",
      )}
    >
      <div className="container-site flex h-16 items-center justify-between gap-6">
        <Wordmark />
        <div className="flex items-center gap-2 lg:gap-8">
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {links.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "font-display relative py-2 text-[0.74rem] font-medium uppercase tracking-[0.06em] transition-colors",
                        active ? "text-fg" : "text-fg-2 hover:text-fg",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-fg transition-transform duration-300 ease-[var(--ease-out)]",
                          active ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <SettingsPanel />
            <FullScreenMenu links={allLinks} socials={socials} email={email} />
          </div>
        </div>
      </div>
    </header>
  );
}
