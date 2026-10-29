import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClass } from "@/components/ui/styles";
import { getServices } from "@/content/api";
import { breadcrumbJsonLd, jsonLd, pageMetadata, servicesJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services: Laravel, API, SaaS and AI development",
  description:
    "Hire Jaimin Panchal for Laravel and PHP backend development, REST APIs, multi-tenant SaaS, AI and LLM integration, Flutter app backends, payment integrations and CI/CD. Based in Ahmedabad, working with teams in India and remotely.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(servicesJsonLd(services))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]))} />
      <PageHeader
        title="Services"
        intro="Backend and full stack engineering I deliver for product teams, startups and agencies: from Laravel APIs to AI features. Based in Ahmedabad, India, working on-site and remotely."
      >
        <div className="mt-10">
          <Link href="/contact" className={buttonClass("primary", "lg")}>
            Let&apos;s connect
          </Link>
        </div>
      </PageHeader>
      <section className="container-site mb-[var(--space-section)] border-b border-line">
        <ol>
          {services.map((s, i) => (
            <Reveal as="li" key={s._id} delay={Math.min(i, 3) * 60} className="border-t border-line">
              <Link href={`/services/${s.slug}`} className="group grid gap-6 py-10 md:grid-cols-4 md:gap-0">
                <h2 className="display text-[length:var(--step-3)] md:col-span-2 md:pr-8 transition-transform duration-500 ease-[var(--ease-out)] [@media(hover:hover)]:group-hover:translate-x-2">
                  {s.title}
                </h2>
                <div className="md:col-span-2 md:pl-[var(--gutter)]">
                  <p className="text-[length:var(--step-1)] leading-snug text-fg-2">{s.summary}</p>
                  <p className="mt-4 text-sm text-fg-3">{s.technologies.join(", ")}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm text-fg underline decoration-line-strong underline-offset-4 group-hover:decoration-fg">
                    Details and related projects <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ol>
      </section>
    </>
  );
}
