# Architecture & art direction

## Design read

Developer + product-lead portfolio for recruiters, founders and CTOs. Cinematic dark-tech language with editorial typography. Dials: **variance 8, motion 7, density 3**.

### Art direction: "Glass on Void" (redesign, 2026-10-28)

Directed by the owner's reference: near-black monochrome, ultra-wide extended display type, one glass object overlapping a giant wordmark, faint column rules, uppercase navigation. The execution is original: the object is the owner's own **J/ monogram** (the J plus the slash from JAIMIN / BEYOND CODE), not the reference's mark.

- **Hero:** `HELLO, I'M` and `BEYOND CODE` pinned to the outer column rules, the first name set full-width at 125% width, and the bevelled glass J/ (`GlassMonogram.tsx`) floating in front. The glass is lit only by procedural Lightformers (no HDR download) plus one Ice rim light. It refracts a dark field crossed by a light band, which gives the dark-interior, bright-edge look. Pointer tilt, scroll rotation and a one-time swing-in entrance.
- **One bold element:** everything else is quiet. Monochrome UI, white primary buttons, no glows on cards.
- **Column rules:** 4 hairlines on desktop, 2 on mobile (`.column-rules`), aligned to the content grid. Hero words, the statement block and section columns align to them.
- **Echoes of the mark:** an outlined J/ turns with scroll in the Story section; the same SVG path is the header logo and favicon (`monogram.ts` drives both 2D and 3D).
- **Fallbacks:** `public/monogram.png` is a transparent still rendered from the real scene. It is the poster while the 3D chunk loads, the visual on phones and on devices without WebGL, and what appears when a visitor sets 3D quality to Off.

### Design tokens (`src/app/globals.css`)

- **Colour:** Void `#0A0B0D`, Graphite `#131519`, Chalk `#ECEDEF` (text and primary actions), Ash `#8C929B` (secondary, 6:1), Line 7% Chalk (rules), Ice `#A8C8FF` (rim light and focus only). Light theme mirrors it (Chalk ground, ink text, Ice `#2C62C9`). Semantic variables only.
- **Type:** one family, Archivo variable, at two widths: `wdth 125` for display, headings, nav and buttons (`.display` is 800 weight uppercase), `wdth 100` for reading. Geist Mono only in code blocks. Fluid scale `--step--1` to `--step-6`.
- **Radius rule:** interactive = pill, panels = 20/28px, inputs = 10px.
- **Motion tokens:** `--ease-out cubic-bezier(.23,1,.32,1)`, `--ease-in-out cubic-bezier(.77,0,.175,1)`; press 140ms, UI 220ms, reveal 700ms.
- **z-index scale:** canvas 0, column rules 0, content 1–10, header 40, menu 50, intro 60, grain 70.

## Sitemap

```
/                     home (sections ordered + toggled from CMS)
/about  /experience  /skills  /now  /contact  /resume
/work  /work/[slug]
/case-studies  /case-studies/[slug]
/blog  /blog/[slug]   /feed.xml
/universe             optional 3D exploration (never the only path to content)
/studio               Sanity Studio (Sanity auth)
/api/contact  /api/revalidate  /api/draft-mode/{enable,disable}
/sitemap.xml  /robots.txt  /opengraph-image
```

## Rendering & data

- `src/content/api.ts` is the only data entry point. Each getter is `'use cache'` + `cacheLife('hours')` + `cacheTag(<sanity _type>)`. The Sanity webhook calls `revalidateTag(type)`.
- Sanity configured → GROQ (`src/sanity/queries.ts`); otherwise → seed. Draft Mode switches to the `drafts` perspective with a server-only token and enables Visual Editing.
- **Publishing gate:** every factual record has `verified`. Unverified records are filtered out unless previewing (`src/content/visibility.ts`), excluded from the sitemap and marked `noindex`.
- Dynamic routes read `params` inside `<Suspense>` (Cache Components requirement) and return a `__none` sentinel from `generateStaticParams` when nothing is published.

## Motion system (who owns what)

| Layer | Tool | Used for |
| --- | --- | --- |
| Entrances | CSS (`.rise`, `[data-reveal]`, `SplitHeading`) | Server-rendered text; visible without JS; one shared IntersectionObserver |
| Scroll scrubbing | GSAP ScrollTrigger (`useGSAP`, auto-cleanup) | Story beats + orbit, timeline progress, process signal. Pinning uses CSS `sticky`, not GSAP pin |
| UI transitions | Motion for React | Menu clip-path wipe, capability panel crossfade, project filter layout, universe panels, magnetic CTAs (motion values, no re-renders) |
| 3D | R3F `useFrame` | Hero + Universe. Paused off-screen / hidden tab |
| Smooth scroll | Lenis | Opt-in only, synced to the GSAP ticker |

Reduced motion: OS preference or the in-site setting (`html[data-motion]`) collapses CSS animation, disables GSAP/parallax/magnetic effects, skips the intro and freezes 3D motion.

## Adaptive quality

`ExperienceProvider` detects WebGL, device memory, CPU cores, save-data and coarse pointers → tier `none | low | high`. Users can override (Auto/Low/High/Off). High: MeshTransmissionMaterial refraction, DPR ≤ 1.75. Low: polished physical material (no extra render pass), DPR ≤ 1.25, desktop widths only. Phones, no-WebGL devices and the Off setting get the poster still. The live scene also waits until the intro cover is gone, so no GPU work happens behind it.

## Component map

- `layout/`: Header, FullScreenMenu (Radix Dialog), SettingsPanel (theme, motion, quality, smooth scroll, sound), Footer, PageHeader/EmptyState, ScrollProgress, ExperienceProvider, Providers, Wordmark
- `motion/`: Reveal, SplitHeading, MagneticButton, MetricCounter, SmoothScroll, AmbientSound
- `three/`: GlassMonogram, monogram (shared J/ geometry), HeroVisual (AdaptiveCanvas + poster), UniverseScene, UniverseExperience
- `home/`: Hero, Intro, Story, Timeline, SelectedWork, Process, Capabilities (index-style tab list), Impact, Writing, ContactFinale
- `content/`: RichText (Portable Text), CodeBlock (Shiki, server), CopyButton, TableOfContents, PostIndex, BeforeAfter
- `work/`: ProjectLibrary (search, filters, sort, grid/list), ProjectArt
- `contact/`: ContactForm

## CMS model (`src/sanity/schemaTypes`)

Singletons: `siteSettings`, `navigation`, `personalProfile`, `homePage`, `nowPage`.
Documents: `project`, `projectCategory`, `caseStudy`, `blogPost`, `blogCategory`, `blogTag`, `experience`, `education`, `certification`, `skill`, `skillCategory`, `achievement`, `testimonial`, `socialLink`, `reusableCTA`, `contactSubmission` (leads).
Objects: `seo`, `accessibleImage` (alt, caption, hotspot), `cta`, `richText` (no HTML block type; embeds limited to YouTube/Vimeo).

## Security

CSP + security headers (`next.config.ts`), server-only tokens, Origin check on the contact POST, Zod validation, honeypot + minimum fill time, rate limiting, HTML escaping in emails, JSON-LD escaping, protocol-checked links, embed allow-list, leads stored under a private Sanity id path, signed revalidation webhook, Studio protected by Sanity auth, `robots` blocks `/studio` and `/api`, previews never indexed.
