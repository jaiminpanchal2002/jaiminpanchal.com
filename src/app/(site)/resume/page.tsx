import type { Metadata } from "next";
import { Download } from "lucide-react";
import { PrintButton } from "@/components/ui/PrintButton";
import { buttonClass } from "@/components/ui/styles";
import { getCertifications, getEducation, getExperiences, getProfile, getSkills } from "@/content/api";
import { pageMetadata } from "@/lib/seo";
import { formatRange } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({ title: "Resume", description: "Resume of Jaimin Panchal, AI Full Stack Developer / Project Manager.", path: "/resume" });

/** HTML resume generated from CMS data, print-optimised. Uses the uploaded PDF when one exists. */
export default async function ResumePage() {
  const [profile, experiences, education, certifications, { categories, skills }] = await Promise.all([getProfile(), getExperiences(), getEducation(), getCertifications(), getSkills()]);
  return (
    <div className="container-site max-w-4xl pt-32 pb-[var(--space-section)] print:pt-0">
      <div className="no-print mb-12 flex flex-wrap gap-3">
        {profile.resumeUrl ? (
          <a href={profile.resumeUrl} download className={buttonClass("primary")}>
            <Download className="size-4" aria-hidden /> Download PDF
          </a>
        ) : null}
        <PrintButton />
      </div>
      <article className="grid gap-12">
        <header className="border-b border-line pb-8">
          <h1 className="display text-[length:var(--step-5)]">{profile.name}</h1>
          <p className="mt-3 text-[length:var(--step-1)] text-fg">{profile.title}</p>
          <p className="mt-2 text-fg-2">
            {profile.location}
            {profile.email ? ` / ${profile.email}` : ""}
          </p>
          {profile.socialLinks.length > 0 && <p className="mt-1 text-sm text-fg-3">{profile.socialLinks.map((s) => s.url).join("  /  ")}</p>}
        </header>
        <section>
          <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-fg-3">Summary</h2>
          <p className="mt-3 max-w-[70ch] text-fg">{profile.shortBio}</p>
        </section>
        <section>
          <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-fg-3">Experience</h2>
          <ul className="mt-4 grid gap-6">
            {experiences.map((e) => (
              <li key={e._id} className="break-inside-avoid">
                <p className="flex flex-wrap justify-between gap-2">
                  <span className="font-medium text-fg">
                    {e.role}, {e.company}
                  </span>
                  <span className="text-sm text-fg-3">{formatRange(e.startDate, e.endDate, e.current)}</span>
                </p>
                <p className="mt-1 text-fg-2">{e.summary}</p>
                {e.achievements.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm text-fg-2">
                    {e.achievements.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-fg-3">Skills</h2>
          <dl className="mt-4 grid gap-2 text-sm">
            {categories
              .map((c) => ({ c, list: skills.filter((s) => s.category === c.slug && s.verified) }))
              .filter((g) => g.list.length)
              .map(({ c, list }) => (
                <div key={c._id} className="grid grid-cols-[12rem_1fr] gap-4">
                  <dt className="text-fg-3">{c.title}</dt>
                  <dd className="text-fg">{list.map((s) => s.name).join(", ")}</dd>
                </div>
              ))}
          </dl>
        </section>
        <section>
          <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-fg-3">Education</h2>
          <ul className="mt-4 grid gap-2">
            {education.map((e) => (
              <li key={e._id} className="text-fg">
                {e.degree} in {e.field}, {e.institution}
                {e.endYear ? `, ${e.startYear ? `${e.startYear} - ` : ""}${e.endYear}` : ""}
                {e.notes ? ` (${e.notes})` : ""}
              </li>
            ))}
          </ul>
        </section>
        {certifications.length > 0 && (
          <section>
            <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-fg-3">Certifications</h2>
            <ul className="mt-4 grid gap-2">
              {certifications.map((c) => (
                <li key={c._id} className="text-fg">
                  {c.name}, {c.issuer}
                  {c.issued ? ` (${c.issued})` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </div>
  );
}
