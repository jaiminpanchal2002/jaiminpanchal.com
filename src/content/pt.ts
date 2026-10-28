import type { PortableTextBlock } from "./types";

let keySeed = 0;
const key = () => `k${(keySeed++).toString(36)}`;

function spans(text: string) {
  // Supports **bold** and `code` inline marks, which is all the seed needs.
  const out: { _type: "span"; _key: string; text: string; marks: string[] }[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index! > last) out.push({ _type: "span", _key: key(), text: text.slice(last, m.index), marks: [] });
    const tok = m[0];
    if (tok.startsWith("**")) out.push({ _type: "span", _key: key(), text: tok.slice(2, -2), marks: ["strong"] });
    else out.push({ _type: "span", _key: key(), text: tok.slice(1, -1), marks: ["code"] });
    last = m.index! + tok.length;
  }
  if (last < text.length) out.push({ _type: "span", _key: key(), text: text.slice(last), marks: [] });
  return out;
}

/**
 * Tiny markdown-ish → Portable Text converter used only for local seed content.
 * Supports: ## h2, ### h3, > quote, - bullets, ```lang code fences, :::note callouts.
 */
export function pt(src: string): PortableTextBlock[] {
  const blocks: PortableTextBlock[] = [];
  const lines = src.trim().split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (line.startsWith("```")) {
      const language = line.slice(3).trim() || "text";
      const body: string[] = [];
      while (++i < lines.length && !lines[i].startsWith("```")) body.push(lines[i]);
      blocks.push({ _type: "code", _key: key(), language, code: body.join("\n") });
      continue;
    }
    if (line.startsWith(":::")) {
      const tone = line.slice(3).trim() || "note";
      const body: string[] = [];
      while (++i < lines.length && !lines[i].startsWith(":::")) body.push(lines[i]);
      blocks.push({ _type: "callout", _key: key(), tone, text: body.join(" ") });
      continue;
    }
    const style = line.startsWith("### ") ? "h3" : line.startsWith("## ") ? "h2" : line.startsWith("> ") ? "blockquote" : "normal";
    if (line.startsWith("- ")) {
      blocks.push({ _type: "block", _key: key(), style: "normal", listItem: "bullet", level: 1, markDefs: [], children: spans(line.slice(2)) });
      continue;
    }
    const text = line.replace(/^(### |## |> )/, "");
    blocks.push({ _type: "block", _key: key(), style, markDefs: [], children: spans(text) });
  }
  return blocks;
}

export function ptToPlainText(blocks: PortableTextBlock[] = []): string {
  return blocks
    .map((b) => {
      if (b._type === "block" && Array.isArray(b.children)) return (b.children as { text?: string }[]).map((c) => c.text ?? "").join("");
      if (b._type === "code") return String(b.code ?? "");
      if (b._type === "callout") return String(b.text ?? "");
      return "";
    })
    .join("\n\n");
}

export function readingMinutes(blocks: PortableTextBlock[] = []): number {
  const words = ptToPlainText(blocks).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
