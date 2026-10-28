import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/content/types";

/** Latest writing as an index list: type-led, no thumbnails needed to be scannable. */
export function Writing({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;
  return (
    <section aria-labelledby="writing-title" className="section-y">
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_2fr]">
        <div>
          <h2 id="writing-title" className="display text-[length:var(--step-4)]">
            Thinking out loud
          </h2>
          <Link href="/blog" className="mt-6 inline-flex items-center gap-1 text-fg-2 hover:text-fg">
            All writing <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
        <ul className="grid">
          {posts.slice(0, 3).map((p, i) => (
            <Reveal as="li" key={p._id} delay={i * 80} className="border-t border-line last:border-b">
              <Link href={`/blog/${p.slug}`} className="group grid gap-2 py-7 md:grid-cols-[1fr_auto] md:items-baseline md:gap-8">
                <span>
                  <span className="flex flex-wrap items-center gap-3 text-sm text-fg-3">
                    <span>{p.category}</span>
                    <span>{p.readingMinutes} min read</span>
                    <VerificationBadge verified={p.verified} />
                  </span>
                  <span className="mt-2 block font-display text-[length:var(--step-2)] leading-tight tracking-[-0.01em] text-fg transition-colors group-hover:text-accent">{p.title}</span>
                  <span className="mt-2 block max-w-[60ch] text-fg-2">{p.excerpt}</span>
                </span>
                <time dateTime={p.publishedAt} className="text-sm text-fg-3">
                  {formatDate(p.publishedAt)}
                </time>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
