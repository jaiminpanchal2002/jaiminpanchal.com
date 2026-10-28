import { defineArrayMember, defineField, defineType } from "sanity";

/** Reusable "facts verified" switch. Unverified documents never render in production. */
export const verifiedField = defineField({
  name: "verified",
  title: "Facts verified",
  description: "Turn on only after every fact in this document has been confirmed. Unverified content stays hidden on the live site.",
  type: "boolean",
  initialValue: false,
  group: "publishing",
});

export const seoType = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.max(70).warning("Keep titles under 70 characters") }),
    defineField({ name: "description", type: "text", rows: 3, validation: (r) => r.max(170).warning("Keep descriptions under 170 characters") }),
    defineField({ name: "canonical", title: "Canonical URL", type: "url" }),
    defineField({ name: "noIndex", title: "Hide from search engines", type: "boolean", initialValue: false }),
    defineField({ name: "ogImage", title: "Social preview image", type: "image", description: "1200 × 630 recommended" }),
  ],
});

/** Image with required alt text, caption and hotspot (media focal point). */
export const accessibleImage = defineType({
  name: "accessibleImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({ name: "alt", title: "Alternative text", type: "string", description: "Describe the image for screen readers. Leave empty only for purely decorative images.", validation: (r) => r.max(180) }),
    defineField({ name: "caption", type: "string" }),
  ],
});

export const ctaType = defineType({
  name: "cta",
  title: "Call to action",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required().max(28).warning("Short labels fit on one line") }),
    defineField({ name: "href", title: "Destination", type: "string", description: "Internal path like /work, or a full https:// URL", validation: (r) => r.required().custom((v) => (!v || /^(\/|https:\/\/|mailto:)/.test(v) ? true : "Use /path, https:// or mailto:")) }),
  ],
});

/** Rich text used by projects, case studies and blog posts. No raw HTML or scripts are possible. */
export const richTextType = defineType({
  name: "richText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            type: "object",
            title: "Link",
            fields: [defineField({ name: "href", type: "url", validation: (r) => r.uri({ scheme: ["http", "https", "mailto"], allowRelative: true }) })],
          }),
        ],
      },
    }),
    defineArrayMember({ type: "accessibleImage" }),
    defineArrayMember({ type: "code", options: { withFilename: true } }),
    defineArrayMember({
      name: "callout",
      type: "object",
      fields: [
        defineField({ name: "tone", type: "string", options: { list: ["note", "tip", "warning"] }, initialValue: "note" }),
        defineField({ name: "text", type: "text", rows: 3, validation: (r) => r.required() }),
      ],
      preview: { select: { title: "text", subtitle: "tone" } },
    }),
    defineArrayMember({
      name: "videoEmbed",
      title: "Video embed",
      type: "object",
      description: "YouTube or Vimeo only (approved sources).",
      fields: [
        defineField({ name: "url", type: "url", validation: (r) => r.required().custom((v) => (!v || /^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//.test(v) ? true : "Only YouTube and Vimeo URLs are allowed")) }),
        defineField({ name: "title", type: "string", validation: (r) => r.required() }),
      ],
    }),
    defineArrayMember({
      name: "dataTable",
      title: "Table",
      type: "object",
      fields: [
        defineField({ name: "caption", type: "string" }),
        defineField({ name: "header", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "rows", type: "array", of: [{ type: "object", name: "row", fields: [{ name: "cells", type: "array", of: [{ type: "string" }] }] }] }),
      ],
    }),
  ],
});
