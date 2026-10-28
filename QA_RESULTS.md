# QA results

Run on 2026-10-28, Windows 11, Node 24.15, Next.js 16.4.3. Everything listed as passing was actually executed.

## Static checks
| Check | Result |
| --- | --- |
| `tsc --noEmit` (strict) | Pass |
| `eslint src` | Pass (0 errors, 0 warnings) |
| `next build` (production) | Pass, 30 routes (36 with preview content) |

## Unit tests (Vitest): 34 / 34 passed
- Contact schema: valid input, each invalid field, honeypot, length caps
- Contact API route: CSRF origin rejection (403), field errors (422), silent bot drop, dev acceptance, **production refuses (503) when no delivery is configured**, rate limiting (429 + Retry-After)
- Publishing gate: unverified hidden unless previewing; all seeded projects/metrics/templates unverified; no guessed email, socials, demo or repo links; no em dashes in copy
- Rate limiter window behaviour, Portable Text helpers, reading time, slugify, date ranges (caught and fixed a real bug)
- Project filtering and sorting
- CMS schemas: required types exist, unique names, required slugs, verification flags, no percentage proficiency, no raw HTML blocks, singleton integrity
- Embed allow-list (YouTube/Vimeo only; rejects `javascript:` and others)

## End-to-end (Playwright, desktop 1440×900 + Pixel 7): 67 / 67 passed
- Every public route: 200, exactly one `h1`, title, meta description, no page errors
- 404 page for unknown routes
- Project, article (copy button, JSON-LD) and case study (TOC) templates
- Full-screen menu: all destinations, Escape closes, browser back/forward
- Skip link focus
- Contact: inline validation and `aria-invalid`; server response handled without false success
- Theme toggle persists; Reduced-motion setting applied
- Intro: plays once, Skip works, no replay in session; never plays under reduced motion
- No horizontal overflow on key pages (desktop + mobile)
- axe-core WCAG 2.0/2.1/2.2 A+AA: no serious/critical violations on home, about, contact, article (two real issues were found and fixed)
- Content readable with JavaScript disabled
- Sitemap, robots, RSS content type; unverified pages `noindex`; security headers present
- Hero WebGL canvas mounts on desktop at high quality

## Production gating check (build with `CONTENT_PREVIEW_UNVERIFIED=false`)
- Home contains no draft project names, metrics or "Needs verification" badges
- `/work` shows the empty state; sitemap lists only static pages
- Draft detail URLs render the 404 UI with `noindex` and no draft content (status code caveat in KNOWN_LIMITATIONS.md)

## Manual visual review
Reviewed screenshots of hero (dark + light), intro, story, journey, selected work, process, capabilities, contact, work library, article, universe (desktop) and hero/header (mobile). Fixed: fluid type utility bug, split-heading spacing, hero headline wrap, sticky story header overlap, wipe reveal never triggering, mobile header overflow, orbit labels overflowing on phones.

## Redesign pass (Glass on Void)
Re-ran everything after the visual redesign: typecheck and lint clean, production build passes, 34/34 unit tests, 67/67 E2E tests (desktop + mobile, including axe checks). Reviewed screenshots of hero (dark, light, mobile), story, selected work, capabilities and contact. Fixed during the pass: glass too opaque, then too milky (lighting and refraction backdrop retuned), monogram overlapping the statement, top line wrapping on phones, phones rendering live 3D on the low tier, hero 3D rendering behind the intro cover. E2E now runs with 3D quality Off (a new user setting); one dedicated test checks the live WebGL canvas.

## Not yet done (needs real infrastructure or devices)
- Lighthouse / Core Web Vitals on real mobile hardware and production hosting
- Sanity Studio editing, publish/unpublish, draft preview and webhook against a real Sanity project (no project id available here)
- Real email delivery through Resend
- Screen-reader walkthroughs (NVDA/VoiceOver) and Safari/Firefox testing
