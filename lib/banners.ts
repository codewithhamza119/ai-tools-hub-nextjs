/**
 * Banner artwork per product family, matched by product id prefix.
 * Falls back to null (gradient monogram) when nothing matches.
 */
const BANNERS: { prefix: string; src: string }[] = [
  { prefix: 'muse-ai', src: '/images/banners/muse-ai.jpg' },
  { prefix: 'gemini', src: '/images/banners/gemini.jpg' },
  { prefix: 'chatgpt', src: '/images/banners/chatgpt.jpg' },
  { prefix: 'capcut', src: '/images/banners/capcut.jpg' },
  { prefix: 'figma', src: '/images/banners/design.jpg' },
  { prefix: 'nord', src: '/images/banners/vpn.jpg' },
  { prefix: 'surfshark', src: '/images/banners/surfshark.png' },
  { prefix: 'udemy', src: '/images/banners/learning.jpg' },
];

export function bannerFor(productId: string): string | null {
  const hit = BANNERS.find((b) => productId.startsWith(b.prefix));
  return hit ? hit.src : null;
}
