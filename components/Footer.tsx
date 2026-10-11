'use client';

import Logo from './Logo';
import { useLanguage } from '../lib/i18n';
import { WHATSAPP_LINK, categoryLabel, type CategoryId } from '../lib/products';

function WhatsappIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function FacebookIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { label: t('nav.home'), href: '#home' },
    { label: t('nav.products'), href: '#products' },
    { label: t('nav.faq'), href: '#faq' },
    { label: t('nav.support'), href: '#support' },
  ];

  const categoryIds: CategoryId[] = ['ai', 'video', 'design', 'social'];

  const socials = [
    { label: 'WhatsApp', href: WHATSAPP_LINK, icon: <WhatsappIcon /> },
    { label: 'Facebook', href: 'https://www.facebook.com/aitoolshub119', icon: <FacebookIcon /> },
  ];

  return (
    <footer className="mx-auto max-w-6xl px-4 pb-10">
      <div className="rounded-3xl border border-white/10 bg-[#0a1030] p-8 md:p-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Logo size={36} />
            <p className="mt-3 text-sm text-slate-400">{t('footer.tagline')}</p>
            <div className="mt-4 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="glass flex h-10 w-10 items-center justify-center rounded-full text-slate-300 transition hover:border-blue-400/40 hover:text-blue-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-200">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition hover:text-blue-300">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-200">
              {t('footer.categories')}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {categoryIds.map((id) => (
                <li key={id}>
                  <a href="#products" className="transition hover:text-blue-300">
                    {categoryLabel(id)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-200">
              {t('footer.contact')}
            </h4>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-slate-100 transition hover:border-blue-400/40"
            >
              <span className="text-emerald-400">
                <WhatsappIcon />
              </span>
              03493634347
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 AI Tools HuB. {t('footer.rights')}</p>
          <div className="flex gap-5">
            <a href="#" className="transition hover:text-blue-300">
              Terms
            </a>
            <a href="#faq" className="transition hover:text-blue-300">
              Refund/Warranty Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
