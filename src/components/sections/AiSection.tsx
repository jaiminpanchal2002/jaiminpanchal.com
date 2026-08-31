import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { aiPipeline, aiCapabilities } from "@/content/portfolio";

export function AiSection() {
  return (
    <section
      id="ai"
      className="relative overflow-hidden bg-[#0C0C0C] px-6 py-24 sm:px-8 sm:py-32 md:px-10"
    >
      <div className="grid-atmosphere pointer-events-none absolute inset-0 opacity-60" />
      <div
        className="orb left-1/3 top-10 h-[420px] w-[420px]"
        style={{ background: "rgba(122,59,255,0.16)" }}
      />

      <div className="relative mx-auto max-w-6xl">
        <FadeIn y={20}>
          <p className="eyebrow mb-5">{"// ai lab"}</p>
        </FadeIn>
        <FadeIn
          as="h2"
          y={30}
          className="hero-heading font-black uppercase leading-[0.9] tracking-tight"
          style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
        >
          The AI Lab
        </FadeIn>
        <FadeIn y={20} delay={0.1}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg">
            I don&apos;t just call ChatGPT. I build retrieval-augmented systems
            that ground answers in real data — embeddings, vector search and
            LLMs wired into products that need to be correct, not just
            confident.
          </p>
        </FadeIn>

        {/* Capabilities */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aiCapabilities.map((cap, i) => (
            <FadeIn key={cap.title} delay={(i % 3) * 0.06} y={24}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-[#C81FB4]/40">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C81FB4] transition-transform duration-300 group-hover:scale-150" />
                  <h3 className="text-base font-semibold text-white">
                    {cap.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-white/50">
                  {cap.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Pipeline */}
        <FadeIn y={30} delay={0.2}>
          <div className="mt-14 rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-10">
            <p className="mb-8 font-mono text-xs uppercase tracking-widest text-white/40">
              retrieval-augmented generation · request flow
            </p>
            <div className="flex flex-wrap items-stretch gap-3">
              {aiPipeline.map((step, i) => (
                <div key={step.label} className="flex items-stretch gap-3">
                  <div className="group flex min-w-[120px] flex-1 flex-col rounded-xl border border-white/10 bg-[#141419] p-4 transition-colors hover:border-[#C81FB4]/50">
                    <span className="font-mono text-[0.65rem] text-[#C81FB4]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1.5 text-sm font-semibold text-white">
                      {step.label}
                    </span>
                    <span className="mt-1 font-mono text-[0.7rem] text-white/40">
                      {step.note}
                    </span>
                  </div>
                  {i < aiPipeline.length - 1 ? (
                    <ArrowRight
                      size={16}
                      className="hidden shrink-0 self-center text-white/25 sm:block"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
