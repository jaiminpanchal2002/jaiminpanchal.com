import { defineArrayMember, defineField, defineType } from "sanity";

const navItem = defineArrayMember({
  type: "object",
  name: "navItem",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "href", type: "string", validation: (r) => r.required() }),
    defineField({ name: "visible", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Global settings",
  type: "document",
  fields: [
    defineField({ name: "siteName", type: "string", initialValue: "JAIMIN / BEYOND CODE" }),
    defineField({ name: "tagline", type: "string" }),
    defineField({ name: "description", title: "Default meta description", type: "text", rows: 3 }),
    defineField({ name: "url", title: "Production URL", type: "url" }),
    defineField({ name: "favicon", type: "image" }),
    defineField({ name: "ogImage", title: "Default social preview image", type: "image" }),
    defineField({ name: "defaultTheme", type: "string", options: { list: ["dark", "light", "system"], layout: "radio" }, initialValue: "dark" }),
    defineField({ name: "animationPreset", type: "string", description: "Tested presets only.", options: { list: [{ title: "Cinematic", value: "cinematic" }, { title: "Calm", value: "calm" }], layout: "radio" }, initialValue: "cinematic" }),
    defineField({ name: "introEnabled", title: "Play intro sequence on first visit", type: "boolean", initialValue: true }),
  ],
  preview: { prepare: () => ({ title: "Global settings" }) },
});

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({ name: "main", title: "Main navigation", type: "array", of: [navItem], validation: (r) => r.max(6).warning("More than 6 items will not fit on one line") }),
    defineField({ name: "footer", title: "Footer navigation", type: "array", of: [navItem] }),
  ],
  preview: { prepare: () => ({ title: "Navigation" }) },
});

export const personalProfile = defineType({
  name: "personalProfile",
  title: "Personal profile",
  type: "document",
  groups: [{ name: "basics", default: true }, { name: "about" }, { name: "contact" }],
  fields: [
    defineField({ name: "name", type: "string", group: "basics", validation: (r) => r.required() }),
    defineField({ name: "title", title: "Professional title", type: "string", group: "basics", validation: (r) => r.required() }),
    defineField({ name: "headline", type: "string", group: "basics" }),
    defineField({ name: "shortBio", title: "Professional summary", type: "text", rows: 3, group: "basics" }),
    defineField({ name: "portrait", type: "accessibleImage", group: "basics", description: "A real photograph only. Do not use AI-generated portraits." }),
    defineField({ name: "bio", title: "Biography", type: "richText", group: "about" }),
    defineField({ name: "philosophy", title: "Engineering philosophy", type: "text", rows: 4, group: "about" }),
    defineField({ name: "currentFocus", type: "string", group: "about" }),
    defineField({ name: "interests", title: "Areas of interest", type: "array", of: [{ type: "string" }], group: "about", options: { layout: "tags" } }),
    defineField({
      name: "principles",
      title: "Working principles",
      type: "array",
      group: "about",
      of: [{ type: "object", name: "principle", fields: [{ name: "title", type: "string" }, { name: "body", type: "text", rows: 2 }] }],
    }),
    defineField({ name: "location", type: "string", group: "contact", initialValue: "Ahmedabad, Gujarat, India" }),
    defineField({ name: "timezone", type: "string", group: "contact", initialValue: "Asia/Kolkata" }),
    defineField({ name: "email", title: "Public email", type: "string", group: "contact", validation: (r) => r.email() }),
    defineField({ name: "availability", title: "Availability message", type: "string", group: "contact" }),
    defineField({ name: "socialLinks", type: "array", group: "contact", of: [{ type: "reference", to: [{ type: "socialLink" }] }] }),
    defineField({ name: "resume", title: "Resume (PDF)", type: "file", group: "contact", options: { accept: "application/pdf" } }),
  ],
  preview: { select: { title: "name", subtitle: "title", media: "portrait" } },
});

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  groups: [{ name: "hero", default: true }, { name: "story" }, { name: "sections" }, { name: "contact" }],
  fields: [
    defineField({ name: "heroKicker", type: "string", group: "hero" }),
    defineField({ name: "heroGreeting", type: "string", group: "hero" }),
    defineField({ name: "heroHeadline", type: "array", of: [{ type: "string" }], group: "hero", description: "One line per entry. Two lines recommended.", validation: (r) => r.max(3) }),
    defineField({ name: "heroSupporting", type: "text", rows: 2, group: "hero", validation: (r) => r.max(160).warning("Keep the hero subtext short") }),
    defineField({ name: "primaryCta", type: "cta", group: "hero" }),
    defineField({ name: "secondaryCta", type: "cta", group: "hero" }),
    defineField({ name: "heroVariant", title: "Hero artwork", type: "string", group: "hero", options: { list: [{ title: "Lattice (3D)", value: "lattice" }, { title: "Minimal", value: "minimal" }], layout: "radio" }, initialValue: "lattice" }),
    defineField({ name: "storyHeadline", type: "string", group: "story" }),
    defineField({ name: "storyBeats", type: "array", group: "story", of: [{ type: "object", name: "beat", fields: [{ name: "title", type: "string" }, { name: "body", type: "text", rows: 2 }] }] }),
    defineField({ name: "processSteps", title: "How I build", type: "array", group: "story", of: [{ type: "object", name: "step", fields: [{ name: "title", type: "string" }, { name: "body", type: "text", rows: 2 }] }] }),
    defineField({ name: "featuredProjects", type: "array", group: "sections", of: [{ type: "reference", to: [{ type: "project" }] }] }),
    defineField({
      name: "sections",
      title: "Section order and visibility",
      description: "Drag to reorder. Only these supported section types can be used.",
      type: "array",
      group: "sections",
      of: [
        {
          type: "object",
          name: "sectionToggle",
          fields: [
            { name: "key", type: "string", options: { list: ["story", "experience", "work", "process", "capabilities", "impact", "writing", "contact"] }, validation: (r) => r.required() },
            { name: "visible", type: "boolean", initialValue: true },
          ],
          preview: { select: { title: "key", visible: "visible" }, prepare: ({ title, visible }) => ({ title, subtitle: visible ? "Visible" : "Hidden" }) },
        },
      ],
    }),
    defineField({ name: "contactHeadline", type: "string", group: "contact" }),
    defineField({ name: "collaborationInterests", type: "array", of: [{ type: "string" }], group: "contact", options: { layout: "tags" } }),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});

export const nowPage = defineType({
  name: "nowPage",
  title: "Now page",
  type: "document",
  fields: [
    defineField({ name: "updatedAt", type: "date", validation: (r) => r.required() }),
    defineField({ name: "intro", type: "text", rows: 2 }),
    defineField({ name: "items", type: "array", of: [{ type: "object", name: "nowItem", fields: [{ name: "label", type: "string" }, { name: "body", type: "text", rows: 2 }] }] }),
    defineField({ name: "verified", title: "Facts verified", type: "boolean", initialValue: false }),
  ],
  preview: { prepare: () => ({ title: "Now page" }) },
});
