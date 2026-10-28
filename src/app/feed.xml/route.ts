import { getPosts, getSiteSettings } from "@/content/api";
import { absoluteUrl } from "@/lib/utils";

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);

/** RSS 2.0 feed of verified, published posts. */
export async function GET() {
  const [posts, settings] = await Promise.all([getPosts(), getSiteSettings()]);
  const items = posts
    .filter((p) => p.verified)
    .map(
      (p) => `<item>
  <title>${esc(p.title)}</title>
  <link>${absoluteUrl(`/blog/${p.slug}`)}</link>
  <guid isPermaLink="true">${absoluteUrl(`/blog/${p.slug}`)}</guid>
  <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
  <category>${esc(p.category)}</category>
  <description>${esc(p.excerpt)}</description>
</item>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(settings.siteName)} - Writing</title>
  <link>${absoluteUrl("/blog")}</link>
  <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml"/>
  <description>${esc(settings.description)}</description>
  <language>en</language>
${items}
</channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
