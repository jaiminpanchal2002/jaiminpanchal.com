import { ArrowUpRight, Github } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { TiltCard } from "@/components/ui/TiltCard";
import type { PublicProject } from "@/lib/queries";

function ProjectCard({ project }: { project: PublicProject }) {
  return (
    <TiltCard
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#141419] ${
        project.featured ? "lg:col-span-2" : ""
      }`}
    >
      {/* Cover */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {project.cover ? (
          <img
            src={project.cover}
            alt={project.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="grid-atmosphere flex h-full w-full items-center justify-center"
            style={{
              background:
                "radial-gradient(ellipse at 30% 20%, rgba(200,31,180,0.25), transparent 55%), radial-gradient(ellipse at 80% 90%, rgba(122,59,255,0.22), transparent 55%), #101015",
            }}
          >
            <span className="hero-heading font-black uppercase tracking-tighter opacity-90 sm:text-2xl">
              {project.name}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141419] via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-white/80 backdrop-blur">
          {project.isAiProject ? "AI" : project.category}
        </span>
        <span className="absolute right-4 top-4 font-mono text-2xl font-bold text-white/20">
          {project.number}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold text-white sm:text-2xl">
          {project.name}
        </h3>
        {project.summary ? (
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/50">
            {project.summary}
          </p>
        ) : null}

        {project.tech.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tech.slice(0, 5).map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[0.7rem] text-white/50"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex items-center gap-4 border-t border-white/5 pt-4">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-[#C81FB4]"
            >
              Live <ArrowUpRight size={15} />
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              <Github size={15} /> Code
            </a>
          ) : null}
          {!project.liveUrl && !project.githubUrl ? (
            <span className="font-mono text-xs uppercase tracking-widest text-white/30">
              Case study soon
            </span>
          ) : null}
        </div>
      </div>
    </TiltCard>
  );
}

export function ProjectsSection({
  projects,
}: {
  projects: PublicProject[];
}) {
  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-[#0C0C0C] px-6 py-24 sm:px-8 sm:py-32 md:px-10"
    >
      <div
        className="orb right-0 top-1/3 h-[400px] w-[400px]"
        style={{ background: "rgba(122,59,255,0.18)" }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 sm:mb-20">
          <div>
            <FadeIn y={20}>
              <p className="eyebrow mb-5">{"// selected work"}</p>
            </FadeIn>
            <FadeIn
              as="h2"
              y={30}
              className="hero-heading font-black uppercase leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
            >
              Projects
            </FadeIn>
          </div>
          <FadeIn y={20} delay={0.1}>
            <p className="max-w-xs font-mono text-sm text-white/40">
              A selection of products I&apos;ve designed, engineered and shipped.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {projects.map((project, i) => (
            <FadeIn key={project.name} delay={(i % 2) * 0.08} y={30}>
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
