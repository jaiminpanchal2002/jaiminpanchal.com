import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { buttonClass } from "@/components/ui/styles";
import { getProjects, getService, getServices } from "@/content/api";
import { breadcrumbJsonLd, jsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const services = await getServices();
  return services.length ? services.map((s) => ({ slug: s.slug })) : [{ slug: "__none" }];
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = await getService(slug);
  if (!s) return { title: "Service not found", robots: { index: false } };
  return pageMetadata({
    title: `${s.title} in Ahmedabad, India`,
    description: `${s.summary} ${s.title} by Jaimin Panchal, AI Full Stack Developer in Ahmedabad, available for teams in India and remotely.`,
    path: `/services/${s.slug}`,
    seo: s.seo,
  });
}

async function ServiceDetail({ params }: { params: PageProps<"/services/[slug]">["params"] }) {
  const { slug } = await params;
  const [service, projects, all] = await Promise.all([getService(slug), getProjects(), getServices()]);
  if (!service) notFound();
  const s = service;
  const proof = s.projectSlugs.map((ps) => projects.find((p) => p.slug === ps)).filter((p) => p !== undefined);
  const others = all.filter((o) => o.slug !== s.slug);

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(serviceJsonLd(s))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: s.title, path: `/services/${s.slug}` }]))} />
      <header className="container-site pt-32 pb-12 md:pt-40">
        <Link href="/services" className="inline-flex items-center gap-2 text-sm text-fg-2 hover:text-fg">
          <ArrowLeft className="size-4" aria-hidden /> All services
        </Link>
        <SplitHeading as="h1" text={s.title} className="display mt-8 max-w-[20ch] text-[length:var(--step-5)]" />
        <p className="rise mt-6 max-w-[60ch] text-[length:var(--step-1)] leading-snug text-fg-2" style={{ "--i": 2 } as React.CSSProperties}>
          {s.summary}
        </p>
      </header>

      <div className="container-site grid gap-12 border-t border-line py-14 md:grid-cols-4 md:gap-0">
        <Reveal className="md:col-span-2 md:pr-10">
          <h2 className="display text-[length:var(--step-2)]">How I work on this</h2>
          <p className="mt-5 max-w-[62ch] text-fg-2">{s.description}</p>
          {s.technologies.length > 0 && (
            <>
              <h3 className="mt-10 font-display text-sm font-semibold uppercase tracking-[0.04em] text-fg">Technologies</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {s.technologies.map((t) => (
                  <li key={t} className="rounded-full border border-line-strong px-3 py-1 text-sm text-fg-2">
                    {t}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Reveal>
        <Reveal delay={80} className="md:col-span-2 md:pl-[var(--gutter)]">
          <h2 className="display text-[length:var(--step-2)]">What is included</h2>
          <ul className="mt-5 grid gap-3 text-fg-2">
            {s.deliverables.map((d) => (
              <li key={d} className="border-t border-line pt-3">
                {d}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {proof.length > 0 && (
        <section aria-labelledby="proof" className="container-site border-t border-line py-14">
          <h2 id="proof" className="display text-[length:var(--step-2)]">Related projects</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {proof.map((p) => (
              <li key={p._id}>
                <Link href={`/work/${p.slug}`} className="group block h-full rounded-[var(--radius-lg)] border border-line p-6 transition-colors hover:border-line-strong">
                  <span className="flex items-start justify-between gap-4">
                    <span className="font-display text-lg font-semibold text-fg">{p.title}</span>
                    <ArrowUpRight className="size-5 shrink-0 text-fg-3 group-hover:text-fg" aria-hidden />
                  </span>
                  <span className="mt-2 block text-sm text-fg-2">{p.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="container-site border-t border-line py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="display max-w-[22ch] text-[length:var(--step-3)]">Need help with this?</p>
          <Link href="/contact" className={buttonClass("primary", "lg")}>
            Let&apos;s connect
          </Link>
        </div>
        <nav aria-label="Other services" className="mt-14">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.04em] text-fg-3">Other services</h2>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {others.map((o) => (
              <li key={o._id}>
                <Link href={`/services/${o.slug}`} className="text-fg-2 underline decoration-line-strong underline-offset-4 hover:text-fg">
                  {o.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </article>
  );
}

export default function ServicePage(props: PageProps<"/services/[slug]">) {
  return (
    <Suspense fallback={<div className="container-site min-h-[100dvh] pt-40" aria-busy="true" />}>
      <ServiceDetail params={props.params} />
    </Suspense>
  );
}
