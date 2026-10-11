'use client';

import { useLanguage } from '../lib/i18n';

export default function LanguageToggle() {
  const { t, lang, setLang } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => setLang(lang === 'en' ? 'roman' : 'en')}
      title={t('toggle.title')}
      className="glass rounded-full px-3 py-1.5 text-xs font-bold text-slate-200 transition hover:text-white"
    >
      {t('toggle.label')}
    </button>
  );
}
