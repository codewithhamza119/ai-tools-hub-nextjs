'use client';

import { useLanguage } from '../lib/i18n';
import Reveal from './Reveal';

function WhatsappIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function FacebookIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

interface CommunityCard {
  title: string;
  desc: string;
  href: string;
  icon: 'whatsapp' | 'facebook';
}

export default function CommunitySection() {
  const { t } = useLanguage();

  const cards: CommunityCard[] = [
    {
      title: t('community.communityT'),
      desc: t('community.communityD'),
      href: 'https://chat.whatsapp.com/Fk0A1llFgk5IQyCvsbJkuF',
      icon: 'whatsapp',
    },
    {
      title: t('community.channelT'),
      desc: t('community.channelD'),
      href: 'https://whatsapp.com/channel/0029VbDYnDCEgGfFKKtzbn0S',
      icon: 'whatsapp',
    },
    {
      title: t('community.fbT'),
      desc: t('community.fbD'),
      href: 'https://www.facebook.com/aitoolshub119',
      icon: 'facebook',
    },
  ];

  return (
    <section id="support" className="mx-auto max-w-6xl px-4 py-20">
      <Reveal>
        <h2 className="grad-text text-center text-3xl font-bold sm:text-4xl">{t('community.title')}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">{t('community.sub')}</p>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {cards.map((card, i) => (
          <Reveal key={card.href} delayMs={i * 80}>
            <div className="glass flex h-full flex-col rounded-3xl p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25">
                {card.icon === 'whatsapp' ? <WhatsappIcon /> : <FacebookIcon />}
              </div>
              <h3 className="text-lg font-bold">{card.title}</h3>
              <p className="mt-2 flex-1 text-sm text-slate-400">{card.desc}</p>
              <a
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-5 inline-flex items-center justify-center"
              >
                {t('community.join')}
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
