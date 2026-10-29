import { defineArrayMember, defineField, defineType } from "sanity";
import { verifiedField } from "./shared";

const groups = [
  { name: "content", title: "Content", default: true },
  { name: "media", title: "Media" },
  { name: "seo", title: "SEO" },
  { name: "publishing", title: "Publishing" },
];

// Types with field groups pass "content"; simple taxonomy types have no groups.
const slugField = (group?: string) =>
  defineField({ name: "slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (r) => r.required(), ...(group ? { group } : {}) });

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups,
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required() }),
    slugField("content"),
    defineField({ name: "summary", type: "text", rows: 2, group: "content", validation: (r) => r.required().max(220) }),
    defineField({ name: "category", type: "reference", to: [{ type: "projectCategory" }], group: "content" }),
    defineField({ name: "projectType", type: "string", group: "content", options: { list: ["client", "product", "internal", "personal", "open-source"] }, initialValue: "product" }),
    defineField({ name: "year", type: "number", group: "content", validation: (r) => r.integer().min(2000).max(2100) }),
    defineField({ name: "startDate", type: "date", group: "content" }),
    defineField({
      name: "endDate",
      type: "date",
      group: "content",
      validation: (r) =>
        r.custom((end, ctx) => {
          const start = (ctx.document as { startDate?: string } | undefined)?.startDate;
          return !end || !start || end >= start ? true : "End date is before the start date";
        }),
    }),
    defineField({ name: "role", title: "Professional role", type: "string", group: "content" }),
    defineField({ name: "contribution", title: "Team contribution", type: "text", rows: 3, group: "content" }),
    defineField({ name: "technologies", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, group: "content" }),
    defineField({ name: "problem", title: "Problem solved", type: "text", rows: 4, group: "content" }),
    defineField({ name: "objectives", type: "array", of: [{ type: "string" }], group: "content" }),
    defineField({ name: "solution", type: "text", rows: 4, group: "content" }),
    defineField({ name: "architecture", title: "Architecture overview", type: "text", rows: 5, group: "content", description: "No confidential architecture details." }),
    defineField({ name: "features", title: "Features implemented", type: "array", of: [{ type: "string" }], group: "content" }),
    defineField({ name: "challenges", type: "array", group: "content", of: [defineArrayMember({ type: "object", name: "challenge", fields: [{ name: "title", type: "string" }, { name: "body", title: "Solution / trade-off", type: "text", rows: 3 }] })] }),
    defineField({ name: "outcomes", title: "Verified outcomes", type: "array", group: "content", of: [defineArrayMember({ type: "object", name: "outcome", fields: [{ name: "label", type: "string" }, { name: "value", type: "string" }, { name: "verified", type: "boolean", initialValue: false }] })] }),
    defineField({ name: "lessons", title: "Lessons learned", type: "text", rows: 3, group: "content" }),
    defineField({ name: "body", title: "Extended write-up", type: "richText", group: "content" }),
    defineField({ name: "heroImage", type: "accessibleImage", group: "media" }),
    defineField({ name: "thumbnail", type: "accessibleImage", group: "media" }),
    defineField({ name: "gallery", type: "array", of: [{ type: "accessibleImage" }], group: "media" }),
    defineField({
      name: "videos",
      type: "array",
      group: "media",
      description: "YouTube or Vimeo links. Videos are click-to-play, never autoplayed.",
      of: [defineArrayMember({ type: "object", name: "video", fields: [{ name: "url", type: "url" }, { name: "title", type: "string" }] })],
    }),
    defineField({ name: "accent", title: "Art direction accent", type: "string", group: "media", options: { list: ["blue", "cyan", "violet"], layout: "radio" }, initialValue: "blue" }),
    defineField({ name: "demoUrl", title: "Live demo URL", type: "url", group: "content" }),
    defineField({ name: "repoUrl", title: "Repository URL (public only)", type: "url", group: "content" }),
    defineField({ name: "featured", type: "boolean", initialValue: false, group: "publishing" }),
    defineField({ name: "order", type: "number", group: "publishing" }),
    defineField({ name: "verificationTasks", type: "array", of: [{ type: "string" }], group: "publishing", description: "Outstanding checks before this can be marked verified." }),
    verifiedField,
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  orderings: [{ title: "Manual order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", featured: "featured", verified: "verified", media: "thumbnail" },
    prepare: ({ title, featured, verified, media }) => ({ title, media, subtitle: [featured && "Featured", verified ? "Verified" : "Needs verification"].filter(Boolean).join(" · ") }),
  },
});

