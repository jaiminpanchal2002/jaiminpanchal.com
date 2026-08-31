import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { type BuildingItem } from "@/content/portfolio";

const statusColor: Record<string, string> = {
  Planning: "text-white/50 bg-white/5",
  Building: "text-[#e084d8] bg-[#C81FB4]/15",
  Testing: "text-amber-300 bg-amber-400/10",
  Live: "text-emerald-300 bg-emerald-400/10",
};

export function CurrentlyBuildingSection({
  currentlyBuilding,
}: {
  currentlyBuilding: BuildingItem[];
}) {
  if (currentlyBuilding.length === 0) return null;
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-24 md:px-10">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-6 sm:p-10">
        <FadeIn y={20}>
          <div className="mb-8 flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C81FB4] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#C81FB4]" />
            </span>
            <p className="font-mono text-xs uppercase tracking-widest text-white/60">
              Currently building
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {currentlyBuilding.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08} y={20}>
              <a
                href={item.link}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-[#0C0C0C] p-6 transition-colors hover:border-white/25"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider ${
                      statusColor[item.status] ?? statusColor.Planning
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">
                  {item.description}
                </p>

                {/* Progress */}
                <div className="mt-5">
                  <div className="mb-1.5 flex justify-between font-mono text-[0.65rem] text-white/40">
                    <span>{item.tech.join(" · ")}</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.progress}%`,
                        background:
                          "linear-gradient(90deg, #C81FB4, #7A3BFF)",
                      }}
                    />
                  </div>
                </div>

                <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-white/40 transition-colors group-hover:text-white">
                  Details{" "}
                  <ArrowUpRight
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
