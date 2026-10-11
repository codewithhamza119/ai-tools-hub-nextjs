'use client';

import { useLanguage } from '../lib/i18n';
import { WHATSAPP_LINK } from '../lib/products';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative overflow-hidden pb-20 pt-32">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-600/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <span
          className="glass inline-block animate-[rise_.7s_ease-out_both] rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-300"
          style={{ animationDelay: '0s' }}
        >
          {t('hero.badge')}
        </span>

        <h1
          className="mt-6 animate-[rise_.7s_ease-out_both] text-5xl font-black md:text-7xl"
          style={{ animationDelay: '0.1s' }}
        >
          <span className="grad-text">{t('hero.titleA')}</span>{' '}
          <span className="grad-text">{t('hero.titleB')}</span>
        </h1>

        <p
          className="mx-auto mt-6 max-w-2xl animate-[rise_.7s_ease-out_both] text-base text-slate-300 md:text-lg"
          style={{ animationDelay: '0.2s' }}
        >
          {t('hero.sub')}
        </p>

        <div
          className="mt-8 flex animate-[rise_.7s_ease-out_both] flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: '0.3s' }}
        >
          <a href="#products" className="btn-primary">
            {t('hero.ctaProducts')}
          </a>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
            {t('hero.ctaWhatsapp')}
          </a>
        </div>
      </div>
    </section>
  );
}
