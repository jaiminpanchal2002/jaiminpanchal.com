# JAIMIN / BEYOND CODE

Cinematic, CMS-driven personal brand platform for **Jaimin Panchal**, AI Full Stack Developer / Project Manager (Ahmedabad, India).

> I build digital products. I think beyond code.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 App Router (Cache Components + Partial Prefetching), React 19, TypeScript strict |
| Styling | Tailwind CSS v4, semantic CSS tokens (`src/app/globals.css`), Archivo variable (expanded + normal widths), Radix primitives, Lucide icons |
| 3D | Three.js + React Three Fiber + drei (glass J/ monogram hero, optional Universe), lazy-loaded per route |
| Motion | GSAP + ScrollTrigger (scroll-scrubbed sequences), Motion for React (UI transitions), CSS (reveals, entrances), Lenis (opt-in) |
| CMS | Sanity Studio embedded at `/studio`, next-sanity, draft mode + Presentation tool |
| Forms | React Hook Form + Zod (shared client/server schema), Resend |
| Tests | Vitest (unit), Playwright + axe-core (E2E, accessibility) |

## Quick start

```bash
npm install
cp .env.example .env.local      # optional: works with no values at all
npm run dev                     # http://localhost:3000
```

With no Sanity project configured the site renders the typed local seed (`src/content/seed.ts`). Set `CONTENT_PREVIEW_UNVERIFIED=true` in `.env.local` to see draft records (marked **Needs verification**).

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run check` | typecheck + lint + unit tests |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright against `next start -p 3100` (build first) |
| `npm run seed:export` | Writes `seed/initial-content.ndjson` for `sanity dataset import` |

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md): art direction, design system, sitemap, components, motion system
- [DEPLOYMENT.md](DEPLOYMENT.md): Sanity setup, environment, Vercel, webhooks, contact delivery
- [CONTENT_CHECKLIST.md](CONTENT_CHECKLIST.md): what the owner must verify before launch
- [QA_RESULTS.md](QA_RESULTS.md): what was tested and the results
- [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md): honest list of gaps
