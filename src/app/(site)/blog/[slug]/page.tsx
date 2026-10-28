import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { RichText, headingsOf } from "@/components/content/RichText";
import { TableOfContents } from "@/components/content/TableOfContents";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { getPost, getPosts, getProfile } from "@/content/api";
import { imageUrl } from "@/sanity/image";
import { articleJsonLd, breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl, formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "__none" }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) return { title: "Article not found", robots: { index: false } };
  return {
    ...pageMetadata({ title: p.title, description: p.excerpt, path: `/blog/${p.slug}`, seo: { ...p.seo, canonical: p.canonicalUrl ?? p.seo?.canonical }, type: "article", publishedTime: p.publishedAt, modifiedTime: p.updatedAt }),
    ...(p.verified ? {} : { robots: { index: false, follow: false } }),
  };
}

async function Article({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const { slug } = await params;
  const [post, all, profile] = await Promise.all([getPost(slug), getPosts(), getProfile()]);
  if (!post) notFound();
  const toc = headingsOf(post.body);
  const related = all.filter((p) => p._id !== post._id && (p.category === post.category || p.tags.some((t) => post.tags.includes(t)))).slice(0, 3);
  const cover = imageUrl(post.coverImage, 1800);
  const url = absoluteUrl(`/blog/${post.slug}`);

  return (
    <article>
      <ScrollProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(articleJsonLd(post, profile.name))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Writing", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]))} />
      <header className="container-site pt-32 md:pt-40">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-fg-2 hover:text-fg">
          <ArrowLeft className="size-4" aria-hidden /> All writing
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-fg-3">
          <span>{post.category}</span>
          <span>{post.readingMinutes} min read</span>
          <VerificationBadge verified={post.verified} />
        </div>
        <h1 className="display mt-4 max-w-[20ch] text-[length:var(--step-5)]">{post.title}</h1>
        <p className="mt-6 max-w-[60ch] text-[length:var(--step-1)] leading-snug text-fg-2">{post.excerpt}</p>
        <p className="mt-8 text-sm text-fg-3">
          By <Link href="/about" className="text-fg underline decoration-accent underline-offset-4 hover:text-accent">{profile.name}</Link>
          {" on "}
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.updatedAt && (
            <>
              {", updated "}
              <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
            </>
          )}
        </p>
        {cover && <Image src={cover} alt={post.coverImage?.alt ?? ""} width={1800} height={945} priority sizes="100vw" className="mt-12 rounded-[var(--radius-xl)] border border-line" />}
      </header>

      <div className="container-site grid gap-12 py-16 lg:grid-cols-[1fr_16rem] lg:gap-20">
        <RichText value={post.body} className="prose-jp min-w-0" />
        <aside className="no-print lg:sticky lg:top-28 lg:self-start">
          <TableOfContents items={toc} />
          <div className="mt-10 text-sm">
            <p className="font-medium text-fg">Share</p>
            <ul className="mt-3 grid gap-2 text-fg-2">
              <li>
                <a className="hover:text-fg" target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}>LinkedIn</a>
              </li>
              <li>
                <a className="hover:text-fg" target="_blank" rel="noopener noreferrer" href={`https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`}>X</a>
              </li>
            </ul>
          </div>
          {post.tags.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-2 text-xs text-fg-3" aria-label="Tags">
              {post.tags.map((t) => (
                <li key={t} className="rounded-full border border-line px-2.5 py-1">#{t}</li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      <footer className="container-site border-t border-line py-16">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-fg-2">
            Written by <span className="text-fg">{profile.name}</span>, {profile.title}.
          </p>
          <Link href="/contact" className="text-fg underline decoration-accent underline-offset-4">Let&apos;s connect</Link>
        </div>
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="display text-[length:var(--step-2)] text-fg">Related articles</h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {related.map((r) => (
                <li key={r._id}>
                  <Link href={`/blog/${r.slug}`} className="block h-full rounded-[var(--radius-lg)] border border-line p-5 hover:border-line-strong">
                    <span className="text-fg">{r.title}</span>
                    <span className="mt-2 block text-sm text-fg-3">{r.readingMinutes} min read</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </footer>
    </article>
  );
}

export default function PostPage(props: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<div className="container-site min-h-[100dvh] pt-40" aria-busy="true" />}>
      <Article params={props.params} />
    </Suspense>
  );
}
