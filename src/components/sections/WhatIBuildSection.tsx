import { FadeIn } from "@/components/ui/FadeIn";
import { whatIBuild } from "@/content/portfolio";

export function WhatIBuildSection() {
  return (
    <section
      id="build"
      className="relative mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32 md:px-10"
    >
      <FadeIn y={20}>
        <p className="eyebrow mb-5">{"// what i build"}</p>
      </FadeIn>
      <FadeIn
        as="h2"
        y={30}
        className="hero-heading mb-4 font-black uppercase leading-[0.9] tracking-tight"
        style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
      >
        The things I make
      </FadeIn>
      <FadeIn y={20} delay={0.1}>
        <p className="mb-14 max-w-xl text-white/50 sm:mb-16">
          I build web products, AI-powered applications and practical developer
          tools — end to end.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {whatIBuild.map((item, i) => (
          <FadeIn key={item.title} delay={(i % 2) * 0.08} y={30}>
            <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-white/25">
              <span
                className="font-mono text-5xl font-bold text-white/10 transition-colors group-hover:text-[#C81FB4]/40"
                aria-hidden
              >
                {item.tag}
              </span>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55 sm:text-base">
                {item.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
