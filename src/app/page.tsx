import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { AiSection } from "@/components/sections/AiSection";
import { WhatIBuildSection } from "@/components/sections/WhatIBuildSection";
import { CurrentlyBuildingSection } from "@/components/sections/CurrentlyBuildingSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { PublicChrome } from "@/components/ui/PublicChrome";
import {
  getPublicProjectsFull,
  getPublicExperiences,
  getPublicSkills,
  getPublicBuilding,
  getPublicJourney,
  getPublicProfile,
  getPublicEducation,
  getPublicAchievements,
} from "@/lib/queries";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

// CMS-driven and rendered per request — also keeps the build DB-free.
export const dynamic = "force-dynamic";

const FALLBACK_TITLE = "Jaimin Panchal — Full-Stack & AI Engineer";
const FALLBACK_DESC =
  "Jaimin Panchal — full-stack engineer and AI/GenAI developer building web products, RAG systems and practical developer tools.";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings
    .findUnique({ where: { id: "singleton" } })
    .catch(() => null);

  const title = settings?.seoTitle ?? FALLBACK_TITLE;
  const description = settings?.seoDescription ?? FALLBACK_DESC;

  return {
    title,
    description,
    alternates: { canonical: SITE_URL },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      type: "website",
      images: settings?.ogImageUrl ? [{ url: settings.ogImageUrl }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

async function getPersonJsonLd() {
  const profile = await prisma.profile
    .findFirst({ include: { socials: true } })
    .catch(() => null);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile?.name ?? "Jaimin Panchal",
    jobTitle: profile?.title ?? "Full-Stack & AI Engineer",
    description: profile?.tagline ?? FALLBACK_DESC,
    url: SITE_URL,
    email: profile?.email ?? undefined,
    sameAs: profile?.socials?.map((s) => s.url) ?? [],
    knowsAbout: [
      "Full-Stack Development",
      "AI Engineering",
      "Generative AI",
      "RAG",
      "Next.js",
      "React",
      "Laravel",
    ],
  };
}

export default async function Home() {
  const [
    profile,
    projects,
    experiences,
    skills,
    building,
    journey,
    education,
    achievements,
    jsonLd,
  ] = await Promise.all([
    getPublicProfile(),
    getPublicProjectsFull(),
    getPublicExperiences(),
    getPublicSkills(),
    getPublicBuilding(),
    getPublicJourney(),
    getPublicEducation(),
    getPublicAchievements(),
    getPersonJsonLd(),
  ]);

  return (
    <>
      <SiteHeader profile={profile} />
      <main id="main" className="bg-[#0C0C0C]" style={{ overflowX: "clip" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PublicChrome />
        <HeroSection profile={profile} />
        <AboutSection />
        <JourneySection journey={journey} />
        <SkillsSection skillCategories={skills} />
        <ExperienceSection experiences={experiences} />
        <EducationSection education={education} achievements={achievements} />
        <ProjectsSection projects={projects} />
        <AiSection />
        <WhatIBuildSection />
        <CurrentlyBuildingSection currentlyBuilding={building} />
        <ContactSection profile={profile} />
      </main>
    </>
  );
}