export const projectCategory = defineType({
  name: "projectCategory",
  title: "Project category",
  type: "document",
  fields: [defineField({ name: "title", type: "string", validation: (r) => r.required() }), slugField()],
});

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  groups,
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required() }),
    slugField("content"),
    defineField({ name: "template", type: "string", group: "content", options: { list: [{ title: "Engineering", value: "engineering" }, { title: "Product delivery", value: "product-delivery" }], layout: "radio" }, initialValue: "engineering" }),
    defineField({ name: "project", title: "Associated project", type: "reference", to: [{ type: "project" }], group: "content" }),
    defineField({ name: "excerpt", type: "text", rows: 2, group: "content", validation: (r) => r.required().max(240) }),
    defineField({ name: "publishedAt", type: "datetime", group: "publishing" }),
    defineField({ name: "role", type: "string", group: "content" }),
    defineField({ name: "team", title: "Team structure", type: "string", group: "content" }),
    defineField({
      name: "sections",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "caseSection",
          fields: [
            { name: "heading", type: "string", validation: (r) => r.required() },
            { name: "kind", type: "string", options: { list: ["context", "problem", "constraints", "discovery", "decisions", "implementation", "challenges", "alternatives", "tradeoffs", "outcome", "retrospective"] } },
            { name: "body", type: "richText" },
          ],
          preview: { select: { title: "heading", subtitle: "kind" } },
        }),
      ],
    }),
    defineField({ name: "evidence", title: "Quantitative evidence", type: "array", group: "content", of: [defineArrayMember({ type: "object", name: "evidenceItem", fields: [{ name: "label", type: "string" }, { name: "value", type: "string" }] })] }),
    defineField({ name: "pullQuote", type: "string", group: "content" }),
    defineField({
      name: "comparison",
      title: "Before / after comparison",
      type: "object",
      group: "media",
      fields: [
        { name: "before", type: "accessibleImage" },
        { name: "after", type: "accessibleImage" },
        { name: "caption", type: "string" },
      ],
    }),
    defineField({ name: "coverImage", type: "accessibleImage", group: "media" }),
    defineField({ name: "gallery", type: "array", of: [{ type: "accessibleImage" }], group: "media" }),
    verifiedField,
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "template", media: "coverImage" } },
});

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog post",
  type: "document",
  groups,
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required() }),
    slugField("content"),
    defineField({ name: "excerpt", type: "text", rows: 2, group: "content", validation: (r) => r.required().max(240) }),
    defineField({ name: "coverImage", type: "accessibleImage", group: "media" }),
    defineField({ name: "author", type: "reference", to: [{ type: "personalProfile" }], group: "content" }),
    defineField({ name: "category", type: "reference", to: [{ type: "blogCategory" }], group: "content" }),
    defineField({ name: "tags", type: "array", of: [{ type: "reference", to: [{ type: "blogTag" }] }], group: "content" }),
    defineField({ name: "body", type: "richText", group: "content" }),
    defineField({
      name: "publishedAt",
      title: "Publication date",
      type: "datetime",
      group: "publishing",
      description: "Posts dated in the future stay hidden until that time AND the site revalidates (hourly cache or a publish webhook). This is not a guaranteed-to-the-minute scheduler.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "updatedAt", title: "Updated date", type: "datetime", group: "publishing" }),
    defineField({ name: "featured", type: "boolean", initialValue: false, group: "publishing" }),
    defineField({ name: "canonicalUrl", type: "url", group: "seo" }),
    defineField({ ...verifiedField, title: "Approved by author", description: "Only approved posts appear on the live site." }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  orderings: [{ title: "Newest", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "publishedAt", media: "coverImage" } },
});

export const blogCategory = defineType({ name: "blogCategory", title: "Blog category", type: "document", fields: [defineField({ name: "title", type: "string", validation: (r) => r.required() }), slugField()] });
export const blogTag = defineType({ name: "blogTag", title: "Blog tag", type: "document", fields: [defineField({ name: "title", type: "string", validation: (r) => r.required() }), slugField()] });

export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  groups,
  fields: [
    defineField({ name: "company", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "role", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "employmentType", type: "string", group: "content", options: { list: ["full-time", "part-time", "contract", "freelance", "internship"] }, validation: (r) => r.required() }),
    defineField({ name: "location", type: "string", group: "content" }),
    defineField({ name: "startDate", type: "date", group: "content", options: { dateFormat: "MMM YYYY" } }),
    defineField({ name: "endDate", type: "date", group: "content", options: { dateFormat: "MMM YYYY" }, hidden: ({ document }) => Boolean(document?.current) }),
    defineField({ name: "current", title: "Current role", type: "boolean", initialValue: false, group: "content" }),
    defineField({ name: "summary", type: "text", rows: 3, group: "content" }),
    defineField({ name: "responsibilities", type: "array", of: [{ type: "string" }], group: "content" }),
    defineField({ name: "achievements", title: "Verified achievements", type: "array", of: [{ type: "string" }], group: "content" }),
    defineField({ name: "technologies", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, group: "content" }),
    defineField({ name: "projects", title: "Related projects", type: "array", of: [{ type: "reference", to: [{ type: "project" }] }], group: "content" }),
    defineField({ name: "order", type: "number", group: "publishing" }),
    defineField({ name: "verificationNotes", type: "text", rows: 2, group: "publishing" }),
    verifiedField,
  ],
  preview: { select: { title: "role", subtitle: "company" } },
});

