'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../lib/i18n';
import { WHATSAPP_LINK } from '../lib/products';
import Reveal from './Reveal';

function CopyButton({ text }: { text: string }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for browsers without clipboard API permission
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
        copied
          ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300'
          : 'border-blue-400/40 bg-blue-400/10 text-blue-300 hover:bg-blue-400/20'
      }`}
    >
      {copied ? t('checkout.copied') : t('checkout.copy')}
    </button>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
        <p className="truncate font-mono text-sm font-medium text-white">{value}</p>
      </div>
      <CopyButton text={value} />
    </div>
  );
}

export default function CheckoutSection() {
  const { t } = useLanguage();

  const steps = [
    { title: t('checkout.step1t'), desc: t('checkout.step1d') },
    { title: t('checkout.step2t'), desc: t('checkout.step2d') },
    { title: t('checkout.step3t'), desc: t('checkout.step3d') },
  ];

  return (
    <section id="checkout" className="py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2 lg:items-center">
        {/* Left: steps */}
        <Reveal>
          <h2 className="grad-text text-3xl font-bold sm:text-4xl">{t('checkout.title')}</h2>
          <div className="mt-8 space-y-6">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-400 text-sm font-bold text-white shadow-lg shadow-violet-500/25">
                  {i + 1}
                </div>
                <div>
                  <p className="font-bold">{step.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Right: payment card */}
        <Reveal delayMs={120}>
          <div className="glass rounded-3xl p-5">
            {/* Highlighted WhatsApp CTA */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-5 shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-400/50"
            >
              <span className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/20 blur-xl transition group-hover:scale-125" />
              <span className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/10 blur-xl" />
              <span className="relative flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 fill-emerald-600">
                    <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35M12.04 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.89 9.88M20.5 3.49A11.8 11.8 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.9 11.9 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.44-8.41" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-black text-white">{t('checkout.whatsappTitle')}</span>
                  <span className="mt-0.5 block text-sm text-emerald-50/90">{t('checkout.whatsappDesc')}</span>
                  <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-extrabold text-emerald-700 shadow transition group-hover:gap-3">
                    {t('checkout.whatsappBtn')}
                    <span aria-hidden>→</span>
                  </span>
                </span>
              </span>
            </a>

            <p className="mt-6 text-[10px] uppercase tracking-widest text-slate-400">PAYMENT METHODS</p>
            <h3 className="mt-1 text-xl font-bold">{t('checkout.payTitle')}</h3>

            <div className="mt-3 divide-y divide-white/10">
              <div className="py-4">
                <p className="mb-3 text-sm font-semibold text-blue-300">Easypaisa</p>
                <div className="space-y-3">
                  <Field label={t('checkout.accountTitle')} value="Hamza Shakoor" />
                  <Field label={t('checkout.accountNumber')} value="03493634347" />
                </div>
              </div>
              <div className="py-4">
                <p className="mb-3 text-sm font-semibold text-blue-300">EasyPaisa IBAN</p>
                <Field label={t('checkout.iban')} value="PK13TMFB0000000043821211" />
              </div>
              <div className="py-4">
                <p className="mb-3 text-sm font-semibold text-blue-300">Binance</p>
                <div className="space-y-3">
                  <Field label={t('checkout.accountTitle')} value="AI Tools HuB" />
                  <Field label={t('checkout.binanceUid')} value="1283191872" />
                </div>
              </div>
            </div>

            <p className="mt-2 text-sm text-slate-400">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 transition hover:text-blue-200 hover:underline"
              >
                {t('checkout.note')}
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
