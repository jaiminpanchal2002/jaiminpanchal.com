"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { cn, formatDate } from "@/lib/utils";

export type PostSummary = { _id: string; slug: string; title: string; excerpt: string; category: string; tags: string[]; publishedAt: string; readingMinutes: number; featured: boolean; verified: boolean };

const PAGE = 8;

export function PostIndex({ posts }: { posts: PostSummary[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [tag, setTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const categories = useMemo(() => ["All", ...new Set(posts.map((p) => p.category))], [posts]);
  const tags = useMemo(() => [...new Set(posts.flatMap((p) => p.tags))].sort(), [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (!tag || p.tags.includes(tag)) &&
        (!q || `${p.title} ${p.excerpt} ${p.tags.join(" ")}`.toLowerCase().includes(q)),
    );
  }, [posts, query, category, tag]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const shown = filtered.slice((page - 1) * PAGE, page * PAGE);
  const reset = () => setPage(1);

  return (
    <div className="grid gap-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => {
                setCategory(c);
                reset();
              }}
              className={cn("pressable rounded-full border px-4 py-2 text-sm", category === c ? "border-accent bg-accent text-accent-contrast" : "border-line-strong text-fg-2 hover:text-fg")}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="relative block md:w-72">
          <span className="sr-only">Search articles</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-fg-3" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              reset();
            }}
            placeholder="Search articles"
            className="h-10 w-full rounded-full border border-line-strong bg-bg pl-10 pr-4 text-sm text-fg focus:border-accent focus:outline-none"
          />
        </label>
      </div>
      {tags.length > 0 && (
        <div role="group" aria-label="Tags" className="flex flex-wrap gap-2 text-sm">
          {tags.map((t) => (
            <button key={t} type="button" aria-pressed={tag === t} onClick={() => { setTag(tag === t ? null : t); reset(); }} className={cn("rounded-full px-3 py-1", tag === t ? "bg-surface text-fg ring-1 ring-accent" : "text-fg-3 hover:text-fg")}>
              #{t}
            </button>
          ))}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {filtered.length} articles
      </p>
      {shown.length === 0 ? (
        <p className="py-16 text-center text-fg-2">No articles match.</p>
      ) : (
        <ul>
          {shown.map((p) => (
            <li key={p._id} className="border-t border-line last:border-b">
              <Link href={`/blog/${p.slug}`} className="group grid gap-2 py-8 md:grid-cols-[10rem_1fr] md:gap-10">
                <time dateTime={p.publishedAt} className="text-sm text-fg-3">
                  {formatDate(p.publishedAt)}
                </time>
                <span>
                  <span className="flex flex-wrap items-center gap-3 text-sm text-fg-3">
                    <span>{p.category}</span>
                    <span>{p.readingMinutes} min read</span>
                    <VerificationBadge verified={p.verified} />
                  </span>
                  <span className="mt-2 block font-display text-[length:var(--step-2)] leading-tight tracking-[-0.01em] text-fg transition-colors group-hover:text-accent">{p.title}</span>
                  <span className="mt-2 block max-w-[64ch] text-fg-2">{p.excerpt}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="flex items-center justify-between text-sm">
          <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-full border border-line-strong px-4 py-2 disabled:opacity-40">
            Previous
          </button>
          <span className="text-fg-3">
            Page {page} of {pages}
          </span>
          <button type="button" disabled={page === pages} onClick={() => setPage(page + 1)} className="rounded-full border border-line-strong px-4 py-2 disabled:opacity-40">
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
