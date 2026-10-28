import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/layout/PageHeader";
import { PostIndex } from "@/components/content/PostIndex";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { getPosts } from "@/content/api";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Writing",
  description: "Articles by Jaimin Panchal on backend architecture, Laravel, APIs, AI engineering, software delivery and product thinking.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p._id !== featured?._id);
  const summaries = rest.map(({ body: _body, seo: _seo, coverImage: _c, ...s }) => s);

  return (
    <>
      <PageHeader title="Writing" intro="Notes on building software: architecture, APIs, AI engineering, delivery and the product decisions in between." />
      <div className="container-site grid gap-16 pb-[var(--space-section)]">
        {!featured ? (
          <EmptyState title="The first articles are being written." body="Subscribe to the RSS feed to be notified when they are published.">
            <Link href="/feed.xml" className="text-fg underline decoration-accent underline-offset-4">
              RSS feed
            </Link>
          </EmptyState>
        ) : (
          <>
            <Link href={`/blog/${featured.slug}`} className="group relative grid gap-6 overflow-hidden rounded-[var(--radius-xl)] border border-line bg-bg-raised p-8 md:p-14">
              <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_22%,transparent),transparent)]" />
              <div className="flex flex-wrap items-center gap-3 text-sm text-fg-3">
                <span className="text-accent">Featured</span>
                <span>{featured.category}</span>
                <span>{featured.readingMinutes} min read</span>
                <time dateTime={featured.publishedAt}>{formatDate(featured.publishedAt)}</time>
                <VerificationBadge verified={featured.verified} />
              </div>
              <h2 className="relative max-w-[22ch] font-display text-[length:var(--step-4)] leading-[1.05] tracking-[-0.01em] text-fg transition-colors group-hover:text-accent">{featured.title}</h2>
              <p className="relative max-w-[60ch] text-[length:var(--step-1)] leading-snug text-fg-2">{featured.excerpt}</p>
              <span className="inline-flex items-center gap-1 text-fg">
                Read article <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
            {summaries.length > 0 && <PostIndex posts={summaries} />}
          </>
        )}
      </div>
    </>
  );
}
