/**
 * Builds Sanity documents from src/content/seed.ts.
 * Verified records become published documents; unverified ones become drafts ("drafts." id),
 * so they never reach the public dataset until reviewed and published in the Studio.
 */
import * as seed from "../src/content/seed";
import { slugify } from "../src/content/pt";

export type Doc = Record<string, unknown> & { _id: string; _type: string };

export function buildDocs(): Doc[] {
  const docs: Doc[] = [];
  let k = 0;
  const key = () => `seed${(k++).toString(36)}`;
  const keyed = <T extends object>(arr: T[]) => arr.map((x) => ({ _key: key(), ...x }));
  const slug = (s: string) => ({ _type: "slug", current: s });
  const ref = (id: string) => ({ _type: "reference", _ref: id, _key: key() });
  const id = (base: string, verified: boolean) => (verified ? base : `drafts.${base}`);
  const day = (ym?: string) => (ym ? (ym.length === 7 ? `${ym}-01` : ym) : undefined);

  const verifiedProjects = new Set(seed.projects.filter((p) => p.verified).map((p) => p.slug));
  const projectRefs = (slugs: string[]) => slugs.filter((s) => verifiedProjects.has(s)).map((s) => ref(`project-${s}`));

  const s = seed.siteSettings;
  docs.push({ _id: "siteSettings", _type: "siteSettings", siteName: s.siteName, tagline: s.tagline, description: s.description, url: s.url, defaultTheme: s.defaultTheme, animationPreset: s.animationPreset, introEnabled: s.introEnabled });
  docs.push({ _id: "navigation", _type: "navigation", main: keyed(s.mainNav), footer: keyed(s.footerNav) });

  const p = seed.profile;
  for (const l of p.socialLinks) docs.push({ _id: `socialLink-${l.platform}`, _type: "socialLink", platform: l.platform, label: l.label, url: l.url });
  docs.push({
    _id: "personalProfile",
    _type: "personalProfile",
    name: p.name,
    title: p.title,
    headline: p.headline,
    shortBio: p.shortBio,
    bio: p.bio,
    location: p.location,
    timezone: p.timezone,
    email: p.email,
    availability: p.availability,
    socialLinks: p.socialLinks.map((l) => ref(`socialLink-${l.platform}`)),
    interests: p.interests,
    principles: keyed(p.principles),
    philosophy: p.philosophy,
    currentFocus: p.currentFocus,
  });

  const h = seed.homePage;
  docs.push({
    _id: "homePage",
    _type: "homePage",
    heroKicker: h.heroKicker,
    heroGreeting: h.heroGreeting,
    heroHeadline: h.heroHeadline,
    heroSupporting: h.heroSupporting,
    primaryCta: { _type: "cta", ...h.primaryCta },
    secondaryCta: { _type: "cta", ...h.secondaryCta },
    heroVariant: h.heroVariant,
    storyHeadline: h.storyHeadline,
    storyBeats: keyed(h.storyBeats),
    processSteps: keyed(h.processSteps),
    contactHeadline: h.contactHeadline,
    collaborationInterests: h.collaborationInterests,
    sections: keyed(h.sections),
    featuredProjects: projectRefs(h.featuredProjectSlugs),
  });

  const now = seed.nowPage;
  docs.push({ _id: id("nowPage", now.verified), _type: "nowPage", updatedAt: now.updatedAt, intro: now.intro, items: keyed(now.items), verified: now.verified });

  // Project categories (one document per distinct category title)
  for (const title of [...new Set(seed.projects.map((pr) => pr.category))]) {
    docs.push({ _id: `category-${slugify(title)}`, _type: "projectCategory", title, slug: slug(slugify(title)) });
  }
  for (const pr of seed.projects) {
    docs.push({
      _id: id(pr._id, pr.verified),
      _type: "project",
      title: pr.title,
      slug: slug(pr.slug),
      summary: pr.summary,
      category: { _type: "reference", _ref: `category-${slugify(pr.category)}` },
      projectType: pr.projectType,
      year: pr.year,
      role: pr.role,
      contribution: pr.contribution,
      technologies: pr.technologies,
      problem: pr.problem,
      objectives: pr.objectives,
      solution: pr.solution,
      architecture: pr.architecture,
      features: pr.features,
      challenges: keyed(pr.challenges),
      outcomes: keyed(pr.outcomes),
      lessons: pr.lessons,
      demoUrl: pr.demoUrl,
      repoUrl: pr.repoUrl,
      accent: pr.accent,
      featured: pr.featured,
      order: pr.order,
      verificationTasks: pr.verificationTasks,
      verified: pr.verified,
    });
  }

  for (const c of seed.skillCategories) docs.push({ _id: c._id, _type: "skillCategory", title: c.title, slug: slug(c.slug), description: c.description, order: c.order });
  for (const sk of seed.skills) {
    const cat = seed.skillCategories.find((c) => c.slug === sk.category)!;
    docs.push({
      _id: id(sk._id, sk.verified),
      _type: "skill",
      name: sk.name,
      category: { _type: "reference", _ref: cat._id },
      description: sk.description,
      projects: projectRefs(sk.projectSlugs),
      order: sk.order,
      visible: sk.visible,
      verified: sk.verified,
    });
  }

  for (const e of seed.experiences) {
    docs.push({
      _id: id(e._id, e.verified),
      _type: "experience",
      company: e.company,
      role: e.role,
      employmentType: e.employmentType,
      location: e.location,
      startDate: day(e.startDate),
      endDate: day(e.endDate),
      current: e.current ?? false,
      summary: e.summary,
      responsibilities: e.responsibilities,
      achievements: e.achievements,
      technologies: e.technologies,
      projects: projectRefs(e.projectSlugs),
      order: e.order,
      verificationNotes: e.verificationNotes,
      verified: e.verified,
    });
  }
  for (const e of seed.education) {
    docs.push({ _id: id(e._id, e.verified), _type: "education", institution: e.institution, degree: e.degree, field: e.field, startYear: e.startYear, endYear: e.endYear, notes: e.notes, verified: e.verified });
  }
  for (const c of seed.certifications) {
    docs.push({ _id: id(c._id, c.verified), _type: "certification", name: c.name, issuer: c.issuer, issued: c.issued, url: c.url, verified: c.verified });
  }
  seed.metrics.forEach((m, i) => {
    docs.push({ _id: id(m._id, m.verified), _type: "achievement", value: m.value, prefix: m.prefix, suffix: m.suffix, label: m.label, explanation: m.explanation, context: m.context, order: i + 1, verified: m.verified });
  });

  for (const sv of seed.services) {
    docs.push({ _id: sv._id, _type: "service", title: sv.title, slug: slug(sv.slug), summary: sv.summary, description: sv.description, deliverables: sv.deliverables, technologies: sv.technologies, projects: projectRefs(sv.projectSlugs), order: sv.order });
  }

  docs.push({ _id: "blogCategory-template", _type: "blogCategory", title: "Template", slug: slug("template") });
  for (const post of seed.posts) {
    docs.push({
      _id: id(post._id, post.verified),
      _type: "blogPost",
      title: post.title,
      slug: slug(post.slug),
      excerpt: post.excerpt,
      category: { _type: "reference", _ref: "blogCategory-template" },
      body: post.body,
      publishedAt: new Date(post.publishedAt).toISOString(),
      featured: post.featured,
      verified: post.verified,
    });
  }
  for (const c of seed.caseStudies) {
    docs.push({
      _id: id(c._id, c.verified),
      _type: "caseStudy",
      title: c.title,
      slug: slug(c.slug),
      template: c.template,
      excerpt: c.excerpt,
      role: c.role,
      team: c.team,
      sections: c.sections.map((sec) => ({ _type: "caseSection", ...sec, _key: key() })),
      verified: c.verified,
    });
  }

  // Drop undefined fields so Sanity documents stay clean.
  return docs.map((d) => JSON.parse(JSON.stringify(d)) as Doc);
}
