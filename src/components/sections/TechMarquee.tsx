import { techStack } from "@/content/portfolio";

function Row({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  // Duplicated once for a seamless -50% loop.
  const doubled = [...items, ...items];
  return (
    <div className="flex overflow-hidden">
      <div
        className={`flex shrink-0 items-center gap-4 pr-4 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {doubled.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-[#D7E2EA]"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TechMarquee() {
  const mid = Math.ceil(techStack.length / 2);
  const rowA = techStack.slice(0, mid);
  const rowB = techStack.slice(mid);

  return (
    <section className="overflow-hidden border-y border-white/5 bg-[#0C0C0C] py-14 sm:py-20">
      <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-white/35">
        The stack I build with
      </p>
      <div className="flex flex-col gap-4">
        <Row items={rowA} />
        <Row items={rowB} reverse />
      </div>
    </section>
  );
}
