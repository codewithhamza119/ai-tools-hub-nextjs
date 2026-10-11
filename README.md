# AI Tools HuB — Next.js Edition

Modern-technology rebuild of the **AI Tools HuB** storefront: premium digital shop for AI subscriptions, tools and services.

## Stack

- **Next.js 14** (App Router) + **TypeScript** (strict) + **Tailwind CSS v3**
- **Turso (libsql) + Drizzle ORM** — serverless database for the product catalog
- Dynamic rendering — the catalog is read from the database on every visit
- Password-gated **admin panel** at `/admin` (edit prices, stock, warranty, add/delete products — changes go live instantly)
- SEO: metadata + Open Graph, `sitemap.xml`, `robots.txt`, JSON-LD product schema
- **Python FastAPI** backend scaffold in `backend/` for the AI assistant (LLM-powered chat)

## Run it locally (no database needed)

```bash
npm install
npm run dev      # local dev — uses the built-in seed catalog
npm run build    # production build (works without env vars)
```

Without `TURSO_DATABASE_URL` the site automatically falls back to the embedded seed catalog (`lib/seed-catalog.ts`), so the build never fails.

## Deploy on your own domain (dynamic site + Google)

### 1. Create the free Turso database

1. Sign up at https://turso.tech and install the CLI (`curl -sSfL https://get.tur.so/install.sh | bash`)
2. `turso db create ai-tools-hub` (pick the closest region, e.g. `sin` Singapore)
3. `turso db show ai-tools-hub --url` → copy the `libsql://...` URL
4. `turso db tokens create ai-tools-hub` → copy the token

### 2. Seed the catalog

```bash
cp .env.example .env
# fill in TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env
npx tsx scripts/seed.ts
```

You should see `Done. products table now has 16 rows.` Re-run any time to reset the catalog.

### 3. Deploy on Vercel

1. Push this repo to GitHub, then **Import Project** in Vercel (framework preset: Next.js)
2. In Vercel → Project → Settings → Environment Variables, add:
   - `TURSO_DATABASE_URL` = the `libsql://...` URL
   - `TURSO_AUTH_TOKEN` = the token
   - `ADMIN_PASSWORD` = a strong password for `/admin`
   - `NEXT_PUBLIC_SITE_URL` = your public domain, e.g. `https://aitoolshub.pk`
3. Deploy. The site reads the live catalog from Turso on every visit.

### 4. Manage products

- Open `https://your-domain/admin`, log in with `ADMIN_PASSWORD`
- Edit price, regular price, stock, warranty, duration, out-of-stock toggle, notes — or add/delete products
- Every save updates the storefront **instantly** (no rebuild needed)

### 5. Google Search

- `https://your-domain/sitemap.xml` and `/robots.txt` are generated automatically
- Submit the domain in **Google Search Console** and request indexing
- Share the link on WhatsApp — the Open Graph preview (logo + description) is built in

## What's inside

- 16 products, 4 categories, filter pills, 4-per-row grid
- Product detail modals, cart drawer (localStorage), 3-step WhatsApp checkout
- Stock counts, Out of Stock state, "Price on request" products with WhatsApp CTA
- Trilingual AI assistant (English / اردو / Roman Urdu), WhatsApp handoff
- English-by-default UI with one-tap Roman Urdu toggle
- Easypaisa / EasyPaisa IBAN / Binance (UID) payment details with copy buttons

## Backend (AI assistant)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # add GOOGLE_API_KEY or OPENAI_API_KEY
uvicorn main:app --reload
```

Set `NEXT_PUBLIC_CHAT_API_URL` in the frontend to point at the backend — otherwise the assistant uses its built-in knowledge base.

> Design, catalog and content mirror the original AI Tools HuB site. The catalog source of truth is now the Turso database, seeded from `lib/seed-catalog.ts`.
