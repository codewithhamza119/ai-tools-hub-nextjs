export type CategoryId = 'ai' | 'video' | 'design' | 'social';

export interface Warranty {
  value: number;
  unit: 'days' | 'months';
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  /** e.g. "12 Months", "Plan Access" */
  duration: string;
  regularPrice: number;
  /** discounted / current price */
  price: number;
  warranty: Warranty | null;
  /** shown instead of a warranty badge, e.g. Udemy */
  noWarrantyNote?: string;
  /** path under /images; when absent, gradient art is rendered */
  image?: string;
  /** gradient fallback art */
  art: { from: string; to: string; glyph: string };
  features: string[];
  activation: string[];
  note?: string;
}

export const categories: { id: CategoryId | 'all'; label: string }[] = [
  { id: 'all', label: 'All Products' },
  { id: 'ai', label: 'AI Subscriptions' },
  { id: 'video', label: 'Video Editing' },
  { id: 'design', label: 'Design Tools' },
  { id: 'social', label: 'Social, VPN & Learning' },
];

export function categoryLabel(id: CategoryId): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}

const CAPCUT_ACTIVATION = [
  'Log in on mobile first with the provided email & password.',
  'Then authorize the desktop app by scanning the QR code.',
  'Maximum 2 devices per plan.',
];
const CAPCUT_NOTE =
  'Warranty is void if you log in via browser/direct laptop-first login, share credentials, change security settings, or use a third device.';

const CANVA_FEATURES = [
  'All Canva Pro features unlocked.',
  'Premium templates, photos & elements.',
  'Background remover & Magic tools.',
  'Brand Kit and 1 TB cloud storage.',
];
const CANVA_ACTIVATION = [
  'A Pro team invite is sent to your email.',
  'Accept the invite to join the Pro workspace.',
  'Start designing with full Pro access.',
];

