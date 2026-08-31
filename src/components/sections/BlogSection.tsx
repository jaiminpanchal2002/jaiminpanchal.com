import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { blogPosts } from "@/content/portfolio";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogSection() {
  return (
    <section
      id="blog"
      className="relative mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32 md:px-10"
    >
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6 sm:mb-20">
        <div>
          <FadeIn y={20}>
            <p className="eyebrow mb-5">{"// writing"}</p>
          </FadeIn>
          <FadeIn
            as="h2"
            y={30}
            className="hero-heading font-black uppercase leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
          >
            Blog
          </FadeIn>
        </div>
        <FadeIn y={20} delay={0.1}>
          <p className="max-w-xs font-mono text-sm text-white/40">
            Notes on AI engineering, full-stack architecture and creative dev.
          </p>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {blogPosts.map((post, i) => (
          <FadeIn key={post.title} delay={i * 0.08} y={30}>
            <a
              href={post.href}
              className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/25"
            >
              <div className="flex items-center justify-between font-mono text-xs text-white/40">
                <span className="rounded-full bg-white/5 px-2.5 py-1 text-[#C81FB4]">
                  {post.tag}
                </span>
                <span>{post.readingTime}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold leading-snug text-white transition-colors group-hover:text-[#C81FB4]">
                {post.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/50">
                {post.excerpt}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="font-mono text-xs text-white/40">
                  {formatDate(post.date)}
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                />
              </div>
            </a>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
