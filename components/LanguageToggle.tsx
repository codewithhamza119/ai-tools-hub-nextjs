'use client';

import { useLanguage } from '../lib/i18n';

/**
 * Segmented EN | Roman Urdu toggle pill, matching the reference navbar.
 * Clicking switches between the two languages.
 */
export default function LanguageToggle() {
  const { t, lang, setLang } = useLanguage();

  const seg = (active: boolean) =>
    active
      ? 'rounded-full bg-blue-500 px-3 py-1.5 text-white shadow'
      : 'px-3 py-1.5 text-slate-300 transition hover:text-white';

  return (
    <div
      className="glass flex items-center gap-1 rounded-full p-1 text-xs font-bold"
      role="group"
      aria-label={t('toggle.title')}
      title={t('toggle.title')}
    >
      <button type="button" onClick={() => setLang('en')} className={seg(lang === 'en')}>
        EN
      </button>
      <span className="text-slate-500" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        onClick={() => setLang('roman')}
        className={seg(lang === 'roman')}
      >
        Roman Urdu
      </button>
    </div>
  );
}
