import Image from "next/image";
import { imageUrl } from "@/sanity/image";
import { cn } from "@/lib/utils";
import type { Project } from "@/content/types";

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

const accentVar = { blue: "var(--accent)", cyan: "var(--glow-cyan)", violet: "var(--glow-violet)" } as const;

/**
 * Project cover. Uses the CMS thumbnail when present. Otherwise renders a deterministic
 * abstract composition (clearly cover art, never a fake screenshot) derived from the slug.
 */
export function ProjectArt({ project, className, priority, sizes = "(min-width: 1024px) 60vw, 100vw" }: { project: Project; className?: string; priority?: boolean; sizes?: string }) {
  const src = imageUrl(project.thumbnail ?? project.heroImage, 1800);
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-surface", className)}>
        <Image src={src} alt={project.thumbnail?.alt ?? project.heroImage?.alt ?? ""} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  const h = hash(project.slug);
  const a = accentVar[project.accent ?? "blue"];
  const x = 20 + (h % 60);
  const y = 25 + ((h >> 8) % 50);
  const rot = (h >> 4) % 360;
  const rings = 3 + (h % 4);
  return (
    <div aria-hidden className={cn("relative overflow-hidden bg-bg-raised", className)}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(60% 70% at ${x}% ${y}%, color-mix(in oklab, ${a} 34%, transparent), transparent 70%)` }} />
      <div className="tech-grid absolute inset-0 opacity-60" />
      <div className="absolute inset-0" style={{ transform: `rotate(${rot}deg)` }}>
        {Array.from({ length: rings }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full border"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${(i + 1) * 18}%`,
              aspectRatio: "1",
              translate: "-50% -50%",
              borderColor: `color-mix(in oklab, ${a} ${60 - i * 10}%, transparent)`,
              borderStyle: i % 2 ? "dashed" : "solid",
            }}
          />
        ))}
      </div>
      <span className="display absolute bottom-[6%] left-[5%] right-[5%] text-[clamp(2.5rem,7vw,7rem)] leading-[0.9] text-fg/[0.08]">
        {project.title}
      </span>
    </div>
  );
}
