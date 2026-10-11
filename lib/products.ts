import { SEED_PRODUCTS } from './seed-catalog';

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
  /** struck-through regular price; null = not shown */
  regularPrice: number | null;
  /** discounted / current price; null = "Price on request" */
  price: number | null;
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
  /** units available; null = not tracked */
  stock: number | null;
  /** when true the product cannot be ordered */
  outOfStock: boolean;
  /** ordering within its category group */
  sortOrder: number;
  /** ISO timestamp of the last admin edit */
  updatedAt?: string;
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

/**
 * Static seed catalog. The storefront reads from the database when
 * configured (see lib/catalog.ts) and falls back to this array, so the
 * site always renders — even at build time without env vars.
 */
export const products: Product[] = SEED_PRODUCTS;

/** Products of one category from the static seed, ordered by sortOrder. */
export function productsByCategory(cat: CategoryId): Product[] {
  return products
    .filter((p) => p.category === cat)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** "Rs. 1,499.00" */
export function formatPrice(n: number): string {
  return (
    'Rs. ' +
    n.toLocaleString('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export const WHATSAPP_NUMBER = '03493634347';
export const WHATSAPP_LINK = 'https://wa.me/923493634347';

export function whatsappOrderLink(product: Product): string {
  const pricePart =
    product.price != null ? ` — ${formatPrice(product.price)}` : ' — price on request';
  const text = `Assalam-o-Alaikum! I want to order "${product.name}" (${product.duration})${pricePart}. Please share payment details.`;
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`;
}

/** Whether the product can be added to the cart. */
export function isOrderable(p: Product): boolean {
  return !p.outOfStock && p.price != null;
}
