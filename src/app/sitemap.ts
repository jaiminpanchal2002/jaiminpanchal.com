import type { MetadataRoute } from "next";
import { getCaseStudies, getPosts, getProjects } from "@/content/api";
import { absoluteUrl } from "@/lib/utils";

/** Only verified, published content is listed. Draft/unverified records are never indexed. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, studies, posts] = await Promise.all([getProjects(), getCaseStudies(), getPosts()]);
  const staticRoutes = ["/", "/about", "/experience", "/work", "/case-studies", "/skills", "/blog", "/now", "/contact", "/resume"].map((p) => ({
    url: absoluteUrl(p),
    changeFrequency: "monthly" as const,
    priority: p === "/" ? 1 : 0.7,
  }));
  return [
    ...staticRoutes,
    ...projects.filter((p) => p.verified && !p.seo?.noIndex).map((p) => ({ url: absoluteUrl(`/work/${p.slug}`), priority: 0.8 })),
    ...studies.filter((c) => c.verified && !c.seo?.noIndex).map((c) => ({ url: absoluteUrl(`/case-studies/${c.slug}`), lastModified: c.publishedAt, priority: 0.8 })),
    ...posts.filter((p) => p.verified && !p.seo?.noIndex).map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: p.updatedAt ?? p.publishedAt, priority: 0.6 })),
  ];
}