export const education = defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    defineField({ name: "institution", type: "string", validation: (r) => r.required() }),
    defineField({ name: "degree", type: "string", validation: (r) => r.required() }),
    defineField({ name: "field", type: "string" }),
    defineField({ name: "startYear", type: "number" }),
    defineField({ name: "endYear", type: "number" }),
    defineField({ name: "notes", type: "text", rows: 2 }),
    defineField({ name: "verified", title: "Facts verified", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "degree", subtitle: "institution" } },
});

export const certification = defineType({
  name: "certification",
  title: "Certification",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "issuer", type: "string", validation: (r) => r.required() }),
    defineField({ name: "issued", title: "Issued (year or month)", type: "string", description: "For example 2026 or Mar 2026" }),
    defineField({ name: "url", title: "Credential URL", type: "url" }),
    defineField({ name: "verified", title: "Facts verified", type: "boolean", initialValue: false }),
  ],
});

export const skillCategory = defineType({
  name: "skillCategory",
  title: "Skill category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    slugField(),
    defineField({ name: "description", type: "string" }),
    defineField({ name: "order", type: "number" }),
  ],
});

export const skill = defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "category", type: "reference", to: [{ type: "skillCategory" }], validation: (r) => r.required() }),
    defineField({ name: "description", type: "string" }),
    defineField({ name: "proficiency", title: "Proficiency label (optional)", type: "string", description: "Words, never percentages.", options: { list: ["Working knowledge", "Proficient", "Advanced", "Expert"] } }),
    defineField({ name: "icon", type: "image" }),
    defineField({ name: "projects", title: "Associated projects", type: "array", of: [{ type: "reference", to: [{ type: "project" }] }] }),
    defineField({ name: "order", type: "number" }),
    defineField({ name: "visible", type: "boolean", initialValue: true }),
    defineField({ name: "verified", title: "Facts verified", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "name", subtitle: "category.title" } },
});

