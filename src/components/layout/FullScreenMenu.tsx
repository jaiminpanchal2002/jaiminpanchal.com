"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useExperience } from "./ExperienceProvider";
import { Wordmark } from "./Wordmark";
import { cn } from "@/lib/utils";
import type { NavItem, SocialLink } from "@/content/types";

export function FullScreenMenu({ links, socials, email }: { links: NavItem[]; socials: SocialLink[]; email?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { reduceMotion } = useExperience();

  // Close on route change (covers browser back/forward too).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  const ease = [0.23, 1, 0.32, 1] as const;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="pressable inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-sm text-fg hover:bg-surface/60"
        aria-label="Open menu"
      >
        <Menu className="size-4" strokeWidth={1.75} aria-hidden />
        <span className="font-display hidden text-[0.72rem] font-semibold uppercase tracking-[0.05em] sm:inline">Menu</span>
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[var(--z-menu)] bg-bg/80 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.18 } }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                className="fixed inset-0 z-[var(--z-menu)] flex flex-col overflow-y-auto bg-bg"
                initial={reduceMotion ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
                animate={reduceMotion ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
                exit={reduceMotion ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)", transition: { duration: 0.32, ease: [0.77, 0, 0.175, 1] } }}
                transition={{ duration: 0.55, ease: [0.77, 0, 0.175, 1] }}
              >
                <Dialog.Title className="sr-only">Site menu</Dialog.Title>
                <div className="container-site flex h-16 shrink-0 items-center justify-between">
                  <Wordmark />
                  <Dialog.Close className="pressable inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-sm hover:bg-surface/60" aria-label="Close menu">
                    <X className="size-4" strokeWidth={1.75} aria-hidden />
                    <span className="font-display hidden text-[0.72rem] font-semibold uppercase tracking-[0.05em] sm:inline">Close</span>
                  </Dialog.Close>
                </div>
                <div className="container-site grid flex-1 gap-12 py-10 md:grid-cols-[1.6fr_1fr] md:py-16">
                  <nav aria-label="Site">
                    <ul className="flex flex-col">
                      {links.map((item, i) => {
                        const active = pathname === item.href;
                        return (
                          <motion.li
                            key={item.href}
                            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.18 + i * 0.04, duration: 0.6, ease }}
                          >
                            <Link
                              href={item.href}
                              aria-current={active ? "page" : undefined}
                              className={cn(
                                "group flex items-baseline gap-4 py-1.5 font-display text-[clamp(1.9rem,1.2rem+3vw,3.75rem)] font-extrabold uppercase leading-[1.02] tracking-[-0.01em] transition-colors",
                                active ? "text-fg" : "text-fg-3 hover:text-fg",
                              )}
                            >
                              <span className="transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-2">{item.label}</span>
                            </Link>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </nav>
                  <motion.aside
                    className="flex flex-col justify-end gap-8 text-fg-2"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                  >
                    <p className="max-w-xs text-sm leading-relaxed">
                      Every page on this site is reachable from here. The 3D experiences are optional.
                    </p>
                    {email && (
                      <a href={`mailto:${email}`} className="text-fg underline decoration-accent underline-offset-4">
                        {email}
                      </a>
                    )}
                    {socials.length > 0 && (
                      <ul className="flex flex-wrap gap-x-6 gap-y-2">
                        {socials.map((s) => (
                          <li key={s.url}>
                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm hover:text-fg">
                              {s.label} <ArrowUpRight className="size-3.5" aria-hidden />
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.aside>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
