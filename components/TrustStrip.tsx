'use client';

import { useLanguage } from '../lib/i18n';

interface TrustCard {
  titleKey: string;
  descKey: string;
  icon: JSX.Element;
}

const CARDS: TrustCard[] = [
  {
    titleKey: 'trust.t1t',
    descKey: 'trust.t1d',
    icon: (
      <svg className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    titleKey: 'trust.t2t',
    descKey: 'trust.t2d',
    icon: (
      <svg className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    titleKey: 'trust.t3t',
    descKey: 'trust.t3d',
    icon: (
      <svg className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

export default function TrustStrip() {
  const { t } = useLanguage();

  return (
    <section className="relative mx-auto max-w-6xl px-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {CARDS.map((c) => (
          <div key={c.titleKey} className="glass p-4 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center">{c.icon}</div>
            <h3 className="font-bold text-white">{t(c.titleKey)}</h3>
            <p className="mt-1 text-sm text-slate-400">{t(c.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