export const achievement = defineType({
  name: "achievement",
  title: "Metric / achievement",
  type: "document",
  fields: [
    defineField({ name: "value", type: "number", validation: (r) => r.required() }),
    defineField({ name: "prefix", type: "string" }),
    defineField({ name: "suffix", type: "string" }),
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "explanation", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({ name: "context", title: "Role or project this belongs to", type: "string", validation: (r) => r.required() }),
    defineField({ name: "order", type: "number" }),
    defineField({ name: "verified", title: "Facts verified", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "label", value: "value", suffix: "suffix" }, prepare: ({ title, value, suffix }) => ({ title, subtitle: `${value ?? ""}${suffix ?? ""}` }) },
});

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  groups,
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required() }),
    slugField("content"),
    defineField({ name: "summary", type: "text", rows: 2, group: "content", validation: (r) => r.required().max(200) }),
    defineField({ name: "description", type: "text", rows: 6, group: "content", validation: (r) => r.required() }),
    defineField({ name: "deliverables", title: "What is included", type: "array", of: [{ type: "string" }], group: "content" }),
    defineField({ name: "technologies", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, group: "content" }),
    defineField({ name: "projects", title: "Proof: related projects", type: "array", of: [{ type: "reference", to: [{ type: "project" }] }], group: "content" }),
    defineField({ name: "order", type: "number", group: "publishing" }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "summary" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  description: "Only add testimonials you have written permission to publish.",
  fields: [
    defineField({ name: "quote", type: "text", rows: 3, validation: (r) => r.required().max(280) }),
    defineField({ name: "author", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "company", type: "string" }),
    defineField({ name: "permissionConfirmed", type: "boolean", initialValue: false, validation: (r) => r.custom((v, ctx) => (ctx.document?.verified && !v ? "Confirm permission before verifying" : true)) }),
    defineField({ name: "verified", title: "Facts verified", type: "boolean", initialValue: false }),
  ],
});

export const socialLink = defineType({
  name: "socialLink",
  title: "Social link",
  type: "document",
  fields: [
    defineField({ name: "platform", type: "string", options: { list: ["github", "linkedin", "x", "email", "other"] }, validation: (r) => r.required() }),
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "url", type: "url", validation: (r) => r.required().uri({ scheme: ["https", "mailto"] }) }),
  ],
  preview: { select: { title: "label", subtitle: "url" } },
});

export const reusableCTA = defineType({
  name: "reusableCTA",
  title: "Reusable CTA",
  type: "document",
  fields: [defineField({ name: "name", type: "string" }), defineField({ name: "cta", type: "cta" })],
});

/** Contact form submissions. Stored under the private `leads.` id path and never queryable publicly. */
export const contactSubmission = defineType({
  name: "contactSubmission",
  title: "Lead",
  type: "document",
  readOnly: ({ currentUser }) => !currentUser,
  fields: [
    defineField({ name: "status", type: "string", options: { list: ["new", "in-progress", "replied", "archived", "spam"], layout: "radio" }, initialValue: "new" }),
    defineField({ name: "notes", title: "Private notes", type: "text", rows: 4 }),
    defineField({ name: "name", type: "string", readOnly: true }),
    defineField({ name: "email", type: "string", readOnly: true }),
    defineField({ name: "company", type: "string", readOnly: true }),
    defineField({ name: "inquiryType", type: "string", readOnly: true }),
    defineField({ name: "subject", type: "string", readOnly: true }),
    defineField({ name: "message", type: "text", readOnly: true }),
    defineField({ name: "submittedAt", type: "datetime", readOnly: true }),
  ],
  orderings: [{ title: "Newest", name: "submittedDesc", by: [{ field: "submittedAt", direction: "desc" }] }],
  preview: { select: { title: "subject", name: "name", status: "status" }, prepare: ({ title, name, status }) => ({ title, subtitle: `${name} · ${status}` }) },
});
