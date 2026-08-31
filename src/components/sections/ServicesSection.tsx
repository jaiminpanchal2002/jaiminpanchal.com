import { FadeIn } from "@/components/ui/FadeIn";
import { type ServiceItem } from "@/content/portfolio";

export function ServicesSection({ services }: { services: ServiceItem[] }) {
  return (
    <section
      id="services"
      className="rounded-t-[36px] bg-white px-6 py-24 sm:rounded-t-[48px] sm:px-8 sm:py-28 md:rounded-t-[56px] md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn y={20}>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#0C0C0C]/50">
            <span className="mr-2 text-[#C81FB4]">{"//"}</span>what i do
          </p>
        </FadeIn>
        <FadeIn
          as="h2"
          y={30}
          className="mb-14 font-black uppercase leading-[0.9] tracking-tight text-[#0C0C0C] sm:mb-20"
          style={{ fontSize: "clamp(2.75rem, 9vw, 8rem)" }}
        >
          Services
        </FadeIn>

        <div>
          {services.map((service, i) => (
            <FadeIn
              key={service.number}
              delay={i * 0.08}
              y={24}
              className="group border-t border-[#0C0C0C]/10 last:border-b"
            >
              <div className="flex flex-col gap-3 py-8 sm:flex-row sm:items-baseline sm:gap-8 sm:py-10 md:py-12">
                <span
                  className="shrink-0 font-black leading-none text-[#0C0C0C]/25 transition-colors duration-300 group-hover:text-[#0C0C0C] sm:w-28"
                  style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
                >
                  {service.number}
                </span>
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
                  <h3
                    className="font-semibold uppercase tracking-tight text-[#0C0C0C]"
                    style={{ fontSize: "clamp(1.35rem, 2.5vw, 2.25rem)" }}
                  >
                    {service.name}
                  </h3>
                  <p className="max-w-md text-sm leading-relaxed text-[#0C0C0C]/55 sm:text-base">
                    {service.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
