import { describe, expect, it } from "vitest";
import { schemaTypes, singletonTypes } from "@/sanity/schemaTypes";
import { toEmbedUrl } from "@/components/content/RichText";

type Field = { name: string; type: string; validation?: unknown };
type Schema = { name: string; type: string; fields?: Field[] };
const all = schemaTypes as unknown as Schema[];
const byName = new Map(all.map((s) => [s.name, s]));

describe("CMS content model", () => {
  it("defines every required content type", () => {
    const required = [
      "siteSettings", "personalProfile", "homePage", "project", "projectCategory", "caseStudy", "blogPost", "blogCategory", "blogTag",
      "experience", "education", "certification", "skill", "skillCategory", "testimonial", "achievement", "navigation", "socialLink", "reusableCTA",
    ];
    for (const r of required) expect(byName.has(r), r).toBe(true);
  });

  it("has unique type names", () => {
    expect(new Set(all.map((s) => s.name)).size).toBe(all.length);
  });

  it("gives every routable document a required slug", () => {
    for (const t of ["project", "caseStudy", "blogPost"]) {
      const slug = byName.get(t)!.fields!.find((f) => f.name === "slug");
      expect(slug?.type, t).toBe("slug");
      expect(slug?.validation, t).toBeTruthy();
    }
  });

  it("gates factual documents behind a verification flag", () => {
    for (const t of ["project", "caseStudy", "blogPost", "experience", "education", "certification", "skill", "achievement", "testimonial"]) {
      expect(byName.get(t)!.fields!.some((f) => f.name === "verified"), t).toBe(true);
    }
  });

  it("never offers proficiency percentages", () => {
    const prof = byName.get("skill")!.fields!.find((f) => f.name === "proficiency") as Field & { options?: { list: string[] } };
    expect(prof.type).toBe("string");
    expect(prof.options?.list.some((v) => /%|\d/.test(v))).toBe(false);
  });

  it("does not allow raw HTML blocks in rich text", () => {
    const rich = byName.get("richText") as unknown as { of: { type: string; name?: string }[] };
    expect(rich.of.some((m) => /html|script/i.test(m.name ?? m.type))).toBe(false);
  });

  it("only assigns fields to groups (tabs) the type defines", () => {
    for (const t of all) {
      const groups = new Set(((t as unknown as { groups?: { name: string }[] }).groups ?? []).map((g) => g.name));
      for (const f of t.fields ?? []) {
        const g = (f as Field & { group?: string }).group;
        if (g) expect(groups.has(g), `${t.name}.${f.name} -> group "${g}"`).toBe(true);
      }
    }
  });

  it("registers singletons that exist as document types", () => {
    for (const s of singletonTypes) expect(byName.get(s)?.type).toBe("document");
  });
});

describe("embed allow-list", () => {
  it("converts approved sources to privacy-friendly embeds", () => {
    expect(toEmbedUrl("https://www.youtube.com/watch?v=abc123")).toBe("https://www.youtube-nocookie.com/embed/abc123");
    expect(toEmbedUrl("https://youtu.be/abc123")).toBe("https://www.youtube-nocookie.com/embed/abc123");
    expect(toEmbedUrl("https://vimeo.com/123456")).toBe("https://player.vimeo.com/video/123456");
  });
  it("rejects everything else", () => {
    expect(toEmbedUrl("https://evil.example/embed")).toBeNull();
    expect(toEmbedUrl("javascript:alert(1)")).toBeNull();
    expect(toEmbedUrl("https://vimeo.com/not-a-number")).toBeNull();
  });
});
