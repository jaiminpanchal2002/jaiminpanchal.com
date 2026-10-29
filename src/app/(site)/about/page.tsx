import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { RichText } from "@/components/content/RichText";
import { Reveal } from "@/components/motion/Reveal";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { buttonClass } from "@/components/ui/styles";
import { getCertifications, getEducation, getExperiences, getProfile } from "@/content/api";
import { imageUrl } from "@/sanity/image";
import { jsonLd, pageMetadata, profilePageJsonLd } from "@/lib/seo";
import { formatRange } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "About Jaimin Panchal: engineering background, philosophy, working principles and current focus.",
  path: "/about",
  type: "profile",
});

export default async function AboutPage() {
  const [profile, education, certifications, experiences] = await Promise.all([getProfile(), getEducation(), getCertifications(), getExperiences()]);
  const portrait = imageUrl(profile.portrait, 1000);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(profilePageJsonLd(profile))} />
      <PageHeader title={profile.name} intro={`Engineer by training, product-minded by choice. ${profile.title} at PrimeQA Solutions in ${profile.location}.`} />

      {/* Introduction + portrait */}
      <section className="container-site grid gap-14 pb-[var(--space-section)] lg:grid-cols-[1.4fr_1fr]">
        <div>
          <RichText value={profile.bio} className="prose-jp text-[length:var(--step-1)] leading-relaxed" />
        </div>
        <Reveal variant="fade" className="lg:pt-2">
          {/* Profile card: portrait shown at a size the source photo supports (no upscaling blur). */}
          <div className="grid gap-6 rounded-[var(--radius-xl)] border border-line bg-bg-raised p-8">
            {portrait && (
              <div className="flex items-center gap-5">
                <Image
                  src={portrait}
                  alt={profile.portrait?.alt ?? `Portrait of ${profile.name}`}
                  width={176}
                  height={176}
                  priority
                  className="size-28 rounded-full border border-line-strong object-cover"
                />
                <div>
                  <p className="font-display text-lg font-semibold text-fg">{profile.name}</p>
                  <p className="text-sm text-fg-2">{profile.title}</p>
                </div>
              </div>
            )}
              <dl className="grid gap-5 text-sm">
                <div>
                  <dt className="text-fg-3">Based in</dt>
                  <dd className="mt-1 text-fg">{profile.location}</dd>
                </div>
                <div>
                  <dt className="text-fg-3">Currently</dt>
                  <dd className="mt-1 text-fg">{profile.title}</dd>
                </div>
                {profile.currentFocus && (
                  <div>
                    <dt className="text-fg-3">Focus</dt>
                    <dd className="mt-1 text-fg">{profile.currentFocus}</dd>
                  </div>
                )}
              </dl>
            {profile.socialLinks.length > 0 && (
              <ul className="flex flex-wrap gap-2 border-t border-line pt-5">
                {profile.socialLinks.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer me" className="pressable inline-flex items-center rounded-full border border-line-strong px-4 py-2 text-sm text-fg hover:bg-surface">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </section>

      {/* Philosophy: manifesto-scale type */}
      {profile.philosophy && (
        <section aria-labelledby="philosophy" className="border-y border-line bg-bg-raised/40 section-y">
          <div className="container-site">
            <h2 id="philosophy" className="sr-only">Engineering philosophy</h2>
            <Reveal as="p" className="max-w-[28ch] font-display text-[length:var(--step-4)] leading-[1.1] tracking-[-0.01em] text-fg">
              {profile.philosophy}
            </Reveal>
          </div>
        </section>
      )}

      {/* Principles: 2x2 */}
      <section aria-labelledby="principles-title" className="container-site section-y">
        <h2 id="principles-title" className="display text-[length:var(--step-4)]">Working principles</h2>
        <ol className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-2">
          {profile.principles.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 80} className="border-t border-line pt-6">
              <div>
                <h3 className="font-display text-[length:var(--step-2)] leading-tight tracking-[-0.01em] text-fg">{p.title}</h3>
                <p className="mt-2 text-fg-2">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Career + education */}
      <section className="container-site grid gap-16 pb-[var(--space-section)] lg:grid-cols-2">
        <div>
          <h2 className="display text-[length:var(--step-3)] text-fg">Career journey</h2>
          <ul className="mt-8 grid gap-6">
            {experiences.map((e) => (
              <li key={e._id} className="border-t border-line pt-5">
                <p className="text-fg">{e.role}</p>
                <p className="text-sm text-fg-2">
                  {e.company}
                  {formatRange(e.startDate, e.endDate, e.current) ? `, ${formatRange(e.startDate, e.endDate, e.current)}` : ""}
                </p>
              </li>
            ))}
          </ul>
          <Link href="/experience" className={buttonClass("secondary", "md", "mt-8")}>Full experience</Link>
        </div>
        <div className="grid content-start gap-14">
          <div>
            <h2 className="display text-[length:var(--step-3)] text-fg">Education</h2>
            <ul className="mt-8 grid gap-6">
              {education.map((e) => (
                <li key={e._id} className="border-t border-line pt-5">
                  <p className="text-fg">
                    {e.degree} in {e.field}
                  </p>
                  <p className="text-sm text-fg-2">
                    {e.institution}
                    {e.endYear ? `, ${e.startYear ? `${e.startYear} - ` : ""}${e.endYear}` : ""}
                  </p>
                  {e.notes && <p className="text-sm text-fg-3">{e.notes}</p>}
                  <VerificationBadge verified={e.verified} className="mt-2" />
                </li>
              ))}
            </ul>
          </div>
          {certifications.length > 0 && (
            <div>
              <h2 className="display text-[length:var(--step-3)] text-fg">Certifications</h2>
              <ul className="mt-8 grid gap-4">
                {certifications.map((c) => (
                  <li key={c._id} className="border-t border-line pt-4">
                    {c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-fg underline decoration-accent underline-offset-4">{c.name}</a> : <span className="text-fg">{c.name}</span>}
                    <p className="text-sm text-fg-2">{c.issuer}{c.issued ? `, ${c.issued}` : ""}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {profile.interests.length > 0 && (
            <div>
              <h2 className="display text-[length:var(--step-3)] text-fg">Areas of interest</h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {profile.interests.map((i) => (
                  <li key={i} className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-fg-2">{i}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
