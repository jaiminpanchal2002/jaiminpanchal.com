import { FadeIn } from "@/components/ui/FadeIn";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { about, profile, stats } from "@/content/portfolio";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32 md:px-10"
    >
      <FadeIn y={20}>
        <p className="eyebrow mb-4">{"// about"}</p>
      </FadeIn>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        {/* Narrative */}
        <div>
          <FadeIn
            as="h2"
            y={30}
            className="hero-heading font-black uppercase leading-[0.95] tracking-tight"
            style={{ fontSize: "clamp(2.25rem, 6vw, 4.5rem)" }}
          >
            {about.heading}
          </FadeIn>
          <AnimatedText
            text={about.paragraph}
            className="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-[#D7E2EA] sm:text-xl"
          />
          <FadeIn y={20} delay={0.1}>
            <p className="mt-6 text-sm text-white/40">
              Based in {profile.location}.
            </p>
          </FadeIn>
        </div>

        {/* Stats */}
        <FadeIn y={30} delay={0.15}>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#0C0C0C] p-6 sm:p-7"
              >
                <p
                  className="hero-heading font-black leading-none"
                  style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
                >
                  {stat.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-wider text-white/45">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
