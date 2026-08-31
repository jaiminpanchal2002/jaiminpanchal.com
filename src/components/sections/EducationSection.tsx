import { GraduationCap, Award } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import type { EducationEntry, AchievementEntry } from "@/content/portfolio";

export function EducationSection({
  education,
  achievements,
}: {
  education: EducationEntry[];
  achievements: AchievementEntry[];
}) {
  if (education.length === 0 && achievements.length === 0) return null;

  return (
    <section
      id="education"
      className="relative mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32 md:px-10"
    >
      <FadeIn y={20}>
        <p className="eyebrow mb-5">{"// education & credentials"}</p>
      </FadeIn>
      <FadeIn
        as="h2"
        y={30}
        className="hero-heading mb-14 font-black uppercase leading-[0.9] tracking-tight sm:mb-16"
        style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
      >
        Foundations
      </FadeIn>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Education */}
        <div>
          <div className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/40">
            <GraduationCap size={15} className="text-[#C81FB4]" /> Education
          </div>
          <div className="flex flex-col gap-6">
            {education.map((e, i) => (
              <FadeIn key={i} delay={i * 0.08} y={20}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <p className="font-mono text-xs uppercase tracking-widest text-[#C81FB4]">
                    {e.period}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {e.degree}
                  </h3>
                  <p className="mt-0.5 text-sm text-white/60">
                    {e.institution}
                  </p>
                  {e.description ? (
                    <p className="mt-3 inline-block rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-white/60">
                      {e.description}
                    </p>
                  ) : null}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Achievements / credentials */}
        <div>
          <div className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/40">
            <Award size={15} className="text-[#C81FB4]" /> Awards & credentials
          </div>
          <div className="flex flex-col gap-3">
            {achievements.map((a, i) => (
              <FadeIn key={i} delay={i * 0.06} y={16}>
                <div className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-[#C81FB4]/40">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 font-mono text-xs text-[#C81FB4]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{a.title}</p>
                    <p className="text-xs text-white/45">{a.context}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
