import { FadeIn } from "@/components/ui/FadeIn";
import { type JourneyStep } from "@/content/portfolio";

export function JourneySection({ journey }: { journey: JourneyStep[] }) {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32 md:px-10">
      <FadeIn y={20}>
        <p className="eyebrow mb-5">{"// engineering journey"}</p>
      </FadeIn>
      <FadeIn
        as="h2"
        y={30}
        className="hero-heading mb-14 font-black uppercase leading-[0.9] tracking-tight sm:mb-16"
        style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
      >
        How I got here
      </FadeIn>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {journey.map((item, i) => (
          <FadeIn key={item.step} delay={i * 0.05} y={24}>
            <div className="group relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-[#C81FB4]/40">
              <span className="font-mono text-xs text-white/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base font-semibold text-white">
                {item.step}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/45">
                {item.note}
              </p>
              {i < journey.length - 1 ? (
                <span className="absolute right-4 top-4 font-mono text-white/15">
                  →
                </span>
              ) : null}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