export const products: Product[] = [
  // ---------- AI Subscriptions (Muse AI first, then price ascending) ----------
  {
    id: 'muse-ai',
    name: 'Muse AI by Meta',
    category: 'ai',
    duration: 'Plan Access',
    regularPrice: 1499,
    price: 999,
    warranty: { value: 15, unit: 'days' },
    image: '/images/muse-ai.jpg',
    art: { from: '#7c3aed', to: '#06b6d4', glyph: 'M' },
    features: [
      'Your own personal AI agent by Meta — 1 Billion Credits included.',
      'Builds complete websites and web apps for you.',
      'Writes, debugs and explains code in every major language.',
      'Generates images, video and audio (voiceovers, podcasts).',
      'Deep web research with real sources.',
      'Manages Gmail & Google Calendar, sets reminders and automations.',
      'Voice conversations, calls, texts and notifications.',
      'Chat on web, iOS, Android, Mac and WhatsApp.',
    ],
    activation: [
      'We activate the plan on your provided email or personal Gmail.',
      'You receive a login OTP on your email/phone.',
      'Enter the OTP to sign in — done.',
    ],
    note: '15-day account-access warranty. Generation quality or platform errors are not warranty issues.',
  },
  {
    id: 'gemini-pro-18',
    name: 'Gemini Pro / VEO 3 + Flow AI',
    category: 'ai',
    duration: '18 Months',
    regularPrice: 799,
    price: 599,
    warranty: { value: 15, unit: 'days' },
    art: { from: '#6d28d9', to: '#22d3ee', glyph: 'Gp' },
    features: [
      'NotebookLM included.',
      'Flow AI / Veo 3 video generation access.',
      'Antigravity & Whisk access.',
      '5 TB cloud storage.',
      '18,000 Flow credits + 1,000 monthly credits.',
      'Advanced Gemini models with image & video features.',
    ],
    activation: [
      'Voucher-based activation on your personal Gmail.',
      'Redeem the voucher code we provide.',
      'Full 18-month access unlocked.',
    ],
  },
  {
    id: 'gemini-ai-plus',
    name: 'Gemini AI Plus Plan',
    category: 'ai',
    duration: '12 Months',
    regularPrice: 3000,
    price: 2500,
    warranty: { value: 10, unit: 'months' },
    art: { from: '#7c3aed', to: '#06b6d4', glyph: 'Ge' },
    features: [
      '12-month Gemini AI Plus subscription.',
      'All Gemini AI features included.',
      'Advanced Gemini models access.',
      'Image & video generation features.',
    ],
    activation: [
      'Provide your personal Gmail address.',
      'The plan is activated on your Gmail via voucher.',
      'Sign in and start using all features.',
    ],
    note: 'This package is for Gemini AI Plus only — Flow AI is NOT sold with this package.',
  },
  {
    id: 'gemini-shared-12',
    name: 'Gemini 12 Months — Shared Plan',
    category: 'ai',
    duration: '12 Months',
    regularPrice: 3000,
    price: 2500,
    warranty: { value: 10, unit: 'months' },
    art: { from: '#4f46e5', to: '#0ea5e9', glyph: 'Gs' },
    features: [
      '12-month shared Gemini plan.',
      'All Gemini AI features included.',
      'Advanced Gemini models access.',
      'Image & video generation features.',
    ],
    activation: [
      'Provide your personal Gmail address.',
      'The shared plan is activated on your Gmail.',
      'Sign in and start using all features.',
    ],
    note: 'This package is for Gemini AI Plus only — Flow AI is NOT sold with this package.',
  },

  // ---------- Video Editing ----------
  {
    id: 'capcut-7d',
    name: 'CapCut Pro',
    category: 'video',
    duration: '7 Days',
    regularPrice: 400,
    price: 349,
    warranty: null,
    art: { from: '#0e7490', to: '#164e63', glyph: 'Cc' },
    features: [
      'All CapCut Pro features unlocked.',
      'No watermark on exports.',
      'Premium effects, transitions & filters.',
      'Cloud storage for your projects.',
    ],
    activation: CAPCUT_ACTIVATION,
    note: CAPCUT_NOTE,
  },
  {
    id: 'capcut-1m-std',
    name: 'CapCut Pro — Standard',
    category: 'video',
    duration: '1 Month',
    regularPrice: 1000,
    price: 799,
    warranty: { value: 25, unit: 'days' },
    art: { from: '#0e7490', to: '#164e63', glyph: 'Cs' },
    features: [
      'All Pro features unlocked — no credits needed.',
      'Unlimited Pro access for the full month.',
      'No watermark on exports.',
      'Premium effects, transitions & filters.',
    ],
    activation: CAPCUT_ACTIVATION,
    note: 'No credits included in this plan. ' + CAPCUT_NOTE,
  },
  {
    id: 'capcut-1m-credits',
    name: 'CapCut Pro — 1,600 Credits',
    category: 'video',
    duration: '1 Month',
    regularPrice: 1500,
    price: 999,
    warranty: null,
    art: { from: '#0e7490', to: '#164e63', glyph: 'C+' },
    features: [
      'CapCut Pro with 1,600 AI credits.',
      'All Pro features unlocked.',
      'No watermark on exports.',
      'Premium effects, transitions & filters.',
    ],
    activation: CAPCUT_ACTIVATION,
    note: 'Flow AI credits are not included in this package. ' + CAPCUT_NOTE,
  },
  {
    id: 'capcut-6m',
    name: 'CapCut Pro',
    category: 'video',
    duration: '6 Months',
    regularPrice: 5000,
    price: 5000,
    warranty: null,
    art: { from: '#0e7490', to: '#164e63', glyph: 'C6' },
    features: [
      'All CapCut Pro features unlocked for 6 months.',
      'No watermark on exports.',
      'Premium effects, transitions & filters.',
      'Cloud storage for your projects.',
    ],
    activation: CAPCUT_ACTIVATION,
    note: CAPCUT_NOTE,
  },

  // ---------- Design ----------
  {
    id: 'canva-3m',
    name: 'Canva Pro',
    category: 'design',
    duration: '3 Months',
    regularPrice: 399,
    price: 399,
    warranty: { value: 1, unit: 'months' },
    art: { from: '#6d28d9', to: '#db2777', glyph: 'Ca' },
    features: CANVA_FEATURES,
    activation: CANVA_ACTIVATION,
  },
  {
    id: 'canva-6m',
    name: 'Canva Pro',
    category: 'design',
    duration: '6 Months',
    regularPrice: 599,
    price: 599,
    warranty: { value: 3, unit: 'months' },
    art: { from: '#6d28d9', to: '#db2777', glyph: 'Ca' },
    features: CANVA_FEATURES,
    activation: CANVA_ACTIVATION,
  },
  {
    id: 'canva-1y',
    name: 'Canva Pro',
    category: 'design',
    duration: '1 Year',
    regularPrice: 1000,
    price: 699,
    warranty: null,
    art: { from: '#6d28d9', to: '#db2777', glyph: 'Ca' },
    features: CANVA_FEATURES,
    activation: CANVA_ACTIVATION,
  },
  {
    id: 'canva-18m',
    name: 'Canva Pro',
    category: 'design',
    duration: '1.5 Year',
    regularPrice: 1500,
    price: 999,
    warranty: { value: 12, unit: 'months' },
    art: { from: '#6d28d9', to: '#db2777', glyph: 'Ca' },
    features: CANVA_FEATURES,
    activation: CANVA_ACTIVATION,
  },
  {
    id: 'figma-edu',
    name: 'Figma Pro Edu',
    category: 'design',
    duration: '2 Years',
    regularPrice: 4000,
    price: 4000,
    warranty: null,
    art: { from: '#059669', to: '#2563eb', glyph: 'Fg' },
    features: [
      'Figma Professional (Education plan).',
      '3,000 credits every month.',
      'Full 2-year duration.',
      'All professional design features unlocked.',
    ],
    activation: [
      'We provision the Edu plan on your provided email.',
      'You receive an invite to the Pro team.',
      'Accept and start designing.',
    ],
  },

  // ---------- Social, VPN & Learning ----------
  {
    id: 'tiktok-uk',
    name: 'TikTok UK Account',
    category: 'social',
    duration: 'Account Access',
    regularPrice: 1500,
    price: 799,
    warranty: null,
    art: { from: '#831843', to: '#0e7490', glyph: 'Tk' },
    features: [
      'UK-region TikTok account.',
      'Fresh account, set up for you.',
      'UK-region features (Shop, LIVE, monetization options) as per TikTok policy.',
      'Complete setup & usage guidance included.',
    ],
    activation: [
      'Provide a completely fresh Gmail (18+ age, never used anywhere, no 2FA / backup email / phone added).',
      'Share the email + password with us.',
      'We set up the account and hand over the login details with usage instructions.',
      'Connect a reliable paid UK VPN before opening TikTok and keep it connected while uploading.',
    ],
    note: 'Monetization is not guaranteed — you must complete TikTok criteria and grow followers organically. Policy violations / bans are the client’s responsibility.',
  },
  {
    id: 'nordvpn-1m',
    name: 'NordVPN',
    category: 'social',
    duration: '1 Month',
    regularPrice: 600,
    price: 549,
    warranty: null,
    art: { from: '#1d4ed8', to: '#0ea5e9', glyph: 'Nv' },
    features: [
      'Premium NordVPN access.',
      'High-speed servers worldwide.',
      'Strict no-logs policy.',
      'Works on all your devices.',
    ],
    activation: [
      'We provide the login credentials.',
      'Sign in to the NordVPN app.',
      'Connect to any server and browse securely.',
    ],
  },
  {
    id: 'nordvpn-3m',
    name: 'NordVPN',
    category: 'social',
    duration: '3 Months',
    regularPrice: 1800,
    price: 1499,
    warranty: null,
    art: { from: '#1d4ed8', to: '#0ea5e9', glyph: 'Nv' },
    features: [
      'Premium NordVPN access for 3 months.',
      'High-speed servers worldwide.',
      'Strict no-logs policy.',
      'Works on all your devices.',
    ],
    activation: [
      'We provide the login credentials.',
      'Sign in to the NordVPN app.',
      'Connect to any server and browse securely.',
    ],
  },
  {
    id: 'udemy-1m',
    name: 'Udemy Personal Plan',
    category: 'social',
    duration: '1 Month',
    regularPrice: 1500,
    price: 999,
    warranty: null,
    noWarrantyNote: 'No warranty — buy at your own risk.',
    art: { from: '#7c2d12', to: '#b45309', glyph: 'Ud' },
    features: [
      'Udemy Personal Plan with full email access.',
      'Thousands of premium courses unlocked.',
      'Learn any skill at your own pace.',
    ],
    activation: [
      'We provide full email access for the account.',
      'Log in with the provided credentials.',
      'Start learning immediately.',
    ],
  },
];

/** "Rs. 1,499" */
export function formatPrice(n: number): string {
  return 'Rs. ' + n.toLocaleString('en-PK');
}

/** Products of one category, already ordered lowest → highest price. */
export function productsByCategory(cat: CategoryId): Product[] {
  return products.filter((p) => p.category === cat);
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export const WHATSAPP_NUMBER = '03493634347';
export const WHATSAPP_LINK = 'https://wa.me/923493634347';

export function whatsappOrderLink(product: Product): string {
  const text = `Assalam-o-Alaikum! I want to order "${product.name}" (${product.duration}) — ${formatPrice(product.price)}. Please share payment details.`;
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`;
}
