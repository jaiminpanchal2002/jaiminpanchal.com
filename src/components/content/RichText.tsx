import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { Info, Lightbulb, TriangleAlert } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { imageUrl } from "@/sanity/image";
import { slugify } from "@/content/pt";
import type { PortableTextBlock, SanityImage } from "@/content/types";

const textOf = (children: unknown): string =>
  Array.isArray(children) ? children.map(textOf).join("") : typeof children === "string" ? children : (children as { props?: { children?: unknown } })?.props ? textOf((children as { props: { children: unknown } }).props.children) : "";

const calloutIcon = { note: Info, tip: Lightbulb, warning: TriangleAlert } as const;

/**
 * Portable Text renderer. Structured content only: there is no HTML block type, so editors
 * can't inject markup or scripts. Links are protocol-checked; external links get rel=noopener.
 */
const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
    h3: ({ children }) => <h3 id={slugify(textOf(children))}>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? "";
      if (!/^(https?:|mailto:|\/|#)/.test(href)) return <>{children}</>;
      const external = /^https?:/.test(href);
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    },
  },
  types: {
    code: ({ value }) => <CodeBlock code={value.code ?? ""} language={value.language} filename={value.filename} />,
    callout: ({ value }) => {
      const tone = (value.tone ?? "note") as keyof typeof calloutIcon;
      const Icon = calloutIcon[tone] ?? Info;
      return (
        <aside className={`not-prose my-8 flex gap-3 rounded-[var(--radius-lg)] border p-5 text-[0.95rem] ${tone === "warning" ? "border-danger/40 bg-danger/5" : "border-line-strong bg-surface/60"}`}>
          <Icon className={`mt-0.5 size-5 shrink-0 ${tone === "warning" ? "text-danger" : "text-accent"}`} aria-hidden />
          <p className="text-fg">{value.text}</p>
        </aside>
      );
    },
    image: ({ value }) => <RichImage value={value} />,
    accessibleImage: ({ value }) => <RichImage value={value} />,
    videoEmbed: ({ value }) => {
      const embed = toEmbedUrl(value.url);
      if (!embed) return null;
      return (
        <figure className="not-prose my-8 overflow-hidden rounded-[var(--radius-lg)] border border-line">
          <iframe src={embed} title={value.title} loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen className="aspect-video w-full" />
        </figure>
      );
    },
    dataTable: ({ value }) => (
      <div className="my-8 overflow-x-auto">
        <table>
          {value.caption && <caption className="mb-2 text-left text-sm text-fg-3">{value.caption}</caption>}
          {value.header?.length > 0 && (
            <thead>
              <tr>
                {value.header.map((h: string) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {(value.rows ?? []).map((r: { _key: string; cells: string[] }) => (
              <tr key={r._key}>
                {r.cells.map((c, i) => (
                  <td key={i}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
};

function RichImage({ value }: { value: SanityImage }) {
  const src = imageUrl(value, 1600);
  if (!src) return null;
  const dim = value.asset?.metadata?.dimensions;
  return (
    <figure className="not-prose my-10">
      <Image src={src} alt={value.alt ?? ""} width={dim?.width ?? 1600} height={dim?.height ?? 900} sizes="(min-width: 1024px) 760px, 100vw" className="rounded-[var(--radius-lg)] border border-line" />
      {value.caption && <figcaption className="mt-3 text-sm text-fg-3">{value.caption}</figcaption>}
    </figure>
  );
}

/** Approved embed sources only (also enforced by the CSP frame-src). */
export function toEmbedUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.endsWith("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
    }
    if (u.hostname === "youtu.be") return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(u.pathname.slice(1))}`;
    if (u.hostname.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return /^\d+$/.test(id ?? "") ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {}
  return null;
}

export function RichText({ value, className = "prose-jp" }: { value?: PortableTextBlock[]; className?: string }) {
  if (!value?.length) return null;
  return (
    <div className={className}>
      <PortableText value={value as never} components={components} />
    </div>
  );
}

export function headingsOf(blocks: PortableTextBlock[] = []) {
  return blocks
    .filter((b) => b._type === "block" && (b.style === "h2" || b.style === "h3"))
    .map((b) => {
      const text = ((b.children as { text?: string }[]) ?? []).map((c) => c.text ?? "").join("");
      return { id: slugify(text), text, level: b.style === "h2" ? 2 : 3 };
    });
}
