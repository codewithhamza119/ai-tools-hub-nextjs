# AI Tools HuB — Chat Backend

FastAPI backend for the on-site AI sales-assistant chatbot. It serves the
product catalog from `catalog.json` and answers customer questions via the
Gemini or OpenAI API.

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# open .env and add ONE key: GOOGLE_API_KEY (free at https://aistudio.google.com)
# or OPENAI_API_KEY (at https://platform.openai.com)
```

## Run

```bash
source .venv/bin/activate   # if not already active
uvicorn main:app --reload --port 8000
```

The API is now at `http://localhost:8000`. Health check:

```bash
curl http://localhost:8000/health
# {"ok": true}
```

## Test the chat endpoint

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Gemini Pro ki price kya hai?", "language": "roman-urdu", "history": []}'
# {"reply": "..."}
```

`language` is one of `"en"`, `"ur"` (Urdu script), or `"roman-urdu"`.
`history` is an optional list of prior turns:
`[{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]`.

If no API key is set, `/api/chat` returns HTTP 503 with
`"No LLM API key configured. Set GOOGLE_API_KEY or OPENAI_API_KEY."`

## How the Next.js frontend connects

The chat widget POSTs each customer message to the backend. In the Next.js app,
set the base URL in the frontend environment (e.g. `.env.local`):

```
NEXT_PUBLIC_CHAT_API_URL=http://localhost:8000
```

Then have the widget POST to `${NEXT_PUBLIC_CHAT_API_URL}/api/chat` with the
JSON body above (`message`, `language`, `history`) and render the returned
`reply`. The widget sends `language` based on its language selector.

## Production notes

- **HTTPS:** deploy the backend behind HTTPS (e.g. on Render, Railway, or a
  VPS with a reverse proxy) and point `NEXT_PUBLIC_CHAT_API_URL` at the
  public URL.
- **CORS:** the scaffold allows `*` origins for local development. In
  production, restrict `allow_origins` in `main.py` to your storefront domain,
  e.g. `allow_origins=["https://your-shop.com"]`.
- **Secrets:** API keys live only in `.env`, never in code or Git. Never
  commit `.env`.
- **Model choice:** the backend prefers `GOOGLE_API_KEY` (Gemini 2.0 Flash)
  and falls back to `OPENAI_API_KEY` (`gpt-4o-mini`). Set whichever you have.
