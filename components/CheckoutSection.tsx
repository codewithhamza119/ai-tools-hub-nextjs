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
          : 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20'
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
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-sm font-bold text-white shadow-lg shadow-violet-500/25">
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
            <p className="text-[10px] uppercase tracking-widest text-slate-400">PAYMENT METHODS</p>
            <h3 className="mt-1 text-xl font-bold">{t('checkout.payTitle')}</h3>

            <div className="mt-3 divide-y divide-white/10">
              <div className="py-4">
                <p className="mb-3 text-sm font-semibold text-cyan-300">Easypaisa</p>
                <div className="space-y-3">
                  <Field label={t('checkout.accountTitle')} value="Hamza Shakoor" />
                  <Field label={t('checkout.accountNumber')} value="03493634347" />
                </div>
              </div>
              <div className="py-4">
                <p className="mb-3 text-sm font-semibold text-cyan-300">EasyPaisa IBAN</p>
                <Field label={t('checkout.iban')} value="PK13TMFB0000000043821211" />
              </div>
              <div className="py-4">
                <p className="mb-3 text-sm font-semibold text-cyan-300">Binance</p>
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
                className="text-cyan-300 transition hover:text-cyan-200 hover:underline"
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
