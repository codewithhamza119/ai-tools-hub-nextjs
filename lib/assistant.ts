/**
 * AI Tools HuB Assistant — local (offline) brain.
 * Pure TypeScript, no React. Used by AssistantWidget as the fallback
 * answerer, and replaced by the chat API when NEXT_PUBLIC_CHAT_API_URL is set.
 */
import { products, formatPrice, type Product } from './products';

export type ChatLang = 'en' | 'ur' | 'roman';

export interface BotReply {
  text: string;
  handoff: boolean;
}

type Localized = { en: string; ur: string; roman: string };

const pick = (t: Localized, lang: ChatLang): string => t[lang];

/* ------------------------------------------------------------------ */
/* Language detection                                                   */
/* ------------------------------------------------------------------ */

export function detectLanguage(text: string): ChatLang {
  if (/[\u0600-\u06FF]/.test(text)) return 'ur';
  if (/\b(hai|kya|ka|ki|ko|mein|nahi|chahiye|batao|price|warranty|salam|aoa|assalam|shukriya|theek|acha|kaise|kese|kesay)\b/i.test(text)) return 'roman';
  return 'en';
}

/* ------------------------------------------------------------------ */
/* Normalization + alias resolution                                     */
/* ------------------------------------------------------------------ */

function normalize(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function byId(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

function must(ids: string[]): Product[] {
  const out: Product[] = [];
  for (const id of ids) {
    const p = byId(id);
    if (p) out.push(p);
  }
  return out;
}

interface AliasHit {
  products: Product[];
  notInCatalog?: boolean;
  /** display label used in the not-in-catalog apology */
  label: string;
}

const CAPCUT_IDS = ['capcut-7d', 'capcut-1m-std', 'capcut-1m-credits', 'capcut-6m'];
const CANVA_IDS = ['canva-3m', 'canva-6m', 'canva-1y', 'canva-18m'];
const NORDVPN_IDS = ['nordvpn-1m', 'nordvpn-3m'];
const GEMINI_IDS = ['gemini-ai-plus', 'gemini-shared-12'];

const ALIASES: { patterns: RegExp[]; resolve: () => AliasHit }[] = [
  { patterns: [/\bmuse\b/], resolve: () => ({ products: must(['muse-ai']), label: 'Muse AI' }) },
  { patterns: [/\bgemini\b/], resolve: () => ({ products: must(GEMINI_IDS), label: 'Gemini' }) },
  { patterns: [/\bveo\b/, /\bflow\b/], resolve: () => ({ products: must(['gemini-pro-18']), label: 'Gemini Pro / VEO 3 + Flow AI' }) },
  { patterns: [/\bcapcut\b/, /\bcap cut\b/], resolve: () => ({ products: must(CAPCUT_IDS), label: 'CapCut Pro' }) },
  { patterns: [/\bcanva\b/], resolve: () => ({ products: must(CANVA_IDS), label: 'Canva Pro' }) },
  { patterns: [/\bfigma\b/], resolve: () => ({ products: must(['figma-edu']), label: 'Figma Pro Edu' }) },
  { patterns: [/\btiktok\b/, /\btik tok\b/], resolve: () => ({ products: must(['tiktok-uk']), label: 'TikTok UK Account' }) },
  { patterns: [/\bnordvpn\b/, /\bnord\b/, /\bvpn\b/], resolve: () => ({ products: must(NORDVPN_IDS), label: 'NordVPN' }) },
  { patterns: [/\budemy\b/], resolve: () => ({ products: must(['udemy-1m']), label: 'Udemy Personal Plan' }) },
  {
    patterns: [/\bchatgpt\b/, /\bchat gpt\b/, /\bgpt\b/],
    resolve: () => ({ products: [], notInCatalog: true, label: 'ChatGPT' }),
  },
];

function findAlias(text: string): AliasHit | null {
  for (const a of ALIASES) {
    if (a.patterns.some((re) => re.test(text))) return a.resolve();
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Intent patterns                                                      */
/* ------------------------------------------------------------------ */

const RE = {
  greeting: /^((hi+|hy+|hello|hey|salam|aoa|assalam)\b|(ال)?سلام)/,
  howAreYou: /(kaise ho|kese ho|kesay ho|kesay hain|how are you|kya haal)/,
  thanks: /(thank|shukriya|thanks|meherbani)/,
  bye: /^(bye|allah hafiz|khuda hafiz|goodbye|good bye|see you|take care)\b/,
  whoAmI: /(who are you|tum kaun|tum kon|aap kaun|ap kaun|your name|kaun ho)/,
  okAck: /^(ok|okay|theek|acha|accha|sahi|yes|han|haan|bilkul)\b/,
  tellAbout: /(bare mein|ke bare|kya hai|tell me about|what is|detail|features|info)/,
  price: /(price|qeemat|rate|kitne ka|kitne ki|cost)/,
  warranty: /(warranty|guarantee)/,
  payment: /(easypaisa|binance|\bpay\b|payment|iban)/,
  order: /(\border\b|\bbuy\b|kharid|book|lena)/,
  claim: /(claim|kaam nahi|nahi chal|not working|issue|problem|masla|error|band ho)/,
  availability: /(\bhai\b|available|\bhave\b|\bpass\b|chahiye|milta|stock|mile ga|milega|milay ga)/,
};

/* ------------------------------------------------------------------ */
/* Reply builders                                                       */
/* ------------------------------------------------------------------ */

function warrantyText(p: Product, lang: ChatLang): string {
  if (p.warranty) {
    const plural = p.warranty.value !== 1;
    const unit =
      p.warranty.unit === 'days'
        ? lang === 'en'
          ? plural
            ? 'Days'
            : 'Day'
          : 'din'
        : lang === 'en'
          ? plural
            ? 'Months'
            : 'Month'
          : 'maah';
    return `${p.warranty.value} ${unit} Replacement Warranty`;
  }
  if (p.noWarrantyNote) return p.noWarrantyNote;
  return lang === 'en' ? 'No warranty' : 'Warranty nahi hai';
}

/** "• Name (Duration) — Rs. X (Regular: Rs. Y) · N Days Replacement Warranty" */
function productLine(p: Product, lang: ChatLang): string {
  const regular = p.regularPrice > p.price ? ` (Regular: ${formatPrice(p.regularPrice)})` : '';
  return `• ${p.name} (${p.duration}) — ${formatPrice(p.price)}${regular} · ${warrantyText(p, lang)}`;
}

function alternativeLines(): string {
  return must(['muse-ai', 'gemini-ai-plus', 'gemini-pro-18'])
    .map((p) => `• ${p.name} (${p.duration}) — ${formatPrice(p.price)}`)
    .join('\n');
}

function notInCatalogReply(label: string, lang: ChatLang): BotReply {
  const head: Localized = {
    en: `Sorry, ${label} is not available with us right now — it should be available soon.\n\nHere are some alternatives:`,
    ur: `Mazrat ke saath, ${label} abhi hamare paas available nahi hai — jald available ho jayega.\n\nKuch alternatives ye hain:`,
    roman: `Mazrat ke saath, ${label} abhi hamare paas available nahi hai — jald available ho jayega.\n\nKuch alternatives ye hain:`,
  };
  return { text: `${pick(head, lang)}\n${alternativeLines()}`, handoff: false };
}

function availabilityReply(hit: AliasHit, lang: ChatLang): BotReply {
  if (hit.notInCatalog) return notInCatalogReply(hit.label, lang);
  const multi = hit.products.length > 1;
  const head: Localized = {
    en: multi ? 'Yes! Here are the available plans:' : 'Yes! It is available:',
    ur: multi ? 'Ji haan! Ye plans available hain:' : 'Ji haan! Ye available hai:',
    roman: multi ? 'Haan! Ye plans available hain:' : 'Haan! Ye available hai:',
  };
  const tail: Localized = {
    en: 'Shall I help you order it?',
    ur: 'Kya main order mein aap ki madad karoon?',
    roman: 'Kya main order mein aap ki madad karoon?',
  };
  const lines = hit.products.map((p) => productLine(p, lang)).join('\n');
  return { text: `${pick(head, lang)}\n${lines}\n\n${pick(tail, lang)}`, handoff: false };
}

function tellAboutReply(hit: AliasHit, lang: ChatLang): BotReply {
  if (hit.notInCatalog) return notInCatalogReply(hit.label, lang);
  const p = hit.products[0];
  if (!p) return defaultReply(lang);
  const desc = p.features.slice(0, 4).join(' ');
  const priceBlock =
    hit.products.length > 1
      ? hit.products.map((x) => productLine(x, lang)).join('\n')
      : productLine(p, lang);
  const tail: Localized = {
    en: 'Shall I help you order it?',
    ur: 'Kya main order mein aap ki madad karoon?',
    roman: 'Kya main order mein aap ki madad karoon?',
  };
  return {
    text: `${p.name} (${p.duration}):\n${desc}\n\n${priceBlock}\n\n${pick(tail, lang)}`,
    handoff: false,
  };
}

function priceReply(hit: AliasHit | null, lang: ChatLang): BotReply {
  const ask: Localized = {
    en: 'Which product would you like the price for? For example: Muse AI, Gemini, CapCut Pro, Canva Pro, Figma, TikTok UK, NordVPN or Udemy.',
    ur: 'Aap kis product ki price janna chahte hain? Masalan: Muse AI, Gemini, CapCut Pro, Canva Pro, Figma, TikTok UK, NordVPN ya Udemy.',
    roman: 'Aap kis product ki price janna chahte hain? Masalan: Muse AI, Gemini, CapCut Pro, Canva Pro, Figma, TikTok UK, NordVPN ya Udemy.',
  };
  if (!hit) return { text: pick(ask, lang), handoff: false };
  if (hit.notInCatalog) return notInCatalogReply(hit.label, lang);
  const note: Localized = {
    en: 'The yellow sticker shows the Regular Price; the red tag shows the current discounted price.',
    ur: 'Peela sticker Regular Price dikhata hai; laal tag current discounted price hota hai.',
    roman: 'Peela sticker Regular Price dikhata hai; laal tag current discounted price hota hai.',
  };
  const lines = hit.products.map((p) => productLine(p, lang)).join('\n');
  return { text: `${lines}\n\n${pick(note, lang)}`, handoff: false };
}

function warrantyReply(hit: AliasHit | null, lang: ChatLang): BotReply {
  const general: Localized = {
    en: 'Replacement Warranty means: if your plan stops working within the warranty period and you followed the terms, we replace it. Warranty claims may take up to 24 hours — please cooperate. Some products, like the Udemy Personal Plan, have no warranty and are sold at your own risk.',
    ur: 'Replacement Warranty ka matlab hai: agar warranty period mein aap ka plan kaam karna band kar de aur aap ne terms follow ki hon, to hum use replace kar dete hain. Warranty claims mein 24 ghante tak lag sakte hain — please cooperate karein. Kuch products, jaise Udemy Personal Plan, par warranty nahi hoti — wo apne risk par khareedein.',
    roman: 'Replacement Warranty ka matlab hai: agar warranty period mein plan kaam karna band kar de aur aap ne terms follow ki hon to hum use replace kar dete hain. Warranty claims mein 24 ghante tak lag sakte hain — please cooperate karein. Kuch products, jaise Udemy Personal Plan, par warranty nahi hoti — wo apne risk par khareedein.',
  };
  if (!hit) return { text: pick(general, lang), handoff: false };
  if (hit.notInCatalog) return notInCatalogReply(hit.label, lang);
  const lines = hit.products.map((p) => `• ${p.name} (${p.duration}): ${warrantyText(p, lang)}`).join('\n');
  return { text: `${pick(general, lang)}\n\n${lines}`, handoff: false };
}

function paymentReply(lang: ChatLang): BotReply {
  const text: Localized = {
    en: 'We accept three payment methods:\n1. Easypaisa — Hamza Shakoor — 03493634347\n2. EasyPaisa IBAN — PK13TMFB0000000043821211\n3. Binance — UID 1283191872\n\nAfter paying, share the payment screenshot on WhatsApp (03493634347) — your product is delivered after payment confirmation.',
    ur: 'Hum teen payment methods qabool karte hain:\n1. Easypaisa — Hamza Shakoor — 03493634347\n2. EasyPaisa IBAN — PK13TMFB0000000043821211\n3. Binance — UID 1283191872\n\nPay karne ke baad payment ka screenshot WhatsApp (03493634347) par share karein — payment confirm hone ke baad product deliver ho jayega.',
    roman: 'Hum teen payment methods qabool karte hain:\n1. Easypaisa — Hamza Shakoor — 03493634347\n2. EasyPaisa IBAN — PK13TMFB0000000043821211\n3. Binance — UID 1283191872\n\nPay karne ke baad payment ka screenshot WhatsApp (03493634347) par share karein — payment confirm hone ke baad product deliver ho jayega.',
  };
  return { text: pick(text, lang), handoff: false };
}

function orderReply(lang: ChatLang): BotReply {
  const text: Localized = {
    en: 'Ordering is easy — just 3 steps:\n1. Choose your plan.\n2. Pay via Easypaisa, EasyPaisa IBAN or Binance.\n3. Share the payment screenshot on WhatsApp (03493634347) — your product is delivered after payment confirmation.',
    ur: 'Order karna bohat aasan hai — sirf 3 steps:\n1. Apna plan chunein.\n2. Easypaisa, EasyPaisa IBAN ya Binance se pay karein.\n3. Payment ka screenshot WhatsApp (03493634347) par share karein — payment confirm hone ke baad product deliver ho jayega.',
    roman: 'Order karna bohat aasan hai — sirf 3 steps:\n1. Apna plan chunein.\n2. Easypaisa, EasyPaisa IBAN ya Binance se pay karein.\n3. Payment ka screenshot WhatsApp (03493634347) par share karein — payment confirm hone ke baad product deliver ho jayega.',
  };
  return { text: pick(text, lang), handoff: false };
}

function claimReply(lang: ChatLang): BotReply {
  const text: Localized = {
    en: 'To claim your warranty, message us on WhatsApp (03493634347) with your order details and the issue. Claims may take up to 24 hours — please cooperate. Make sure you followed the product terms (device limits, login rules): warranty is void if the terms were broken.',
    ur: 'Warranty claim ke liye WhatsApp (03493634347) par apne order ki details aur masla bhejein. Claim mein 24 ghante tak lag sakte hain — please cooperate karein. Yaqeen karein ke aap ne product ki terms follow ki hon (device limit, login rules) — terms tootne par warranty void ho jati hai.',
    roman: 'Warranty claim ke liye WhatsApp (03493634347) par apne order ki details aur masla bhejein. Claim mein 24 ghante tak lag sakte hain — please cooperate karein. Yaqeen karein ke aap ne product ki terms follow ki hon (device limit, login rules) — terms tootne par warranty void ho jati hai.',
  };
  return { text: pick(text, lang), handoff: false };
}

function askWhichProduct(lang: ChatLang): BotReply {
  const text: Localized = {
    en: 'Which product are you asking about? We have Muse AI, Gemini, CapCut Pro, Canva Pro, Figma, TikTok UK, NordVPN and Udemy.',
    ur: 'Aap kis product ke baare mein pooch rahe hain? Hamare paas Muse AI, Gemini, CapCut Pro, Canva Pro, Figma, TikTok UK, NordVPN aur Udemy hain.',
    roman: 'Aap kis product ke baare mein pooch rahe hain? Hamare paas Muse AI, Gemini, CapCut Pro, Canva Pro, Figma, TikTok UK, NordVPN aur Udemy hain.',
  };
  return { text: pick(text, lang), handoff: false };
}

function defaultReply(lang: ChatLang): BotReply {
  const text: Localized = {
    en: 'This is beyond my knowledge — your query has been forwarded to the team. Please wait a moment, or tap below to continue on WhatsApp.',
    ur: 'Ye meri knowledge se bahar hai — aapki query team ko forward kar di gayi hai, please wait karein. Ya neeche diye gaye button se WhatsApp par baat continue karein.',
    roman: 'Ye meri knowledge se bahar hai — aapki query team ko forward kar di gayi hai, please wait karein. Ya neeche diye gaye button se WhatsApp par baat continue karein.',
  };
  return { text: pick(text, lang), handoff: true };
}

const SMALL_TALK: { re: RegExp; text: Localized }[] = [
  {
    re: RE.greeting,
    text: {
      en: "Hi! I'm the AI Tools HuB Assistant. I can help you with product prices, availability, warranty, ordering and payments. What would you like to know?",
      ur: 'Assalam-o-Alaikum! Main AI Tools HuB ka Assistant hoon. Main aap ki product prices, availability, warranty, ordering aur payments mein madad kar sakta hoon. Aap kya janna chahenge?',
      roman: 'Assalam-o-Alaikum! Main AI Tools HuB ka Assistant hoon. Main aap ko product prices, availability, warranty, ordering aur payments mein madad kar sakta hoon. Aap kya janna chahte hain?',
    },
  },
  {
    re: RE.howAreYou,
    text: {
      en: "I'm doing great, thank you for asking! How can I help you with our products today?",
      ur: 'Main bilkul theek hoon, poochne ka shukriya! Aaj main products ke baare mein aap ki kya madad kar sakta hoon?',
      roman: 'Main bilkul theek hoon, poochne ka shukriya! Aaj main products ke baare mein aap ki kya madad kar sakta hoon?',
    },
  },
  {
    re: RE.thanks,
    text: {
      en: "You're welcome! If you need anything else about our products or orders, just ask.",
      ur: 'Khush aamdeed! Agar products ya orders ke baare mein kuch aur chahiye ho to zaroor poochein.',
      roman: 'Khush aamdeed! Agar products ya orders ke baare mein kuch aur chahiye ho to zaroor poochein.',
    },
  },
  {
    re: RE.bye,
    text: {
      en: 'Allah Hafiz! Thanks for visiting AI Tools HuB — we are here whenever you need help.',
      ur: 'Allah Hafiz! AI Tools HuB visit karne ka shukriya — jab bhi madad chahiye ho, hum hazir hain.',
      roman: 'Allah Hafiz! AI Tools HuB visit karne ka shukriya — jab bhi madad chahiye ho, hum hazir hain.',
    },
  },
  {
    re: RE.whoAmI,
    text: {
      en: "I'm the AI Tools HuB Assistant — your on-site helper for product details, prices, warranty, ordering and payments. For anything beyond my knowledge, I can hand you over to our team on WhatsApp.",
      ur: 'Main AI Tools HuB ka Assistant hoon — product details, prices, warranty, ordering aur payments ke liye aap ka helper. Jo cheez meri knowledge se bahar ho, us ke liye main aap ko WhatsApp par hamari team se connect kar sakta hoon.',
      roman: 'Main AI Tools HuB ka Assistant hoon — product details, prices, warranty, ordering aur payments ke liye aap ka helper. Jo cheez meri knowledge se bahar ho, us ke liye main aap ko WhatsApp par hamari team se connect kar sakta hoon.',
    },
  },
  {
    re: RE.okAck,
    text: {
      en: 'Alright! Let me know if you need help with any product, price or order.',
      ur: 'Theek hai! Agar kisi product, price ya order mein madad chahiye ho to batayein.',
      roman: 'Theek hai! Agar kisi product, price ya order mein madad chahiye ho to batayein.',
    },
  },
];

/* ------------------------------------------------------------------ */
/* Main entry                                                           */
/* ------------------------------------------------------------------ */

export function answerLocal(raw: string, lang: ChatLang): BotReply {
  const text = normalize(raw);
  if (!text) return defaultReply(lang);

  const hit = findAlias(text);

  if (RE.payment.test(text)) return paymentReply(lang);
  if (RE.order.test(text)) return orderReply(lang);
  if (RE.claim.test(text)) return claimReply(lang);
  if (RE.warranty.test(text)) return warrantyReply(hit, lang);
  if (RE.price.test(text)) return priceReply(hit, lang);
  if (RE.tellAbout.test(text)) return hit ? tellAboutReply(hit, lang) : defaultReply(lang);
  if (hit) return availabilityReply(hit, lang);

  for (const s of SMALL_TALK) {
    if (s.re.test(text)) return { text: pick(s.text, lang), handoff: false };
  }

  if (RE.availability.test(text)) return askWhichProduct(lang);

  return defaultReply(lang);
}
