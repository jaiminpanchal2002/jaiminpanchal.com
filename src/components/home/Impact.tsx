import { MetricCounter } from "@/components/motion/MetricCounter";
import { Reveal } from "@/components/motion/Reveal";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import type { Metric } from "@/content/types";

/** Verified metrics only (unverified ones never reach production). Each number carries its context. */
export function Impact({ metrics }: { metrics: Metric[] }) {
  if (metrics.length === 0) return null;
  return (
    <section aria-labelledby="impact-title" className="section-y border-y border-line bg-bg-raised/40">
      <div className="container-site">
        <h2 id="impact-title" className="display max-w-[16ch] text-[length:var(--step-4)]">
          Impact, measured where it can be.
        </h2>
        <dl className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {metrics.map((m, i) => (
            <Reveal key={m._id} delay={i * 100} className="grid content-start gap-3 border-t border-line-strong pt-6">
              <dt className="order-2 text-lg font-medium text-fg">{m.label}</dt>
              <dd className="display order-1 text-[length:var(--step-4)] text-fg">
                <MetricCounter value={m.value} prefix={m.prefix} suffix={m.suffix} />
              </dd>
              <dd className="order-3 text-fg-2">{m.explanation}</dd>
              <dd className="order-4 text-sm text-fg-3">{m.context}</dd>
              <dd className="order-5">
                <VerificationBadge verified={m.verified} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
