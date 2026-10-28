import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { draftMode } from "next/headers";
import { stegaClean } from "next-sanity";
import { client, previewClient, readToken } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import * as q from "@/sanity/queries";
import * as seed from "./seed";
import { readingMinutes } from "./pt";
import { showUnverified, visibleOnly } from "./visibility";
import type {
  CaseStudy,
  Certification,
  Education,
  Experience,
  HomePage,
  Metric,
  NowPage,
  Post,
  Profile,
  Project,
  SiteSettings,
  Skill,
  SkillCategory,
} from "./types";

/**
 * Content access layer.
 *
 * - Sanity configured  → fetch from Sanity (drafts perspective when Draft Mode is on).
 * - Not configured     → local seed (src/content/seed.ts).
 * - Unverified records → filtered out unless previewing (Draft Mode or CONTENT_PREVIEW_UNVERIFIED).
 *
 * Every getter is cached with `use cache` and tagged per document type so the
 * Sanity webhook (/api/revalidate) can invalidate exactly what changed.
 * In Draft Mode Next.js bypasses these caches automatically.
 */

async function isDraft() {
  return (await draftMode()).isEnabled;
}

async function preview() {
  return showUnverified() || (await isDraft());
}

async function fetchSanity<T>(query: string): Promise<T | null> {
  if (!isSanityConfigured) return null;
  const draft = await isDraft();
  const c = draft && readToken ? previewClient() : client;
  try {
    return (await c.fetch<T>(query)) ?? null;
  } catch (err) {
    console.error("[content] Sanity fetch failed, using seed fallback", err);
    return null;
  }
}

/** Singletons merge over seed defaults so a half-filled CMS document never blanks the page. */
function mergeDefined<T extends object>(base: T, override: Partial<T> | null): T {
  if (!override) return base;
  const out = { ...base };
  for (const [k, v] of Object.entries(override)) {
    // Skip unset fields and empty lists: an empty CMS list falls back to the seed default.
    if (v === null || v === undefined || (Array.isArray(v) && v.length === 0)) continue;
    (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

const clean = <T>(v: T): T => stegaClean(v) as T;

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag("siteSettings", "navigation");
  const remote = await fetchSanity<Partial<SiteSettings>>(q.siteSettingsQuery);
  const merged = mergeDefined(seed.siteSettings, remote);
  return { ...merged, mainNav: clean(merged.mainNav).filter((n) => n.visible), footerNav: clean(merged.footerNav).filter((n) => n.visible) };
}

export async function getProfile(): Promise<Profile> {
  "use cache";
  cacheLife("hours");
  cacheTag("personalProfile", "socialLink");
  const remote = await fetchSanity<Partial<Profile>>(q.profileQuery);
  const p = mergeDefined(seed.profile, remote);
  return { ...p, socialLinks: p.socialLinks.map((s) => ({ ...s, url: clean(s.url), platform: clean(s.platform) })) };
}

export async function getHomePage(): Promise<HomePage> {
  "use cache";
  cacheLife("hours");
  cacheTag("homePage");
  const remote = await fetchSanity<Partial<HomePage>>(q.homePageQuery);
  const h = mergeDefined(seed.homePage, remote);
  return {
    ...h,
    heroVariant: clean(h.heroVariant),
    sections: clean(h.sections),
    featuredProjectSlugs: clean(h.featuredProjectSlugs ?? []),
    primaryCta: { ...h.primaryCta, href: clean(h.primaryCta.href) },
    secondaryCta: { ...h.secondaryCta, href: clean(h.secondaryCta.href) },
  };
}

export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("project", "projectCategory");
  const remote = await fetchSanity<Project[]>(q.projectsQuery);
  const list = remote ?? seed.projects;
  return visibleOnly(
    list.map((p) => ({ ...p, slug: clean(p.slug), category: clean(p.category), technologies: clean(p.technologies), accent: clean(p.accent) })),
    await preview(),
  );
}

export async function getProject(slug: string): Promise<Project | null> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("caseStudy");
  const remote = await fetchSanity<CaseStudy[]>(q.caseStudiesQuery);
  const list = remote ?? seed.caseStudies;
  return visibleOnly(
    list.map((c) => ({ ...c, slug: clean(c.slug), template: clean(c.template) })),
    await preview(),
  );
}

export async function getCaseStudy(slug: string) {
  return (await getCaseStudies()).find((c) => c.slug === slug) ?? null;
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("blogPost", "blogCategory", "blogTag");
  const remote = await fetchSanity<Post[]>(q.postsQuery);
  const list = remote ?? seed.posts;
  return visibleOnly(
    list.map((p) => ({
      ...p,
      slug: clean(p.slug),
      category: clean(p.category),
      tags: clean(p.tags),
      readingMinutes: p.readingMinutes || readingMinutes(p.body),
    })),
    await preview(),
  );
}

export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug) ?? null;
}

export async function getExperiences(): Promise<Experience[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("experience");
  const remote = await fetchSanity<Experience[]>(q.experiencesQuery);
  return visibleOnly(remote ?? seed.experiences, await preview()).map((e) => ({ ...e, projectSlugs: clean(e.projectSlugs), employmentType: clean(e.employmentType) }));
}

export async function getEducation(): Promise<Education[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("education");
  return visibleOnly((await fetchSanity<Education[]>(q.educationQuery)) ?? seed.education, await preview());
}

export async function getCertifications(): Promise<Certification[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("certification");
  return visibleOnly((await fetchSanity<Certification[]>(q.certificationsQuery)) ?? seed.certifications, await preview());
}

export async function getSkills(): Promise<{ categories: SkillCategory[]; skills: Skill[] }> {
  "use cache";
  cacheLife("hours");
  cacheTag("skill", "skillCategory");
  const [cats, skills] = await Promise.all([
    fetchSanity<SkillCategory[]>(q.skillCategoriesQuery),
    fetchSanity<Skill[]>(q.skillsQuery),
  ]);
  return {
    categories: clean(cats ?? seed.skillCategories),
    skills: visibleOnly((skills ?? seed.skills).map((s) => ({ ...s, category: clean(s.category) })), await preview()).filter((s) => s.visible),
  };
}

export async function getMetrics(): Promise<Metric[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("achievement");
  return visibleOnly((await fetchSanity<Metric[]>(q.metricsQuery)) ?? seed.metrics, await preview());
}

export async function getNowPage(): Promise<NowPage | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("nowPage");
  const now = (await fetchSanity<NowPage>(q.nowPageQuery)) ?? seed.nowPage;
  return now.verified || (await preview()) ? now : null;
}

/** Exposed so pages can label preview-only content. */
export async function isPreviewing() {
  return preview();
}
