# Deployment guide

## 1. Create the Sanity project

```bash
npx sanity@latest login
npx sanity@latest projects create "Jaimin Beyond Code"   # note the project id
```

In [sanity.io/manage](https://sanity.io/manage) for that project:

1. **API → CORS origins:** add `http://localhost:3000` and your production URL, with *Allow credentials* on (required for the embedded Studio).
2. **API → Tokens:** create a **Viewer** token → `SANITY_API_READ_TOKEN`, and an **Editor** token → `SANITY_API_WRITE_TOKEN` (used only to store contact leads).
3. **Members:** invite only the people who should edit content. This is the admin access control for `/studio`.

## 2. Import the seed content

```bash
npm run seed:export
npx sanity dataset import seed/initial-content.ndjson production --missing
```

Verified facts import as published; everything unverified imports as **drafts** and stays private until reviewed. Then work through [CONTENT_CHECKLIST.md](CONTENT_CHECKLIST.md).

## 3. Environment variables

Copy `.env.example`. In Vercel, add them under Project → Settings → Environment Variables. Keep `CONTENT_PREVIEW_UNVERIFIED=false` in Production. Only `NEXT_PUBLIC_*` values reach the browser.

## 4. Contact delivery (Resend)

1. Create a Resend account, verify your sending domain.
2. Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.
3. With `SANITY_API_WRITE_TOKEN` set, every submission is also stored as a **Lead** in the Studio (status + private notes).

If neither Resend nor Sanity storage is configured, production returns a clear "temporarily unavailable" error rather than pretending to deliver.

## 5. Deploy to Vercel

```bash
npm i -g vercel
vercel link
vercel --prod
```

Build command `next build`, output auto-detected. Node 20.9+.

## 6. On-demand revalidation

sanity.io/manage → API → **Webhooks** → Create:

- URL: `https://<your-domain>/api/revalidate`
- Trigger on: create, update, delete
- Projection: `{_type}`
- Secret: same value as `SANITY_REVALIDATE_SECRET`

Without the webhook, content still refreshes within the hourly cache window.

## 7. Preview / Presentation

Open `/studio` → **Presentation**. It enables Draft Mode through `/api/draft-mode/enable` (secret validated by next-sanity) so editors see drafts with click-to-edit overlays. "Exit preview" appears bottom-left.

## 8. Post-deploy verification

- [ ] `/studio` loads and only invited users can sign in
- [ ] Publish a change → visible on the site after webhook (or within an hour)
- [ ] Submit the contact form → email arrives, Lead appears in the Studio
- [ ] `/sitemap.xml` lists only verified content, `/robots.txt` points to it
- [ ] Run Lighthouse on `/` (mobile + desktop) against real devices
- [ ] Share a URL on LinkedIn/X to check the social card
