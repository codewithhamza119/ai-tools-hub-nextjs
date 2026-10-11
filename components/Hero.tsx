'use client';

import { useLanguage } from '../lib/i18n';

/** Frosted mini cards shown on the hero's catalog panel. */
const MINI_CARDS = [
  { src: '/images/banners/muse-ai.jpg', alt: 'Muse AI', tall: true },
  { src: '/images/banners/gemini.jpg', alt: 'Gemini' },
  { src: '/images/banners/capcut.jpg', alt: 'CapCut' },
  { src: '/images/banners/design.jpg', alt: 'Figma' },
  { src: '/images/banners/vpn.jpg', alt: 'VPN' },
];

export default function Hero({ planCount }: { planCount: number }) {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative overflow-hidden pb-10 pt-32">
      {/* Ambient glows — purple + blue */}
      <div aria-hidden className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-purple-700/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-40 h-[26rem] w-[26rem] rounded-full bg-blue-600/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
        {/* Left: headline block */}
        <div>
          <span className="glass inline-block animate-[rise_.7s_ease-out_both] rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200">
            {t('hero.eyebrow')}
          </span>

          <h1
            className="mt-6 animate-[rise_.7s_ease-out_both] text-6xl font-black leading-[1.02] tracking-tight md:text-8xl"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="text-white">{t('hero.titleA')}</span>
            <br />
            <span className="grad-text">{t('hero.titleB')}</span>
          </h1>

          <p
            className="mt-5 animate-[rise_.7s_ease-out_both] text-2xl font-bold text-white md:text-3xl"
            style={{ animationDelay: '0.18s' }}
          >
            {t('hero.subHeadline')}
          </p>

          <p
            className="mt-4 max-w-xl animate-[rise_.7s_ease-out_both] text-base leading-relaxed text-slate-300"
            style={{ animationDelay: '0.24s' }}
          >
            {t('hero.sub')}
          </p>

          <div
            className="mt-8 flex animate-[rise_.7s_ease-out_both] flex-wrap items-center gap-4"
            style={{ animationDelay: '0.3s' }}
          >
            <a href="#products" className="btn-gradient-pill">
              {t('hero.explore').replace('{n}', String(planCount))}
            </a>
            <a href="#checkout" className="btn-outline-pill">
              {t('hero.howItWorks')}
            </a>
          </div>

          {/* Stats */}
          <dl
            className="mt-10 flex animate-[rise_.7s_ease-out_both] gap-10 border-t border-white/10 pt-6"
            style={{ animationDelay: '0.36s' }}
          >
            <div>
              <dt className="sr-only">{t('hero.statPlans')}</dt>
              <dd className="text-2xl font-extrabold text-white">{planCount}</dd>
              <dd className="mt-1 text-xs text-slate-400">{t('hero.statPlans')}</dd>
            </div>
            <div>
              <dt className="sr-only">{t('hero.statCats')}</dt>
              <dd className="text-2xl font-extrabold text-white">6</dd>
              <dd className="mt-1 text-xs text-slate-400">{t('hero.statCats')}</dd>
            </div>
            <div>
              <dt className="sr-only">{t('hero.statSupport')}</dt>
              <dd className="text-2xl font-extrabold text-white">24h</dd>
              <dd className="mt-1 text-xs text-slate-400">{t('hero.statSupport')}</dd>
            </div>
          </dl>
        </div>

        {/* Right: frosted catalog panel */}
        <div
          className="glass relative animate-[rise_.7s_ease-out_both] rounded-3xl p-6 md:p-8"
          style={{ animationDelay: '0.25s' }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
          >
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-600/25 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-purple-600/25 blur-3xl" />
          </div>
          <p className="relative text-[11px] font-bold uppercase tracking-[0.25em] text-blue-300">
            {t('hero.catalogEyebrow')}
          </p>
          <h2 className="relative mt-2 text-3xl font-extrabold leading-tight text-white md:text-4xl">
            {t('hero.catalogTitle')}
          </h2>
          <div className="relative mt-6 grid grid-cols-3 gap-3">
            {MINI_CARDS.map((c, i) => (
              <div
                key={c.src}
                className={`overflow-hidden rounded-2xl bg-white shadow-xl ${
                  i === 0 ? 'row-span-2' : ''
                }`}
              >
                <img
                  src={c.src}
                  alt={c.alt}
                  loading="lazy"
                  className={`w-full object-cover ${i === 0 ? 'h-full min-h-[13rem]' : 'aspect-square'}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="relative mt-12 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">
        {t('hero.scroll')}
      </p>
    </section>
  );
}
