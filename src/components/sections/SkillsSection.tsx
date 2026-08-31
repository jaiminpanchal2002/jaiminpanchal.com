import { FadeIn } from "@/components/ui/FadeIn";
import { type SkillCategoryContent } from "@/content/portfolio";

export function SkillsSection({
  skillCategories,
}: {
  skillCategories: SkillCategoryContent[];
}) {
  return (
    <section
      id="skills"
      className="relative mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32 md:px-10"
    >
      <FadeIn y={20}>
        <p className="eyebrow mb-5">{"// skills & stack"}</p>
      </FadeIn>
      <FadeIn
        as="h2"
        y={30}
        className="hero-heading mb-4 font-black uppercase leading-[0.9] tracking-tight"
        style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
      >
        What I work with
      </FadeIn>
      <FadeIn y={20} delay={0.1}>
        <p className="mb-14 max-w-xl text-white/50 sm:mb-16">
          The tools I reach for across the stack — from interfaces and APIs to
          databases and applied AI.
        </p>
      </FadeIn>

      <div className="flex flex-col gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]">
        {skillCategories.map((cat, i) => (
          <FadeIn key={cat.name} delay={i * 0.06} y={20}>
            <div className="grid grid-cols-1 gap-4 bg-[#0C0C0C] p-6 sm:grid-cols-[180px_1fr] sm:items-center sm:gap-8 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#C81FB4]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-mono text-sm uppercase tracking-widest text-white">
                  {cat.name}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="cursor-default rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C81FB4]/50 hover:bg-[#C81FB4]/10 hover:text-white"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
