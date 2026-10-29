import { defineQuery } from "next-sanity";

// Projections map Sanity documents onto the shared types in src/content/types.ts.
const seo = `seo{title, description, noIndex, canonical, ogImage}`;
const image = `{..., asset->{_id, url, metadata{lqip, dimensions}}}`;

export const siteSettingsQuery = defineQuery(`*[_id == "siteSettings"][0]{
  siteName, tagline, description, url, defaultTheme, animationPreset, introEnabled,
  "mainNav": *[_id == "navigation"][0].main[]{label, href, visible},
  "footerNav": *[_id == "navigation"][0].footer[]{label, href, visible}
}`);

export const profileQuery = defineQuery(`*[_id == "personalProfile"][0]{
  name, title, headline, shortBio, bio, location, timezone, email, availability,
  "portrait": portrait${image},
  "resumeUrl": resume.asset->url,
  "socialLinks": coalesce(socialLinks[]->{platform, label, url}, []),
  "interests": coalesce(interests, []),
  "principles": coalesce(principles[]{title, body}, []),
  philosophy, currentFocus
}`);

export const homePageQuery = defineQuery(`*[_id == "homePage"][0]{
  heroKicker, heroGreeting, heroHeadline, heroSupporting, primaryCta, secondaryCta, heroVariant,
  storyHeadline, storyBeats[]{title, body}, processSteps[]{title, body},
  contactHeadline, collaborationInterests,
  sections[]{key, visible},
  "featuredProjectSlugs": featuredProjects[]->slug.current
}`);

const projectFields = `
  _id, title, "slug": slug.current, summary, "category": coalesce(category->title, "Unclassified"),
  projectType, year, startDate, endDate, "featured": coalesce(featured, false), "order": coalesce(order, 999),
  role, contribution, "technologies": coalesce(technologies, []), problem, "objectives": coalesce(objectives, []),
  solution, architecture, "features": coalesce(features, []), "challenges": coalesce(challenges[]{title, body}, []),
  "outcomes": coalesce(outcomes[]{label, value, verified}, []), lessons, body[]{..., _type == "image" => ${image}},
  "heroImage": heroImage${image}, "thumbnail": thumbnail${image}, "gallery": coalesce(gallery[]${image}, []), "videos": coalesce(videos[]{url, title}, []),
  demoUrl, repoUrl, accent, "verified": coalesce(verified, false), "verificationTasks": coalesce(verificationTasks, []), ${seo}
`;
export const projectsQuery = defineQuery(`*[_type == "project" && defined(slug.current)] | order(order asc, year desc){${projectFields}}`);

export const caseStudiesQuery = defineQuery(`*[_type == "caseStudy" && defined(slug.current)] | order(publishedAt desc){
  _id, title, "slug": slug.current, template, "projectSlug": project->slug.current, excerpt, publishedAt, role, team,
  "sections": coalesce(sections[]{_key, heading, kind, body}, []),
  "evidence": coalesce(evidence[]{label, value}, []), pullQuote, "coverImage": coverImage${image}, comparison{caption, "before": before${image}, "after": after${image}},
  "verified": coalesce(verified, false), ${seo}
}`);

export const postsQuery = defineQuery(`*[_type == "blogPost" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc){
  _id, title, "slug": slug.current, excerpt, "coverImage": coverImage${image},
  "category": coalesce(category->title, "General"), "tags": coalesce(tags[]->title, []),
  body[]{..., _type == "image" => ${image}}, publishedAt, updatedAt, "featured": coalesce(featured, false), canonicalUrl,
  "verified": coalesce(verified, false), ${seo}
}`);

export const experiencesQuery = defineQuery(`*[_type == "experience"] | order(order asc, startDate desc){
  _id, company, role, employmentType, location, startDate, endDate, current, summary,
  "responsibilities": coalesce(responsibilities, []), "achievements": coalesce(achievements, []),
  "technologies": coalesce(technologies, []), "projectSlugs": coalesce(projects[]->slug.current, []),
  "verified": coalesce(verified, false), verificationNotes, "order": coalesce(order, 999)
}`);

export const educationQuery = defineQuery(`*[_type == "education"] | order(endYear desc){
  _id, institution, degree, field, startYear, endYear, notes, "verified": coalesce(verified, false)
}`);

export const certificationsQuery = defineQuery(`*[_type == "certification"] | order(issued desc){
  _id, name, issuer, issued, url, "verified": coalesce(verified, false)
}`);

export const skillCategoriesQuery = defineQuery(`*[_type == "skillCategory"] | order(order asc){
  _id, title, "slug": slug.current, description, "order": coalesce(order, 999)
}`);

export const skillsQuery = defineQuery(`*[_type == "skill" && coalesce(visible, true)] | order(order asc){
  _id, name, "category": category->slug.current, description, proficiency,
  "projectSlugs": coalesce(projects[]->slug.current, []), "order": coalesce(order, 999),
  "visible": coalesce(visible, true), "verified": coalesce(verified, false)
}`);

export const metricsQuery = defineQuery(`*[_type == "achievement"] | order(order asc){
  _id, value, prefix, suffix, label, explanation, context, "verified": coalesce(verified, false)
}`);

export const servicesQuery = defineQuery(`*[_type == "service" && defined(slug.current)] | order(order asc){
  _id, title, "slug": slug.current, summary, description, "deliverables": coalesce(deliverables, []),
  "technologies": coalesce(technologies, []), "projectSlugs": coalesce(projects[]->slug.current, []),
  "order": coalesce(order, 999), ${seo}
}`);

export const nowPageQuery = defineQuery(`*[_id == "nowPage"][0]{
  "updatedAt": coalesce(updatedAt, _updatedAt), intro, "items": coalesce(items[]{label, body}, []), "verified": coalesce(verified, false)
}`);
