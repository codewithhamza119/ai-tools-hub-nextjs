# AI Tools HuB — Next.js Edition

Modern-technology rebuild of the **AI Tools HuB** storefront: premium digital shop for AI subscriptions, tools and services.

## Stack

- **Next.js 14** (App Router) + **TypeScript** (strict) + **Tailwind CSS v3**
- Fully static export (`output: 'export'`) — deploy anywhere (Vercel, Netlify, Cloudflare Pages, any static host)
- **Python FastAPI** backend scaffold in `backend/` for the AI assistant (LLM-powered chat)

## Run it

```bash
npm install
npm run dev      # local dev
npm run build    # static export → out/
```

## Backend (AI assistant)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # add GOOGLE_API_KEY or OPENAI_API_KEY
uvicorn main:app --reload
```

Set `NEXT_PUBLIC_CHAT_API_URL` in the frontend to point at the backend — otherwise the assistant uses its built-in knowledge base.

## What's inside

- 17 products, 4 categories, filters, price sorting, 4-per-row grid
- Product detail modals, cart drawer (localStorage), 3-step WhatsApp checkout
- Trilingual AI assistant (English / اردو / Roman Urdu), WhatsApp handoff
- English-by-default UI with one-tap Roman Urdu toggle
- Easypaisa / EasyPaisa IBAN / Binance (UID) payment details with copy buttons

> Design, catalog and content mirror the original AI Tools HuB site. See the original project backup for the full spec.
