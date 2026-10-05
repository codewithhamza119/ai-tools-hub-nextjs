'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Warranty } from './products';

export type SiteLang = 'en' | 'roman';

const STORAGE_KEY = 'ath-lang';

const dict: Record<string, { en: string; roman: string }> = {
  'nav.home': { en: 'Home', roman: 'Home' },
  'nav.products': { en: 'Products', roman: 'Products' },
  'nav.faq': { en: 'FAQ', roman: 'FAQ' },
  'nav.support': { en: 'Support', roman: 'Support' },
  'nav.cart': { en: 'Cart', roman: 'Cart' },

  'hero.badge': { en: 'Your One Stop AI Tools Solution', roman: 'Aap ka One Stop AI Tools Solution' },
  'hero.titleA': { en: 'AI Tools', roman: 'AI Tools' },
  'hero.titleB': { en: 'HuB', roman: 'HuB' },
  'hero.sub': {
    en: 'Premium AI subscriptions, editing tools and digital services — instant delivery, replacement warranty, and WhatsApp support.',
    roman: 'Premium AI subscriptions, editing tools aur digital services — fori delivery, replacement warranty aur WhatsApp support ke saath.',
  },
  'hero.ctaProducts': { en: 'Browse Products', roman: 'Products Dekhein' },
  'hero.ctaWhatsapp': { en: 'Chat on WhatsApp', roman: 'WhatsApp par Baat Karein' },

  'trust.t1t': { en: 'Clear plan terms', roman: 'Wazeh Plan Terms' },
  'trust.t1d': { en: 'Transparent durations, prices and warranty on every product.', roman: 'Har product par wazeh duration, price aur warranty.' },
  'trust.t2t': { en: 'Replacement coverage', roman: 'Replacement Coverage' },
  'trust.t2d': { en: 'Plans are replaced within the warranty period if terms are followed.', roman: 'Warranty period mein terms follow karne par plan replace hota hai.' },
  'trust.t3t': { en: 'WhatsApp support', roman: 'WhatsApp Support' },
  'trust.t3d': { en: 'Real human help on WhatsApp, 03493634347.', roman: 'WhatsApp par asli insaan se madad — 03493634347.' },

  'catalog.title': { en: 'Our Products', roman: 'Hamare Products' },
  'catalog.sub': {
    en: 'Hand-picked premium tools at discounted prices. Click any product for full details.',
    roman: 'Discounted prices par muntakhib premium tools. Mukammal details ke liye kisi bhi product par click karein.',
  },
  'catalog.all': { en: 'All Products', roman: 'Sab Products' },
  'catalog.viewDetails': { en: 'View Details', roman: 'Details Dekhein' },
  'catalog.addToCart': { en: 'Add to Cart', roman: 'Cart mein Daalein' },
  'catalog.added': { en: 'Added!', roman: 'Add ho gaya!' },

  'modal.features': { en: 'Features', roman: 'Features' },
  'modal.activation': { en: 'Activation Process', roman: 'Activation ka Tareeqa' },
  'modal.claimTitle': { en: 'Warranty Claim', roman: 'Warranty Claim' },
  'modal.claimText': {
    en: 'If your plan stops working within the warranty period and you followed the terms, message us on WhatsApp — claims may take up to 24 hours. Please cooperate.',
    roman: 'Agar warranty period mein plan kaam karna band kar de aur aap ne terms follow ki hon to WhatsApp par message karein — claim mein 24 ghante tak lag sakte hain. Please cooperate karein.',
  },
  'modal.orderWhatsapp': { en: 'Order on WhatsApp', roman: 'WhatsApp par Order Karein' },
  'modal.close': { en: 'Close', roman: 'Band Karein' },
  'modal.duration': { en: 'Duration', roman: 'Duration' },

  'cart.title': { en: 'Your Cart', roman: 'Aap ka Cart' },
  'cart.empty': { en: 'Your cart is empty.', roman: 'Aap ka cart khaali hai.' },
  'cart.emptyCta': { en: 'Browse products', roman: 'Products dekhein' },
  'cart.total': { en: 'Total', roman: 'Total' },
  'cart.checkout': { en: 'Proceed to Checkout', roman: 'Checkout par Jayein' },
  'cart.remove': { en: 'Remove', roman: 'Hatayein' },

  'checkout.title': { en: 'Three steps to your order.', roman: 'Order ke liye sirf teen steps.' },
  'checkout.step1t': { en: 'Choose your plan', roman: 'Apna plan chunein' },
  'checkout.step1d': { en: 'Add the product you want to your cart.', roman: 'Jo product chahiye usay cart mein daalein.' },
  'checkout.step2t': { en: 'Pay by Easypaisa or Binance', roman: 'Easypaisa ya Binance se pay karein' },
  'checkout.step2d': { en: 'Send the exact order total using either payment method shown here.', roman: 'Yahan diye gaye kisi bhi method se exact order total bhejein.' },
  'checkout.step3t': { en: 'Confirm on WhatsApp', roman: 'WhatsApp par confirm karein' },
  'checkout.step3d': {
    en: 'Share your transaction screenshot. Your product is delivered after payment confirmation.',
    roman: 'Apna transaction screenshot share karein. Payment confirm hone ke baad product deliver ho jayega.',
  },
  'checkout.payTitle': { en: 'Choose Easypaisa or Binance', roman: 'Easypaisa ya Binance chunein' },
  'checkout.accountTitle': { en: 'Account title', roman: 'Account title' },
  'checkout.accountNumber': { en: 'Easypaisa number', roman: 'Easypaisa number' },
  'checkout.iban': { en: 'Easypaisa IBAN', roman: 'Easypaisa IBAN' },
  'checkout.binanceUid': { en: 'Binance UID', roman: 'Binance UID' },
  'checkout.copy': { en: 'Copy', roman: 'Copy' },
  'checkout.copied': { en: 'Copied!', roman: 'Copy ho gaya!' },
  'checkout.note': {
    en: 'After paying, send the screenshot on WhatsApp: 03493634347',
    roman: 'Pay karne ke baad screenshot WhatsApp par bhejein: 03493634347',
  },

  'faq.title': { en: 'Frequently Asked Questions', roman: 'Aksar Poochhe Jane Wale Sawalat' },
  'faq.sub': {
    en: 'Everything you need to know before ordering.',
    roman: 'Order karne se pehle sab kuch jaan lein.',
  },
  'faq.q1': { en: 'How do I place an order?', roman: 'Order kaise karoon?' },
  'faq.a1': {
    en: 'Pick your plan and pay via Easypaisa, EasyPaisa IBAN or Binance (details above). Then share the payment screenshot on WhatsApp at 03493634347 — your product is delivered after payment confirmation.',
    roman: 'Apna plan chunein aur Easypaisa, EasyPaisa IBAN ya Binance se pay karein (details upar). Phir payment ka screenshot WhatsApp 03493634347 par bhejein — payment confirm hone ke baad product deliver ho jayega.',
  },
  'faq.q2': { en: 'How long does delivery take?', roman: 'Delivery mein kitna time lagta hai?' },
  'faq.a2': {
    en: 'Usually within a few hours after payment confirmation. Warranty claims may take up to 24 hours — please cooperate.',
    roman: 'Aam tor par payment confirm hone ke chand ghanton mein. Warranty claims mein 24 ghante tak lag sakte hain — please cooperate karein.',
  },
  'faq.q3': { en: 'What is Replacement Warranty?', roman: 'Replacement Warranty kya hai?' },
  'faq.a3': {
    en: 'If your plan stops working within the warranty period and you followed the terms, we replace it. Terms like device limits and login rules must be respected.',
    roman: 'Agar warranty period mein plan kaam karna band kar de aur aap ne terms follow ki hon to hum replace kar dete hain. Device limit aur login rules jaisi terms follow karna zaroori hai.',
  },
  'faq.q4': { en: 'Which payment methods do you accept?', roman: 'Kaun se payment methods qabool hain?' },
  'faq.a4': {
    en: 'Easypaisa (03493634347, Hamza Shakoor), EasyPaisa IBAN (PK13TMFB0000000043821211) and Binance (UID 1283191872).',
    roman: 'Easypaisa (03493634347, Hamza Shakoor), EasyPaisa IBAN (PK13TMFB0000000043821211) aur Binance (UID 1283191872).',
  },
  'faq.q5': { en: 'I need help with my order.', roman: 'Mujhe order mein madad chahiye.' },
  'faq.a5': {
    en: 'Message us on WhatsApp at 03493634347 or ask the AI assistant on this site — it answers in English, Urdu and Roman Urdu.',
    roman: 'WhatsApp 03493634347 par message karein ya is site par AI assistant se poochein — ye English, Urdu aur Roman Urdu mein jawab deta hai.',
  },

  'community.title': { en: 'Join Our Community', roman: 'Hamari Community Join Karein' },
  'community.sub': {
    en: 'Get updates, deals and support in our WhatsApp community and channel.',
    roman: 'Hamari WhatsApp community aur channel mein updates, deals aur support hasil karein.',
  },
  'community.communityT': { en: 'WhatsApp Community', roman: 'WhatsApp Community' },
  'community.communityD': { en: 'Chat with buyers and get support.', roman: 'Buyers se baat karein aur support hasil karein.' },
  'community.channelT': { en: 'WhatsApp Channel', roman: 'WhatsApp Channel' },
  'community.channelD': { en: 'Follow AI Tools HuB for updates & offers.', roman: 'Updates aur offers ke liye AI Tools HuB ko follow karein.' },
  'community.fbT': { en: 'Facebook Page', roman: 'Facebook Page' },
  'community.fbD': { en: 'Follow us on Facebook.', roman: 'Facebook par follow karein.' },
  'community.join': { en: 'Join', roman: 'Join Karein' },

  'footer.tagline': { en: 'Your One Stop AI Tools Solution', roman: 'Your One Stop AI Tools Solution' },
  'footer.quickLinks': { en: 'Quick Links', roman: 'Quick Links' },
  'footer.categories': { en: 'Categories', roman: 'Categories' },
  'footer.contact': { en: 'Contact', roman: 'Contact' },
  'footer.rights': { en: 'All rights reserved.', roman: 'All rights reserved.' },

  'toggle.label': { en: 'Roman Urdu', roman: 'English' },
  'toggle.title': { en: 'Switch to Roman Urdu', roman: 'English mein dekhein' },
};

interface LangCtx {
  lang: SiteLang;
  setLang: (l: SiteLang) => void;
  t: (key: string) => string;
  warrantyLabel: (w: Warranty) => string;
}

const Ctx = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<SiteLang>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'roman') setLangState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = (l: SiteLang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  };

  const t = (key: string): string => dict[key]?.[lang] ?? dict[key]?.en ?? key;

  const warrantyLabel = (w: Warranty): string => {
    const unit = w.unit === 'days'
      ? lang === 'roman' ? 'Din' : 'Days'
      : lang === 'roman' ? 'Maah' : 'Months';
    return `${w.value} ${unit} Replacement Warranty`;
  };

  return <Ctx.Provider value={{ lang, setLang, t, warrantyLabel }}>{children}</Ctx.Provider>;
}

export function useLanguage(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
