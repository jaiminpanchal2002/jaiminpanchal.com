import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Code } from "lucide-react";
import { ProjectArt } from "@/components/work/ProjectArt";
import { RichText, toEmbedUrl } from "@/components/content/RichText";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { buttonClass } from "@/components/ui/styles";
import { getProject, getProjects, isPreviewing } from "@/content/api";
import { imageUrl } from "@/sanity/image";
import { breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";
import { formatMonth } from "@/lib/utils";

// Cache Components requires at least one param; "__none" renders a 404 when nothing is published.
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.length ? projects.map((p) => ({ slug: p.slug })) : [{ slug: "__none" }];
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return { title: "Project not found", robots: { index: false } };
  return {
    ...pageMetadata({ title: p.title, description: p.summary, path: `/work/${p.slug}`, seo: p.seo }),
    ...(p.verified ? {} : { robots: { index: false, follow: false } }),
  };
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal as="section" className="grid gap-6 border-t border-line py-14 md:grid-cols-[1fr_2fr] md:gap-12">
      <h2 className="display text-[length:var(--step-2)] text-fg">{title}</h2>
      <div className="text-fg-2 [&_p]:max-w-[64ch] [&_p+p]:mt-4">{children}</div>
    </Reveal>
  );
}

const bullets = (items: string[]) => (
  <ul className="grid gap-2 list-disc pl-5 marker:text-accent">
    {items.map((i) => (
      <li key={i}>{i}</li>
    ))}
  </ul>
);

