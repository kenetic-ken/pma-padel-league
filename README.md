# PMA Tuesday Padel League

Season 1 website — built with Next.js 14, Tailwind CSS, and Vercel KV.

## Deploy to Vercel (Manual Steps)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import GitHub repo: `kenetic-ken/pma-padel-league`
3. In project settings → **Environment Variables**, add:
   - `ADMIN_PASSWORD` = `pmapadel2026`
4. After project is created, go to **Storage** tab → **Create Database** → **KV**
   - Link the KV database to your project
   - This auto-adds `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`
5. Redeploy if needed after linking KV

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home / hero |
| `/ladder` | Live standings |
| `/schedule` | Round schedule with scores |
| `/results` | Completed match results |
| `/rules` | League rules |
| `/admin` | Enter results (password protected) |

## Admin

Visit `/admin` and enter password: `pmapadel2026`

Use the admin panel to enter match results after each Tuesday session.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS + Google Fonts (Bebas Neue, Inter)
- **Data:** Vercel KV (Redis)
- **Deployment:** Vercel + GitHub

## Local Development

```bash
cp .env.local.example .env.local
# Fill in KV credentials from Vercel dashboard
npm run dev
```
