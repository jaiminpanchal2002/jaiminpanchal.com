import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { Story } from "@/components/home/Story";
import { Timeline } from "@/components/home/Timeline";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Process } from "@/components/home/Process";
import { Capabilities } from "@/components/home/Capabilities";
import { Impact } from "@/components/home/Impact";
import { Writing } from "@/components/home/Writing";
import { ContactFinale } from "@/components/home/ContactFinale";
import { SplitHeading } from "@/components/motion/Reveal";
import { buttonClass } from "@/components/ui/styles";
import { getExperiences, getHomePage, getMetrics, getPosts, getProfile, getProjects, getSiteSettings, getSkills, isPreviewing } from "@/content/api";
import { imageUrl } from "@/sanity/image";
import type { Metadata } from "next";
import { jsonLd, siteJsonLd } from "@/lib/seo";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: DEFAULT_TITLE },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, url: "/", type: "profile" },
};
import type { HomeSectionKey } from "@/content/types";

export default async function HomePage() {
  const [settings, home, profile, experiences, projects, skills, metrics, posts, preview] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getProfile(),
    getExperiences(),
    getProjects(),
    getSkills(),
    getMetrics(),
    getPosts(),
    isPreviewing(),
  ]);

  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const featured = home.featuredProjectSlugs.length
    ? home.featuredProjectSlugs.map((s) => bySlug.get(s)).filter((p) => p !== undefined)
    : projects.filter((p) => p.featured);

  const sections: Record<HomeSectionKey, React.ReactNode> = {
    story: <Story home={home} portraitUrl={imageUrl(profile.portrait, 700)} portraitAlt={profile.portrait?.alt} />,
    experience: (
      <section aria-labelledby="journey-title" className="section-y">
        <div className="container-site grid gap-14 lg:grid-cols-[1fr_1.6fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SplitHeading as="h2" id="journey-title" text="The journey so far" className="display text-[length:var(--step-4)]" />
            <p className="mt-6 max-w-[38ch] text-fg-2">From engineering roles to product and delivery ownership.</p>
            <Link href="/experience" className={buttonClass("secondary", "md", "mt-8")}>
              Full experience
            </Link>
          </div>
          <Timeline items={experiences} compact preview={preview} />
        </div>
      </section>
    ),
    work: <SelectedWork projects={featured} />,
    process: <Process steps={home.processSteps} />,
    capabilities: <Capabilities categories={skills.categories} skills={skills.skills} />,
    impact: <Impact metrics={metrics} />,
    writing: <Writing posts={posts} />,
    contact: <ContactFinale home={home} profile={profile} />,
  };

  return (
    <>
      <Intro enabled={settings.introEnabled} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(siteJsonLd(profile))} />
      <Hero home={home} profile={profile} />
      {home.sections
        .filter((s) => s.visible && s.key in sections)
        .map((s) => (
          <div key={s.key} id={s.key}>
            {sections[s.key]}
          </div>
        ))}
    </>
  );
}
