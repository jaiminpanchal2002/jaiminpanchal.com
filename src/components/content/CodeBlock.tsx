import { cacheLife } from "next/cache";
import { codeToHtml } from "shiki";
import { CopyButton } from "./CopyButton";

const themes = { dark: "github-dark-default", light: "github-light-default" } as const;

/** Highlighting is pure for a given (code, language), so cache it (Shiki also reads the clock internally). */
async function highlight(code: string, language: string) {
  "use cache";
  cacheLife("max");
  try {
    return await codeToHtml(code, { lang: language, themes, defaultColor: false });
  } catch {
    return await codeToHtml(code, { lang: "text", themes, defaultColor: false });
  }
}

/**
 * Server-rendered syntax highlighting (zero client JS except the copy button).
 * Dual themes switch with the site theme via CSS variables (see globals.css).
 */
export async function CodeBlock({ code, language = "text", filename }: { code: string; language?: string; filename?: string }) {
  const html = await highlight(code, language);
  return (
    <figure className="not-prose group relative my-8 overflow-hidden rounded-[var(--radius-lg)] border border-line bg-bg-raised">
      <figcaption className="flex items-center justify-between border-b border-line px-4 py-2 text-xs text-fg-3">
        <span className="font-mono">{filename ?? language}</span>
        <CopyButton text={code} />
      </figcaption>
      {/* Shiki output is generated from plain text on the server; it escapes all content. */}
      <div className="overflow-x-auto p-4 font-mono text-[0.85rem] leading-relaxed [&_pre]:!bg-transparent" dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}
