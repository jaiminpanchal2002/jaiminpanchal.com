# Known limitations

1. **CMS content was imported from the resume and GitHub (Oct 2026).** Project screenshots, LinkedIn URL, portrait and resume PDF still need adding in the Studio. Re-running `npm run seed:push` overwrites Studio edits to the same documents.
2. **Soft 404 for unpublished detail URLs.** With Partial Prerendering, slugs not known at build time stream the 404 UI (with `noindex` and no content), but the HTTP status is 200. Published slugs and unknown top-level paths return proper statuses.
3. **Rate limiting is per server instance** (in memory). On serverless it is best-effort; use a shared store (e.g. Upstash Redis) for strict limits.
4. **No analytics dashboard.** No analytics provider was chosen, so "popular articles" and the analytics view are not implemented. Nothing fake is displayed. Vercel Web Analytics or Plausible can be added.
5. **Leads dashboard = Sanity Studio.** Submissions appear as Leads (status + private notes) in the Studio. There is no separate `/admin` app or CSV export.
6. **Scheduled posts** use `publishedAt <= now()` at query time. A future-dated post appears only after the next revalidation (hourly or on any publish). This is not a to-the-minute scheduler.
7. **Templates remain drafts.** The sample article and the two case-study templates are unpublished; replace them with real writing. Phone number is intentionally not published.
8. **Project covers are generated art** until real screenshots are uploaded.
9. **Poster still is dark-theme only.** Phones and no-WebGL visitors in light mode see the dark-glass still over the light page. A light-theme still can be rendered the same way (see QA_RESULTS.md).
10. **Rive/Lottie not used.** No illustrated motion assets exist yet; they were not added for their own sake.
11. **Performance targets are unvalidated** on real devices (see QA_RESULTS.md). Headless software WebGL is slow, so E2E runs with 3D set to Off (one test checks the live canvas).
12. **Animation presets:** the `animationPreset` setting (cinematic/calm) is stored in the CMS but only the cinematic preset is implemented. Users can still pick Reduced motion.
