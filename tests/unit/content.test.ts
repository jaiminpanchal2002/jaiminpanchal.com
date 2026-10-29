import { describe, expect, it } from "vitest";
import { rateLimit, __resetRateLimit } from "@/lib/rate-limit";
import { isVisible, visibleOnly } from "@/content/visibility";
import { pt, ptToPlainText, readingMinutes, slugify } from "@/content/pt";
import { formatRange } from "@/lib/utils";
import { filterProjects } from "@/components/work/ProjectLibrary";
import * as seed from "@/content/seed";
import type { Project } from "@/content/types";

describe("publishing gate", () => {
  it("hides unverified records unless previewing", () => {
    const items = [{ id: 1, verified: true }, { id: 2, verified: false }];
    expect(visibleOnly(items, false).map((i) => i.id)).toEqual([1]);
    expect(visibleOnly(items, true).map((i) => i.id)).toEqual([1, 2]);
    expect(isVisible({ verified: false }, false)).toBe(false);
  });

  it("keeps templates unpublished and only publishes owner-sourced records", () => {
    // Templates are never real content.
    expect(seed.posts.every((p) => !p.verified)).toBe(true);
    expect(seed.caseStudies.every((c) => !c.verified)).toBe(true);
    // Every metric names the role or project it belongs to.
    expect(seed.metrics.every((m) => m.context.length > 0 && m.explanation.length > 0)).toBe(true);
  });

  it("only links to the owner's GitHub and real live URLs", () => {
    expect(seed.profile.socialLinks.map((s) => s.url)).toEqual(["https://github.com/jaiminpanchal2002"]);
    for (const p of seed.projects) {
      if (p.repoUrl) expect(p.repoUrl.startsWith("https://github.com/jaiminpanchal2002/"), p.slug).toBe(true);
    }
  });

  it("never publishes a phone number", () => {
    expect(JSON.stringify(seed)).not.toMatch(/99984|\+91/);
  });

  it("gives every project a unique slug and every experience a start date", () => {
    expect(new Set(seed.projects.map((p) => p.slug)).size).toBe(seed.projects.length);
    expect(seed.experiences.every((e) => /^\d{4}-\d{2}$/.test(e.startDate ?? ""))).toBe(true);
  });

  it("contains no em dashes in seeded copy (style rule)", () => {
    expect(JSON.stringify(seed)).not.toMatch(/[—–]/);
  });
});

describe("rate limiter", () => {
  it("allows up to the limit within the window then blocks, and resets after", () => {
    __resetRateLimit();
    const t = 1_000;
    for (let i = 0; i < 3; i++) expect(rateLimit("k", 3, 1000, t).ok).toBe(true);
    expect(rateLimit("k", 3, 1000, t + 10).ok).toBe(false);
    expect(rateLimit("k", 3, 1000, t + 1001).ok).toBe(true);
  });
});

describe("portable text helpers", () => {
  it("converts headings, bullets, code and callouts", () => {
    const blocks = pt("## Title\n\n- one\n\n```ts\nconst a = 1;\n```\n\n:::note\nHeads up\n:::");
    expect(blocks.map((b) => b._type)).toEqual(["block", "block", "code", "callout"]);
    expect(blocks[0].style).toBe("h2");
    expect(blocks[1].listItem).toBe("bullet");
    expect(ptToPlainText(blocks)).toContain("const a = 1;");
  });

  it("estimates reading time and slugifies", () => {
    expect(readingMinutes(pt("word ".repeat(460)))).toBe(2);
    expect(slugify("Hello, World! 2026")).toBe("hello-world-2026");
  });
});

describe("formatRange", () => {
  it("handles current roles, missing dates and full ranges", () => {
    expect(formatRange(undefined, undefined, true)).toBe("Current");
    expect(formatRange(undefined, undefined, false)).toBeNull();
    expect(formatRange("2022-03", undefined, true)).toBe("Mar 2022 - Present");
    expect(formatRange("2019-01", "2021-06")).toBe("Jan 2019 - Jun 2021");
  });
});

describe("filterProjects", () => {
  const mk = (o: Partial<Project>): Project => ({ ...seed.projects[0], ...o });
  const list = [
    mk({ _id: "a", title: "Beta", category: "Commerce", technologies: ["Laravel"], year: 2023, featured: false, order: 2, projectType: "client" }),
    mk({ _id: "b", title: "Alpha", category: "Analytics", technologies: ["Vue.js"], year: 2025, featured: true, order: 1, projectType: "product" }),
  ];
  const base = { query: "", category: "all", tech: "all", type: "all", year: "all", sort: "featured" as const };

  it("filters by category, tech, type, year and search", () => {
    expect(filterProjects(list, { ...base, category: "Commerce" }).map((p) => p._id)).toEqual(["a"]);
    expect(filterProjects(list, { ...base, tech: "Vue.js" }).map((p) => p._id)).toEqual(["b"]);
    expect(filterProjects(list, { ...base, type: "client" }).map((p) => p._id)).toEqual(["a"]);
    expect(filterProjects(list, { ...base, year: "2025" }).map((p) => p._id)).toEqual(["b"]);
    expect(filterProjects(list, { ...base, query: "laravel" }).map((p) => p._id)).toEqual(["a"]);
  });

  it("sorts featured-first, newest and alphabetically", () => {
    expect(filterProjects(list, base)[0]._id).toBe("b");
    expect(filterProjects(list, { ...base, sort: "newest" })[0]._id).toBe("b");
    expect(filterProjects(list, { ...base, sort: "az" }).map((p) => p.title)).toEqual(["Alpha", "Beta"]);
  });
});
