# Deploying to Vercel + Neon

Your app is production-ready. Follow these steps once — after that, every `git push` auto-deploys.

## 1. Push the code to GitHub

```bash
git init            # if not already a repo
git add .
git commit -m "Deploy: portfolio + Jaimin OS"
git branch -M main
git remote add origin https://github.com/jaiminpanchal2002/<your-repo>.git
git push -u origin main
```

`.env` and `public/uploads/` are gitignored — your secrets are never committed.

## 2. Create a free Postgres database (Neon)

1. Sign up at https://neon.tech and create a project (region close to you).
2. Copy the **pooled** connection string (looks like
   `postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require`).

## 3. Initialise the database (run once from your machine)

Put the Neon URL in your local `.env` as `DATABASE_URL`, then:

```bash
npm install
npm run db:push      # creates all tables in Neon
npm run db:seed      # loads your real content (profile, projects, skills, …)
```

Set `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` first — the seed creates that admin login.

## 4. Deploy on Vercel

1. Sign up at https://vercel.com and **Import** your GitHub repo (it auto-detects Next.js).
2. Add these **Environment Variables** (Settings → Environment Variables):

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | your Neon pooled URL |
   | `AUTH_SECRET` | run `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
   | `NEXT_PUBLIC_SITE_URL` | `https://jaiminpanchal.com` (or your vercel URL) |
   | `APIFY_API_TOKEN` | your Apify token (optional) |
   | `APIFY_JOBS_ACTOR` | `TrtlecxAsNRbKl1na` (optional) |
   | `AI_PROVIDER_API_KEY` | optional — enables AI-enhanced ATS |

3. Click **Deploy**.

## 5. Connect Blob storage (for admin image/PDF uploads)

In the Vercel project: **Storage → Create → Blob**, connect it to the project.
Vercel auto-injects `BLOB_READ_WRITE_TOKEN`. Redeploy. Uploads now persist.

## 6. (Optional) Custom domain

Vercel → Settings → Domains → add `jaiminpanchal.com` and point your DNS as shown.

## After going live

- Log in at `https://<your-site>/admin` and **change the admin password** (Profile / re-seed with a new one).
- Everything on the public site is editable from **Jaimin OS** — no code needed.

## Notes

- **Local dev now uses Postgres too.** Point `DATABASE_URL` at Neon (or a free Neon dev branch) and run `npm run dev`.
- **Apify Sync** runs a live scrape; on Vercel Hobby keep the limit ≤ ~20 (60s function cap). Pro allows up to 300s.
