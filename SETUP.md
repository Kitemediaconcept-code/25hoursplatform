# 25 Hours Platform — Vercel + Supabase Setup Guide

This guide replaces the old Firebase setup. Follow every step in order.

---

## Step 1 — Create a Supabase Project

1. Go to **[https://supabase.com](https://supabase.com)** → Sign in / create a free account
2. Click **"New Project"**
3. Choose a name (e.g. `25hours-platform`), set a database password, pick the closest region
4. Wait ~2 minutes for the project to provision

---

## Step 2 — Run the Database Schema

1. In your Supabase project, click **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Paste the entire contents of **`supabase/schema.sql`** from this repo
4. Click **Run** (or press Ctrl+Enter)
5. You should see `Success. No rows returned.`

This creates the `courses` table with all required columns and RLS policies.

---

## Step 3 — Get Your API Credentials

1. In Supabase, go to **Project Settings → API** (gear icon in left sidebar)
2. Copy two values:
   - **Project URL** — looks like `https://abcdefghijk.supabase.co`
   - **anon / public key** — a long JWT string (starts with `eyJ...`)

---

## Step 4 — Add Credentials to the App

Open **`assets/js/supabase-config.js`** and replace the placeholder values:

```js
// Before:
const SUPABASE_URL      = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// After (example):
const SUPABASE_URL      = 'https://abcdefghijk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

> **Note:** The anon key is safe to commit to a public repo — Supabase Row Level Security controls what it can do. Never expose your `service_role` key.

---

## Step 5 — Deploy to Vercel

### Option A — Via GitHub (Recommended)

1. Push this repo to **GitHub**
2. Go to **[https://vercel.com](https://vercel.com)** → New Project → Import your GitHub repo
3. Vercel auto-detects the `vercel.json` — no build settings needed
4. Click **Deploy**

Your site will be live at `https://your-project.vercel.app` in ~30 seconds.

### Option B — Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## Step 6 — Connect a Custom Domain (Optional)

1. In Vercel dashboard → your project → **Settings → Domains**
2. Add your domain (e.g. `25hoursplatform.com`)
3. Update your DNS records as instructed by Vercel (usually an A record or CNAME)

---

## What Changed from Firebase

| | Firebase (old) | Vercel + Supabase (new) |
|---|---|---|
| **Hosting** | Firebase Hosting | Vercel |
| **Database** | Cloud Firestore | Supabase PostgreSQL |
| **Config file** | `firebase-config.js` | `supabase-config.js` |
| **Admin JS** | Firestore SDK (CDN) | Supabase JS Client (esm.sh CDN) |
| **Courses JS** | Firestore SDK (CDN) | Supabase JS Client (esm.sh CDN) |
| **Storage** | Firebase Storage (unused) | Removed |
| **Deleted files** | `firebase.json`, `.firebaserc`, `storage.rules`, `firebase-debug.log`, `.firebase/` | — |

---

## Troubleshooting

**Courses not loading?**
- Check browser console for errors
- Confirm `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correctly set in `supabase-config.js`
- Verify `schema.sql` was run successfully in Supabase SQL Editor
- Check Supabase → Table Editor → `courses` — the table should exist

**CORS errors?**
- Supabase allows all origins by default for the anon key — no CORS config needed

**Admin panel not saving?**
- Confirm the `"Admin can insert courses"` RLS policy exists in Supabase → Authentication → Policies
