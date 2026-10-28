# Known limitations

1. **CMS not connected yet.** No Sanity project id was available, so the Studio, draft preview, Presentation/Visual Editing and the revalidation webhook are implemented but untested against a live project. Until configured, the site renders the local seed. See DEPLOYMENT.md.
2. **Soft 404 for unpublished detail URLs.** With Partial Prerendering, slugs not known at build time stream the 404 UI (with `noindex` and no content), but the HTTP status is 200. Published slugs and unknown top-level paths return proper statuses.
3. **Rate limiting is per server instance** (in memory). On serverless it is best-effort; use a shared store (e.g. Upstash Redis) for strict limits.
4. **No analytics dashboard.** No analytics provider was chosen, so "popular articles" and the analytics view are not implemented. Nothing fake is displayed. Vercel Web Analytics or Plausible can be added.
5. **Leads dashboard = Sanity Studio.** Submissions appear as Leads (status + private notes) in the Studio. There is no separate `/admin` app or CSV export.
6. **Scheduled posts** use `publishedAt <= now()` at query time. A future-dated post appears only after the next revalidation (hourly or on any publish). This is not a to-the-minute scheduler.
7. **Content is mostly unverified by design.** Projects, metrics, case studies and the article are drafts or templates; see CONTENT_CHECKLIST.md. No portrait, email, socials or resume yet.
8. **Project covers are generated art** until real screenshots are uploaded.
9. **Poster still is dark-theme only.** Phones and no-WebGL visitors in light mode see the dark-glass still over the light page. A light-theme still can be rendered the same way (see QA_RESULTS.md).
10. **Rive/Lottie not used.** No illustrated motion assets exist yet; they were not added for their own sake.
11. **Performance targets are unvalidated** on real devices (see QA_RESULTS.md). Headless software WebGL is slow, so E2E runs with 3D set to Off (one test checks the live canvas).
12. **Animation presets:** the `animationPreset` setting (cinematic/calm) is stored in the CMS but only the cinematic preset is implemented. Users can still pick Reduced motion.
