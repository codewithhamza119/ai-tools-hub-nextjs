'use client';

import { useState } from 'react';
import { useLanguage } from '../lib/i18n';
import Reveal from './Reveal';

export default function FaqSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = [1, 2, 3, 4, 5].map((n) => ({
    q: t(`faq.q${n}`),
    a: t(`faq.a${n}`),
  }));

  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-20">
      <Reveal>
        <h2 className="grad-text text-center text-3xl font-bold sm:text-4xl">{t('faq.title')}</h2>
        <p className="mt-3 text-center text-slate-400">{t('faq.sub')}</p>
      </Reveal>

      <div className="mt-10 space-y-3">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <Reveal key={i} delayMs={i * 60}>
              <div className="glass overflow-hidden rounded-2xl">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left"
                >
                  <span className="font-semibold">{item.q}</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`h-5 w-5 shrink-0 text-cyan-300 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                    isOpen ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <p className="px-4 pb-4 text-sm leading-relaxed text-slate-400">{item.a}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
