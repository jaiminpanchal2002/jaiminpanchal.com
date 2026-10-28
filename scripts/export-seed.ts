/**
 * Exports src/content/seed.ts as Sanity NDJSON for `sanity dataset import`.
 *
 *   npm run seed:export                     -> writes seed/initial-content.ndjson
 *   npx sanity dataset import seed/initial-content.ndjson production --missing
 *
 * Verified records are imported as published documents. Unverified records are imported
 * as DRAFTS (id prefix "drafts."), so they never reach the public dataset until the owner
 * reviews, verifies and publishes them in the Studio.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import * as seed from "../src/content/seed";

type Doc = Record<string, unknown> & { _id: string; _type: string };
const docs: Doc[] = [];
let k = 0;
const key = () => `seed${(k++).toString(36)}`;
const keyed = <T extends object>(arr: T[]) => arr.map((x) => ({ _key: key(), ...x }));
const slug = (s: string) => ({ _type: "slug", current: s });
const id = (base: string, verified: boolean) => (verified ? base : `drafts.${base}`);

const s = seed.siteSettings;
docs.push({ _id: "siteSettings", _type: "siteSettings", siteName: s.siteName, tagline: s.tagline, description: s.description, defaultTheme: s.defaultTheme, animationPreset: s.animationPreset, introEnabled: s.introEnabled });
docs.push({ _id: "navigation", _type: "navigation", main: keyed(s.mainNav), footer: keyed(s.footerNav) });

const p = seed.profile;
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
  // References to draft-only projects would be invalid, so featured projects are set in the Studio after verification.
});

const now = seed.nowPage;
docs.push({ _id: id("nowPage", now.verified), _type: "nowPage", updatedAt: now.updatedAt, intro: now.intro, items: keyed(now.items), verified: now.verified });

for (const c of seed.skillCategories) docs.push({ _id: c._id, _type: "skillCategory", title: c.title, slug: slug(c.slug), description: c.description, order: c.order });
for (const sk of seed.skills) {
  const cat = seed.skillCategories.find((c) => c.slug === sk.category)!;
  docs.push({ _id: id(sk._id, sk.verified), _type: "skill", name: sk.name, category: { _type: "reference", _ref: cat._id }, description: sk.description, order: sk.order, visible: sk.visible, verified: sk.verified });
}

for (const e of seed.experiences) {
  docs.push({
    _id: id(e._id, e.verified),
    _type: "experience",
    company: e.company,
    role: e.role,
    employmentType: e.employmentType,
    location: e.location,
    current: e.current ?? false,
    summary: e.summary,
    order: e.order,
    verificationNotes: e.verificationNotes,
    verified: e.verified,
  });
}
for (const e of seed.education) docs.push({ _id: id(e._id, e.verified), _type: "education", institution: e.institution, degree: e.degree, field: e.field, verified: e.verified });
for (const m of seed.metrics) docs.push({ _id: id(m._id, m.verified), _type: "achievement", value: m.value, suffix: m.suffix, label: m.label, explanation: m.explanation, context: m.context, verified: m.verified });

for (const pr of seed.projects) {
  docs.push({
    _id: id(pr._id, pr.verified),
    _type: "project",
    title: pr.title,
    slug: slug(pr.slug),
    summary: pr.summary,
    projectType: pr.projectType,
    featured: pr.featured,
    order: pr.order,
    accent: pr.accent,
    verificationTasks: pr.verificationTasks,
    verified: pr.verified,
  });
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
for (const cs of seed.caseStudies) {
  docs.push({
    _id: id(cs._id, cs.verified),
    _type: "caseStudy",
    title: cs.title,
    slug: slug(cs.slug),
    template: cs.template,
    excerpt: cs.excerpt,
    role: cs.role,
    team: cs.team,
    sections: cs.sections.map((sec) => ({ _type: "caseSection", ...sec, _key: key() })),
    verified: cs.verified,
  });
}

mkdirSync("seed", { recursive: true });
writeFileSync("seed/initial-content.ndjson", docs.map((d) => JSON.stringify(d)).join("\n") + "\n");
console.log(`Wrote ${docs.length} documents to seed/initial-content.ndjson (${docs.filter((d) => d._id.startsWith("drafts.")).length} as drafts).`);
