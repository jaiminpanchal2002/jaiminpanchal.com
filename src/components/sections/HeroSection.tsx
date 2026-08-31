"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowRight, FileText } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { RotatingTitle } from "@/components/ui/RotatingTitle";
import type { PublicProfile } from "@/lib/queries";

const socialIcon: Record<string, typeof Github> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Email: Mail,
};

// Decorative floating code fragments (edges only, lg+).
const tokens: {
  text: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  depth: number;
}[] = [
  { text: "git push origin main", top: "16%", left: "3%", depth: 26 },
  { text: "pgvector · HNSW", top: "22%", right: "4%", depth: 34 },
  { text: "await rag(query)", top: "60%", left: "4%", depth: 30 },
  { text: "LangGraph · RRF", top: "70%", right: "6%", depth: 22 },
  { text: "<FastAPI/>", top: "44%", right: "2%", depth: 40 },
  { text: "92% faithfulness", bottom: "14%", left: "34%", depth: 18 },
];

export function HeroSection({ profile }: { profile: PublicProfile }) {
  const reduce = useReducedMotion();
  const [m, setM] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    setM({
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
    });
  };

  const layer = (depth: number) =>
    reduce
      ? undefined
      : {
          transform: `translate3d(${m.x * depth}px, ${m.y * depth}px, 0)`,
          transition: "transform 0.25s ease-out",
        };

  return (
    <section
      id="top"
      onMouseMove={onMove}
      onMouseLeave={() => setM({ x: 0, y: 0 })}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pb-20 pt-32 sm:px-8 md:px-10"
    >
      <HeroBackground />

      {/* Floating code fragments */}
      {tokens.map((t, i) => (
        <div
          key={i}
          className="pointer-events-none absolute z-0 hidden lg:block"
          style={{
            top: t.top,
            left: t.left,
            right: t.right,
            bottom: t.bottom,
            ...layer(t.depth),
          }}
          aria-hidden
        >
          <span className="animate-float whitespace-nowrap font-mono text-xs text-white/[0.14]">
            {t.text}
          </span>
        </div>
      ))}

      {/* Terminal coordinate */}
      <div className="pointer-events-none absolute left-6 top-24 hidden font-mono text-[0.65rem] tracking-widest text-white/20 md:block">
        {profile.location.toUpperCase()}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <FadeIn delay={0.1} y={16}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-[#D7E2EA]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {profile.availability}
          </span>
        </FadeIn>

        {/* Name with subtle 3D tilt */}
        <div
          style={
            reduce
              ? undefined
              : {
                  transform: `perspective(1200px) rotateY(${m.x * 5}deg) rotateX(${-m.y * 4}deg)`,
                  transformStyle: "preserve-3d",
                  transition: "transform 0.3s ease-out",
                }
          }
        >
          <FadeIn
            as="h1"
            delay={0.2}
            y={40}
            className="hero-shimmer mt-6 font-black uppercase"
            style={{
              fontSize: "clamp(2.75rem, 12vw, 8rem)",
              lineHeight: 0.92,
              letterSpacing: "0.005em",
            }}
          >
            <span className="block">{profile.firstName}</span>
            <span className="block">{profile.lastName}</span>
          </FadeIn>
        </div>

        {/* Rotating positioning */}
        <FadeIn delay={0.35} y={20}>
          <p className="mt-8 flex flex-wrap items-center gap-x-3 text-lg font-semibold text-white sm:text-2xl md:text-3xl">
            <span className="text-white/40">I&apos;m an</span>
            <RotatingTitle titles={profile.roles} />
          </p>
        </FadeIn>

        <FadeIn delay={0.45} y={20}>
          <p className="mt-5 max-w-2xl text-balance text-base leading-relaxed text-white/55 sm:text-lg">
            {profile.tagline}
          </p>
        </FadeIn>

        {/* CTAs */}
        <FadeIn delay={0.55} y={20}>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              data-press
              className="group flex items-center gap-2 rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-transform hover:scale-[1.03] sm:text-sm"
              style={{
                background:
                  "linear-gradient(123deg, #18011F 7%, #C81FB4 37%, #7A3BFF 72%, #FF6A3D 100%)",
              }}
            >
              View my work
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
            <a
              href="#experience"
              className="rounded-full border border-white/25 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#D7E2EA] transition-colors hover:border-white sm:text-sm"
            >
              Explore my journey
            </a>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#D7E2EA] transition-colors hover:border-white sm:text-sm"
            >
              <FileText size={14} /> Resume
            </a>
          </div>
        </FadeIn>

        {/* Socials */}
        <FadeIn delay={0.65} y={20}>
          <div className="mt-8 flex items-center gap-4">
            {profile.socials.map((s) => {
              const Icon = socialIcon[s.label] ?? Mail;
              return (
                <a
                  key={s.label}
                  href={s.url}
                  target={s.url.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-[#C81FB4] hover:text-white"
                >
                  <Icon size={17} />
                </a>
              );
            })}
          </div>
        </FadeIn>
      </div>

      {/* Scroll hint */}
      <FadeIn
        delay={0.85}
        y={0}
        className="relative z-10 mx-auto mt-14 w-full max-w-5xl"
      >
        <span className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-white/40">
          <span className="h-px w-8 bg-white/30" />
          Scroll to explore
        </span>
      </FadeIn>
    </section>
  );
}