async function ProjectDetail({ params }: { params: PageProps<"/work/[slug]">["params"] }) {
  const { slug } = await params;
  const [project, all, preview] = await Promise.all([getProject(slug), getProjects(), isPreviewing()]);
  if (!project) notFound();
  const p = project;

  const idx = all.findIndex((x) => x.slug === p.slug);
  const next = all.length > 1 ? all[(idx + 1) % all.length] : null;
  const related = all.filter((x) => x.slug !== p.slug && (x.category === p.category || x.technologies.some((t) => p.technologies.includes(t)))).slice(0, 2);
  const period = [formatMonth(p.startDate), formatMonth(p.endDate)].filter(Boolean).join(" - ") || (p.year ? String(p.year) : null);

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }, { name: p.title, path: `/work/${p.slug}` }]))} />

      {/* 1. Cinematic hero */}
      <header className="relative pt-32 md:pt-40">
        <div className="container-site">
          <Link href="/work" className="inline-flex items-center gap-2 text-sm text-fg-2 hover:text-fg">
            <ArrowLeft className="size-4" aria-hidden /> All work
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-fg-3">
            <span>{p.category}</span>
            {period && <span>{period}</span>}
            <VerificationBadge verified={p.verified} />
          </div>
          <SplitHeading as="h1" text={p.title} className="display mt-4 max-w-[14ch] text-[length:var(--step-6)]" />
          <p className="rise mt-6 max-w-[52ch] text-[length:var(--step-1)] leading-snug text-fg-2" style={{ "--i": 2 } as React.CSSProperties}>
            {p.summary}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {p.demoUrl && (
              <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("primary")}>
                Live product <ArrowUpRight className="size-4" aria-hidden />
              </a>
            )}
            {p.repoUrl && (
              <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary")}>
                <Code className="size-4" aria-hidden /> Source
              </a>
            )}
          </div>
        </div>
        <Reveal variant="wipe" className="container-site mt-14">
          <div className="aspect-[21/10] overflow-hidden rounded-[var(--radius-xl)] border border-line">
            <ProjectArt project={{ ...p, thumbnail: p.heroImage ?? p.thumbnail }} className="h-full w-full" priority sizes="100vw" />
          </div>
        </Reveal>
      </header>

      <div className="container-site py-16">
        {preview && !p.verified && p.verificationTasks.length > 0 && (
          <aside className="mb-12 rounded-[var(--radius-lg)] border border-danger/40 bg-danger/5 p-6 text-sm">
            <p className="font-medium text-danger">Preview only. Verification tasks before publishing:</p>
            <ul className="mt-3 grid gap-1 list-disc pl-5 text-fg-2">
              {p.verificationTasks.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </aside>
        )}

        {/* Fact strip */}
        {(p.role || p.technologies.length > 0 || p.contribution) && (
          <dl className="grid gap-8 pb-14 sm:grid-cols-3">
            {p.role && (
              <div>
                <dt className="text-sm text-fg-3">My role</dt>
                <dd className="mt-1 text-fg">{p.role}</dd>
              </div>
            )}
            {p.contribution && (
              <div>
                <dt className="text-sm text-fg-3">Contribution</dt>
                <dd className="mt-1 text-fg">{p.contribution}</dd>
              </div>
            )}
            {p.technologies.length > 0 && (
              <div>
                <dt className="text-sm text-fg-3">Stack</dt>
                <dd className="mt-1 text-fg">{p.technologies.join(", ")}</dd>
              </div>
            )}
          </dl>
        )}

        {p.problem && <Block title="The problem"><p>{p.problem}</p></Block>}
        {p.objectives.length > 0 && <Block title="Objectives">{bullets(p.objectives)}</Block>}
        {p.solution && <Block title="The solution"><p>{p.solution}</p></Block>}
        {p.architecture && <Block title="System architecture"><p className="whitespace-pre-line">{p.architecture}</p></Block>}
        {p.body && p.body.length > 0 && (
          <Block title="Engineering implementation">
            <RichText value={p.body} />
          </Block>
        )}
        {p.features.length > 0 && <Block title="Key features">{bullets(p.features)}</Block>}

        {p.gallery.length > 0 && (
          <section aria-label="Screenshots" className="grid gap-6 border-t border-line py-14 md:grid-cols-2">
            {p.gallery.map((img, i) => {
              const src = imageUrl(img, 1400);
              return src ? (
                <figure key={i} className={i % 3 === 0 ? "md:col-span-2" : undefined}>
                  <Image src={src} alt={img.alt ?? ""} width={1400} height={875} className="rounded-[var(--radius-lg)] border border-line" sizes="(min-width: 768px) 50vw, 100vw" />
                  {img.caption && <figcaption className="mt-2 text-sm text-fg-3">{img.caption}</figcaption>}
                </figure>
              ) : null;
            })}
          </section>
        )}

        {p.videos.length > 0 && (
          <section aria-label="Demonstrations" className="grid gap-6 border-t border-line py-14 md:grid-cols-2">
            {p.videos.map((v) => {
              const src = toEmbedUrl(v.url);
              return src ? (
                <figure key={v.url}>
                  {/* lazy iframe: nothing loads or plays until the visitor scrolls to it and presses play */}
                  <iframe src={src} title={v.title} loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen className="aspect-video w-full rounded-[var(--radius-lg)] border border-line" />
                  <figcaption className="mt-2 text-sm text-fg-3">{v.title}</figcaption>
                </figure>
              ) : null;
            })}
          </section>
        )}

        {p.challenges.length > 0 && (
          <Block title="Challenges and trade-offs">
            <div className="grid gap-6">
              {p.challenges.map((c) => (
                <div key={c.title}>
                  <h3 className="font-medium text-fg">{c.title}</h3>
                  <p className="mt-1">{c.body}</p>
                </div>
              ))}
            </div>
          </Block>
        )}
        {p.outcomes.filter((o) => o.verified || preview).length > 0 && (
          <Block title="Outcomes">
            <dl className="grid gap-6 sm:grid-cols-2">
              {p.outcomes
                .filter((o) => o.verified || preview)
                .map((o) => (
                  <div key={o.label} className="border-t border-line-strong pt-4">
                    <dd className="font-display text-[length:var(--step-4)] leading-none tracking-[-0.01em] text-fg">{o.value}</dd>
                    <dt className="mt-2">{o.label}</dt>
                    <VerificationBadge verified={o.verified} className="mt-2" />
                  </div>
                ))}
            </dl>
          </Block>
        )}
        {p.lessons && <Block title="Lessons learned"><p>{p.lessons}</p></Block>}

        {related.length > 0 && (
          <section className="border-t border-line py-14">
            <h2 className="display text-[length:var(--step-2)] text-fg">Related projects</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r._id}>
                  <Link href={`/work/${r.slug}`} className="block rounded-[var(--radius-lg)] border border-line p-5 hover:border-line-strong">
                    <span className="text-fg">{r.title}</span>
                    <span className="mt-1 block text-sm text-fg-2">{r.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {next && (
        <Link href={`/work/${next.slug}`} className="group block border-t border-line">
          <div className="container-site flex items-center justify-between gap-6 py-16 md:py-24">
            <span>
              <span className="text-sm text-fg-3">Next project</span>
              <span className="display mt-2 block text-[length:var(--step-5)] text-fg transition-colors group-hover:text-accent">{next.title}</span>
            </span>
            <ArrowRight className="size-10 shrink-0 text-fg-3 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-2 group-hover:text-accent" aria-hidden />
          </div>
        </Link>
      )}
    </article>
  );
}

export default function ProjectPage(props: PageProps<"/work/[slug]">) {
  return (
    <Suspense fallback={<div className="container-site min-h-[100dvh] pt-40" aria-busy="true" />}>
      <ProjectDetail params={props.params} />
    </Suspense>
  );
}

