import { FadeIn } from "@/components/ui/FadeIn";
import { type ExperienceEntry } from "@/content/portfolio";

export function ExperienceSection({
  experiences,
}: {
  experiences: ExperienceEntry[];
}) {
  return (
    <section
      id="experience"
      className="relative mx-auto max-w-5xl px-6 py-24 sm:px-8 sm:py-32 md:px-10"
    >
      <FadeIn y={20}>
        <p className="eyebrow mb-5">{"// career"}</p>
      </FadeIn>
      <FadeIn
        as="h2"
        y={30}
        className="hero-heading mb-14 font-black uppercase leading-[0.9] tracking-tight sm:mb-20"
        style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
      >
        Experience
      </FadeIn>

      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute bottom-2 left-[7px] top-2 w-px sm:left-[9px]"
          style={{
            background:
              "linear-gradient(180deg, #C81FB4, #7A3BFF 50%, transparent)",
          }}
        />

        <div className="flex flex-col gap-12 sm:gap-16">
          {experiences.map((exp, i) => (
            <FadeIn
              key={`${exp.company}-${i}`}
              delay={i * 0.08}
              y={30}
              className="relative pl-10 sm:pl-14"
            >
              {/* Node */}
              <span className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-[#C81FB4]/50 bg-[#0C0C0C] sm:h-5 sm:w-5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C81FB4]" />
              </span>

              <p className="font-mono text-xs uppercase tracking-widest text-[#C81FB4]">
                {exp.period}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                {exp.role}
              </h3>
              <p className="mt-0.5 font-mono text-sm text-white/50">
                {exp.company} · {exp.location}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
                {exp.description}
              </p>

              <ul className="mt-4 flex flex-col gap-2">
                {exp.achievements.map((a) => (
                  <li
                    key={a}
                    className="flex gap-2.5 text-sm text-white/55"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#7A3BFF]" />
                    {a}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                {exp.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-white/50"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
