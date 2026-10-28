"use client";

import { createElement, Fragment, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared IntersectionObserver for all reveal primitives. One observer for the whole page
 * instead of one per element. Elements get `data-inview` once and are then unobserved.
 */
let observer: IntersectionObserver | null = null;
function getObserver() {
  if (observer || typeof window === "undefined") return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.setAttribute("data-inview", "");
          observer?.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
  );
  return observer;
}

export function useInViewAttr<T extends Element>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    const io = getObserver();
    if (!el || !io) return;
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
  return ref;
}

type RevealProps = {
  as?: keyof React.JSX.IntrinsicElements;
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms
  variant?: "rise" | "fade" | "wipe";
} & Omit<React.HTMLAttributes<HTMLElement>, "children">;

/**
 * Section reveal. Content is fully visible in the server HTML; it is only hidden once
 * JS has booted (html.js), so no-JS visitors and crawlers always see it.
 */
export function Reveal({ as = "div", children, className, delay = 0, variant = "rise", style, ...rest }: RevealProps) {
  const ref = useInViewAttr<HTMLElement>();
  return createElement(
    as,
    { ref, "data-reveal": variant, className: cn(className), style: { ...style, "--d": `${delay}ms` } as React.CSSProperties, ...rest },
    children,
  );
}

/** Word-by-word mask reveal for headings. Words stay real text for screen readers and SEO. */
export function SplitHeading({
  as = "h2",
  id,
  text,
  className,
  delay = 0,
}: {
  id?: string;
  as?: "h1" | "h2" | "h3" | "p";
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useInViewAttr<HTMLHeadingElement>();
  const words = text.split(" ");
  return createElement(
    as,
    { ref, id, className: cn("split-heading", className), "data-split": "" },
    words.map((w, i) => (
      // The space must sit OUTSIDE the inline-block word, or it collapses.
      <Fragment key={i}>
        <span className="split-word">
          <span className="split-inner" style={{ "--w": i, "--d": `${delay}ms` } as React.CSSProperties}>
            {w}
          </span>
        </span>
        {i < words.length - 1 ? " " : null}
      </Fragment>
    )),
  );
}
