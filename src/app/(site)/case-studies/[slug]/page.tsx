import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { RichText } from "@/components/content/RichText";
import { TableOfContents } from "@/components/content/TableOfContents";
import { BeforeAfter } from "@/components/content/BeforeAfter";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Reveal } from "@/components/motion/Reveal";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { getCaseStudies, getCaseStudy } from "@/content/api";
import { imageUrl } from "@/sanity/image";
import { slugify } from "@/content/pt";
import { breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const all = await getCaseStudies();
  return all.length ? all.map((c) => ({ slug: c.slug })) : [{ slug: "__none" }];
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCaseStudy(slug);
  if (!c) return { title: "Case study not found", robots: { index: false } };
  return {
    ...pageMetadata({ title: c.title, description: c.excerpt, path: `/case-studies/${c.slug}`, seo: c.seo, type: "article", publishedTime: c.publishedAt }),
    ...(c.verified ? {} : { robots: { index: false, follow: false } }),
  };
}

async function CaseStudyBody({ params }: { params: PageProps<"/case-studies/[slug]">["params"] }) {
  const { slug } = await params;
  const c = await getCaseStudy(slug);
  if (!c) notFound();
  const toc = c.sections.map((s) => ({ id: slugify(s.heading), text: s.heading, level: 2 }));
  const cover = imageUrl(c.coverImage, 2000);
  const before = imageUrl(c.comparison?.before, 1600);
  const after = imageUrl(c.comparison?.after, 1600);
  const mid = Math.ceil(c.sections.length / 2);

  return (
    <article>
      <ScrollProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Case studies", path: "/case-studies" }, { name: c.title, path: `/case-studies/${c.slug}` }]))} />
      <header className="relative isolate overflow-hidden pt-32 pb-12 md:pt-40">
        <div aria-hidden className="tech-grid absolute inset-0 -z-10 opacity-50" />
        <div className="container-site">
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-sm text-fg-2 hover:text-fg">
            <ArrowLeft className="size-4" aria-hidden /> All case studies
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-fg-3">
            <span>{c.template === "engineering" ? "Engineering case study" : "Product delivery case study"}</span>
            <VerificationBadge verified={c.verified} />
          </div>
          <h1 className="display mt-4 max-w-[18ch] text-[length:var(--step-5)]">{c.title}</h1>
          <p className="mt-6 max-w-[60ch] text-[length:var(--step-1)] leading-snug text-fg-2">{c.excerpt}</p>
          {(c.role || c.team || c.projectSlug) && (
            <dl className="mt-10 grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
              {c.role && (<div><dt className="text-sm text-fg-3">Role</dt><dd className="mt-1 text-fg">{c.role}</dd></div>)}
              {c.team && (<div><dt className="text-sm text-fg-3">Team</dt><dd className="mt-1 text-fg">{c.team}</dd></div>)}
              {c.projectSlug && (<div><dt className="text-sm text-fg-3">Project</dt><dd className="mt-1"><Link className="text-fg underline decoration-accent underline-offset-4" href={`/work/${c.projectSlug}`}>View project</Link></dd></div>)}
            </dl>
          )}
        </div>
      </header>
      {cover && (
        <Reveal variant="wipe" className="container-site">
          <Image src={cover} alt={c.coverImage?.alt ?? ""} width={2000} height={1000} priority sizes="100vw" className="rounded-[var(--radius-xl)] border border-line" />
        </Reveal>
      )}

      <div className="container-site grid gap-12 py-16 lg:grid-cols-[15rem_1fr] lg:gap-20">
        <aside className="no-print lg:sticky lg:top-28 lg:self-start">
          <TableOfContents items={toc} label="Contents" />
        </aside>
        <div className="grid min-w-0 gap-4">
          {c.sections.map((s, i) => (
            <div key={s._key}>
              <Reveal as="section" aria-labelledby={slugify(s.heading)} className="border-t border-line pt-10 pb-6">
                <p className="font-display tabular-nums text-xs uppercase tracking-[0.18em] text-fg-3">{s.kind}</p>
                <h2 id={slugify(s.heading)} className="mt-3 display text-[length:var(--step-3)] text-fg">{s.heading}</h2>
                <RichText value={s.body} className="prose-jp mt-6" />
              </Reveal>
              {i === mid - 1 && c.pullQuote && (
                <Reveal as="blockquote" className="my-14 border-l-2 border-accent pl-8 font-display text-[length:var(--step-3)] leading-[1.15] tracking-[-0.01em] text-fg">
                  {c.pullQuote}
                </Reveal>
              )}
              {i === mid - 1 && before && after && (
                <BeforeAfter before={before} after={after} beforeAlt={c.comparison?.before?.alt ?? "Before"} afterAlt={c.comparison?.after?.alt ?? "After"} caption={c.comparison?.caption} />
              )}
            </div>
          ))}
          {c.evidence.length > 0 && (
            <section aria-label="Evidence" className="mt-10 grid gap-6 rounded-[var(--radius-xl)] border border-line bg-bg-raised p-8 sm:grid-cols-3">
              {c.evidence.map((e) => (
                <div key={e.label}>
                  <p className="font-display text-[length:var(--step-4)] leading-none tracking-[-0.01em] text-fg">{e.value}</p>
                  <p className="mt-2 text-sm text-fg-2">{e.label}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </article>
  );
}

export default function CaseStudyPage(props: PageProps<"/case-studies/[slug]">) {
  return (
    <Suspense fallback={<div className="container-site min-h-[100dvh] pt-40" aria-busy="true" />}>
      <CaseStudyBody params={props.params} />
    </Suspense>
  );
}
