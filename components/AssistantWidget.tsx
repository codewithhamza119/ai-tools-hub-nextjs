'use client';

import { useEffect, useRef, useState } from 'react';
import { answerLocal, detectLanguage, type BotReply, type ChatLang } from '../lib/assistant';
import { WHATSAPP_LINK } from '../lib/products';

interface Msg {
  id: number;
  from: 'user' | 'bot';
  text: string;
  handoff: boolean;
}

const LANG_LABEL: Record<ChatLang, string> = {
  en: 'English',
  ur: 'اردو',
  roman: 'Roman Urdu',
};

const LANGS: ChatLang[] = ['en', 'ur', 'roman'];

const SUGGESTIONS = [
  'What are your product prices?',
  'How do I order?',
  'What is the warranty policy?',
];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function SendIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [chatLang, setChatLang] = useState<ChatLang>('en');
  const [manualChoice, setManualChoice] = useState(false);

  const idRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const nextId = (): number => {
    idRef.current += 1;
    return idRef.current;
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, thinking, open]);

  const lastUserText = [...msgs].reverse().find((m) => m.from === 'user')?.text ?? '';

  const send = (rawText: string) => {
    const text = rawText.trim();
    if (!text || thinking) return;

    const effLang: ChatLang = manualChoice ? chatLang : detectLanguage(text);
    if (!manualChoice) setChatLang(effLang);

    const userMsg: Msg = { id: nextId(), from: 'user', text, handoff: false };
    const snapshot = [...msgs, userMsg];
    setMsgs(snapshot);
    setInput('');
    setThinking(true);

    const fallback: BotReply = answerLocal(text, effLang);

    window.setTimeout(() => {
      void (async () => {
        let reply = fallback;
        const apiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL;
        if (apiUrl) {
          try {
            const res = await fetch(`${apiUrl}/api/chat`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: text,
                language: effLang,
                history: snapshot.slice(-10).map((m) => ({ from: m.from, text: m.text })),
              }),
            });
            if (res.ok) {
              const data: unknown = await res.json();
              if (isRecord(data) && typeof data.reply === 'string') {
                reply = { text: data.reply, handoff: false };
              }
            }
          } catch {
            reply = fallback;
          }
        }
        setMsgs((prev) => [...prev, { id: nextId(), from: 'bot', text: reply.text, handoff: reply.handoff }]);
        setThinking(false);
      })();
    }, 400);
  };

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open AI Tools HuB Assistant"
        className="fixed bottom-5 right-5 z-[90] rounded-full transition hover:scale-105"
      >
        <img
          src="/logo.png"
          alt="AI Tools HuB Assistant"
          className="h-14 w-14 rounded-full object-cover ring-2 ring-cyan-400/60 shadow-[0_0_24px_rgba(34,211,238,0.45)]"
        />
      </button>

      {/* Panel */}
      {open && (
        <div className="glass fixed bottom-24 right-5 z-[90] flex h-[32rem] max-h-[70vh] w-[min(24rem,92vw)] flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <h3 className="text-sm font-bold text-white">AI Tools HuB Assistant</h3>
              <p className="text-xs text-slate-400">Online &bull; product &amp; order help</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Language selector */}
          <div className="border-b border-white/10 px-4 py-2">
            <div className="flex gap-2">
              {LANGS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    setChatLang(l);
                    setManualChoice(true);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    chatLang === l && manualChoice
                      ? 'bg-cyan-500/30 text-cyan-200 ring-1 ring-cyan-400/60'
                      : 'bg-white/5 text-slate-400 ring-1 ring-white/10 hover:text-slate-200'
                  }`}
                >
                  {LANG_LABEL[l]}
                </button>
              ))}
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {manualChoice ? `Manual language: ${LANG_LABEL[chatLang]}` : 'Auto-detecting from each message'}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {msgs.length === 0 && !thinking && (
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-cyan-200 ring-1 ring-cyan-400/30 transition hover:bg-cyan-500/20"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {msgs.map((m) =>
              m.from === 'user' ? (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[80%] whitespace-pre-line rounded-2xl rounded-br-sm bg-blue-600 px-3 py-2 text-sm text-white">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex justify-start">
                  <div className="max-w-[85%]">
                    <div className="glass whitespace-pre-line rounded-2xl rounded-bl-sm px-3 py-2 text-sm text-slate-100">
                      {m.text}
                    </div>
                    {m.handoff && (
                      <a
                        href={`${WHATSAPP_LINK}?text=${encodeURIComponent(lastUserText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white shadow transition hover:bg-green-400"
                      >
                        <WhatsAppIcon />
                        Send on WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              ),
            )}

            {thinking && (
              <div className="flex justify-start">
                <div className="glass rounded-2xl rounded-bl-sm px-4 py-3">
                  <span className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-2 w-2 animate-bounce rounded-full bg-cyan-300"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t border-white/10 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              aria-label="Type your message"
              className="min-w-0 flex-1 rounded-full bg-white/5 px-4 py-2 text-sm text-white placeholder-slate-500 outline-none ring-1 ring-white/10 focus:ring-cyan-400/60"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white shadow transition hover:bg-cyan-400"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
