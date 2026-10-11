"""AI Tools HuB — chat backend (FastAPI).

Serves the on-site AI sales assistant. The assistant's product knowledge comes
from catalog.json; chat completion is done via the Gemini or OpenAI REST API.

Setup:
    python3 -m venv .venv && source .venv/bin/activate
    pip install -r requirements.txt
    cp .env.example .env        # then fill in an API key
    uvicorn main:app --reload --port 8000

Endpoints:
    POST /api/chat  -> { message, language, history } -> { reply }
    GET  /health    -> { ok: true }

Environment:
    GOOGLE_API_KEY  (preferred) — get one at https://aistudio.google.com
    OPENAI_API_KEY  (fallback)   — get one at https://platform.openai.com
"""

import json
import os
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent

# --------------------------------------------------------------------------
# Catalog
# --------------------------------------------------------------------------

with open(BASE_DIR / "catalog.json", encoding="utf-8") as _catalog_file:
    CATALOG: list[dict[str, Any]] = json.load(_catalog_file)

CATALOG_COMPACT: str = json.dumps(CATALOG, ensure_ascii=False, separators=(",", ":"))

# --------------------------------------------------------------------------
# System prompt
# --------------------------------------------------------------------------

SYSTEM_PROMPT: str = (
    "You are the AI Tools HuB sales assistant, a friendly chatbot on the "
    "AI Tools HuB website that sells premium AI, design, editing, VPN and "
    "learning subscriptions in Pakistan.\n\n"
    "Your product catalog (prices in Pakistani Rupees):\n"
    f"{CATALOG_COMPACT}\n\n"
    "Rules:\n"
    "1. Answer questions about products, prices, durations, warranties, "
    "activation steps and features using ONLY the catalog above. Never invent "
    "products, prices or warranty terms.\n"
    "2. Reply in the customer's requested language: 'en' = English, "
    "'ur' = Urdu written in Urdu script, 'roman-urdu' = Urdu written in "
    "Latin script (Roman Urdu).\n"
    "3. Behave like a helpful sales agent: greet warmly, answer concisely, "
    "suggest alternatives with prices when something is unavailable.\n"
    "4. If a customer asks about something you do not know (order status, "
    "warranty claims, product availability, or anything not in the catalog), "
    "say politely that their query has been forwarded to the team and ask "
    "them to wait for a reply. Offer WhatsApp 03493634347 for urgent help.\n"
    "5. Checkout info: customers pay via Easypaisa, Easypaisa IBAN or Binance, "
    "then share the payment screenshot on WhatsApp 03493634347. Products are "
    "delivered after payment confirmation. Warranty claims may take up to "
    "24 hours.\n"
    "6. Keep replies short (1-4 sentences) unless the customer asks for detail."
)

# --------------------------------------------------------------------------
# Models
# --------------------------------------------------------------------------


class ChatRequest(BaseModel):
    """Incoming chat turn from the website widget."""

    message: str = Field(..., description="The customer's latest message.")
    language: str = Field(
        default="en",
        description="Reply language: 'en', 'ur' or 'roman-urdu'.",
    )
    history: list[dict[str, str]] = Field(
        default_factory=list,
        description="Prior turns, each like {'role': 'user'|'assistant', 'content': '...'}.",
    )


class ChatReply(BaseModel):
    """Assistant's reply."""

    reply: str


# --------------------------------------------------------------------------
# App
# --------------------------------------------------------------------------

app = FastAPI(
    title="AI Tools HuB Chat Backend",
    description="Sales-assistant chat API for the AI Tools HuB website.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # NOTE: restrict to the storefront domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)


def _history_to_gemini_contents(history: list[dict[str, str]]) -> list[dict[str, Any]]:
    """Convert generic chat history into Gemini `contents` format."""
    contents: list[dict[str, Any]] = []
    for turn in history:
        role: str = turn.get("role", "user")
        # Gemini uses 'model' for assistant turns.
        gemini_role: str = "model" if role == "assistant" else "user"
        contents.append(
            {
                "role": gemini_role,
                "parts": [{"text": turn.get("content", "")}],
            }
        )
    return contents


async def _reply_via_gemini(api_key: str, request: ChatRequest) -> str:
    """Call the Gemini REST API and return the assistant text."""
    contents: list[dict[str, Any]] = _history_to_gemini_contents(request.history)
    contents.append({"role": "user", "parts": [{"text": request.message}]})
    body: dict[str, Any] = {
        "system_instruction": {
            "parts": [{"text": SYSTEM_PROMPT + f"\nRequested language: {request.language}"}]
        },
        "contents": contents,
    }
    url: str = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-2.0-flash:generateContent?key={api_key}"
    )
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response: httpx.Response = await client.post(url, json=body)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Gemini request failed: {exc}") from exc
    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"Gemini API error {response.status_code}: {response.text[:300]}",
        )
    try:
        data: dict[str, Any] = response.json()
        return str(data["candidates"][0]["content"]["parts"][0]["text"])
    except (KeyError, IndexError, TypeError) as exc:
        raise HTTPException(status_code=502, detail="Unexpected Gemini response shape.") from exc


def _history_to_openai_messages(history: list[dict[str, str]]) -> list[dict[str, str]]:
    """Convert generic chat history into OpenAI `messages` format."""
    messages: list[dict[str, str]] = []
    for turn in history:
        role: str = "assistant" if turn.get("role") == "assistant" else "user"
        messages.append({"role": role, "content": turn.get("content", "")})
    return messages


async def _reply_via_openai(api_key: str, request: ChatRequest) -> str:
    """Call the OpenAI chat-completions API and return the assistant text."""
    messages: list[dict[str, str]] = [
        {"role": "system", "content": SYSTEM_PROMPT + f"\nRequested language: {request.language}"}
    ]
    messages.extend(_history_to_openai_messages(request.history))
    messages.append({"role": "user", "content": request.message})
    body: dict[str, Any] = {"model": "gpt-4o-mini", "messages": messages}
    headers: dict[str, str] = {"Authorization": f"Bearer {api_key}"}
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response: httpx.Response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                json=body,
                headers=headers,
            )
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"OpenAI request failed: {exc}") from exc
    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"OpenAI API error {response.status_code}: {response.text[:300]}",
        )
    try:
        data: dict[str, Any] = response.json()
        return str(data["choices"][0]["message"]["content"])
    except (KeyError, IndexError, TypeError) as exc:
        raise HTTPException(status_code=502, detail="Unexpected OpenAI response shape.") from exc


# --------------------------------------------------------------------------
# Routes
# --------------------------------------------------------------------------


@app.get("/health")
async def health() -> dict[str, bool]:
    """Liveness probe."""
    return {"ok": True}


@app.post("/api/chat", response_model=ChatReply)
async def chat(request: ChatRequest) -> ChatReply:
    """Generate the sales assistant's reply for one customer message."""
    google_key: str | None = os.getenv("GOOGLE_API_KEY") or None
    openai_key: str | None = os.getenv("OPENAI_API_KEY") or None

    if google_key:
        reply: str = await _reply_via_gemini(google_key, request)
        return ChatReply(reply=reply)

    if openai_key:
        reply = await _reply_via_openai(openai_key, request)
        return ChatReply(reply=reply)

    raise HTTPException(
        status_code=503,
        detail="No LLM API key configured. Set GOOGLE_API_KEY or OPENAI_API_KEY.",
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000)
