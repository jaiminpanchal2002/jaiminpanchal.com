"use client";

import Image from "next/image";
import { useState } from "react";

/** Before/after comparison: clip-path on the top image, driven by an accessible range input. */
export function BeforeAfter({ before, after, beforeAlt, afterAlt, caption }: { before: string; after: string; beforeAlt: string; afterAlt: string; caption?: string }) {
  const [pos, setPos] = useState(50);
  return (
    <figure className="my-10">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)] border border-line">
        <Image src={after} alt={afterAlt} fill sizes="(min-width: 1024px) 760px, 100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before} alt={beforeAlt} fill sizes="(min-width: 1024px) 760px, 100vw" className="object-cover" />
        </div>
        <div aria-hidden className="absolute inset-y-0 w-px bg-accent" style={{ left: `${pos}%` }} />
        <span className="absolute left-3 top-3 rounded-full bg-bg/80 px-2.5 py-1 text-xs text-fg">Before</span>
        <span className="absolute right-3 top-3 rounded-full bg-bg/80 px-2.5 py-1 text-xs text-fg">After</span>
      </div>
      <label className="mt-3 flex items-center gap-3 text-sm text-fg-2">
        <span className="shrink-0">Compare</span>
        <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="w-full accent-[var(--accent)]" aria-label="Before and after comparison position" />
      </label>
      {caption && <figcaption className="mt-2 text-sm text-fg-3">{caption}</figcaption>}
    </figure>
  );
}
