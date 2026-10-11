'use client';

import { useRef, useState } from 'react';
import { useCart } from '@/lib/cart';
import { useLanguage } from '@/lib/i18n';
import { categoryLabel, isOrderable, whatsappOrderLink, type Product } from '@/lib/products';
import PriceTag from './PriceTag';
import ProductArt from './ProductArt';
import WarrantyBadge from './WarrantyBadge';

interface ProductCardProps {
  product: Product;
  onSelect: (p: Product) => void;
}

/** Split "12 Months" into ["12", "Months"]; "Plan Access" into ["Plan Access", ""]. */
function splitSpec(text: string): [string, string] {
  const m = text.match(/^(\d+)\s*(.*)$/);
  if (m) return [m[1], m[2]];
  return [text, ''];
}

/**
 * Reference-style product card: banner artwork with a "View details" pill
 * overlay, category eyebrow + green warranty pill, bold title, two
 * translucent spec boxes, duration pill, green stock pill, red price box
 * with a rotated yellow regular-price sticker, and a gradient Add to cart
 * button. Data flow and cart behavior are unchanged.
 */
export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const orderable = isOrderable(product);
  const priceOnRequest = product.price == null && !product.outOfStock;

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1200);
  };

  // Spec box 1: token allowance for Muse AI, duration otherwise.
  const isMuseAi = product.id.startsWith('muse-ai');
  const [box1Value, box1Label] = isMuseAi
    ? ([product.name.includes('2 Billion') ? '2B' : '1B', 'TOKENS'] as [string, string])
    : (() => {
        const [v, l] = splitSpec(product.duration);
        return [v, l.toUpperCase()] as [string, string];
      })();

  // Spec box 2: warranty.
  const box2: [string, string] = product.warranty
    ? [
        String(product.warranty.value),
        product.warranty.unit === 'days'
          ? 'WARRANTY DAYS'
          : product.warranty.unit === 'years'
            ? 'WARRANTY YEARS'
            : 'WARRANTY MONTHS',
      ]
    : ['—', 'WARRANTY'];

  const blurb = product.features.slice(0, 2).join(', ');

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl glass transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.28)]">
      <button
        type="button"
        onClick={() => onSelect(product)}
        className="relative block w-full cursor-pointer"
        aria-label={t('catalog.viewDetails') + ': ' + product.name}
      >
        <ProductArt product={product} />
        {product.outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-lg">
            {t('catalog.outOfStock')}
          </span>
        )}
        <span className="absolute bottom-3 right-3 rounded-full border border-white/20 bg-black/55 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md">
          {t('catalog.viewDetails')}
        </span>
      </button>

      <div className="flex grow flex-col gap-2.5 p-5">
        {/* category eyebrow + warranty pill */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase leading-tight tracking-widest text-slate-400">
            {categoryLabel(product.category)}
          </p>
          <WarrantyBadge product={product} />
        </div>

        <h3 className="text-lg font-extrabold leading-snug text-white">{product.name}</h3>
        {blurb && <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">{blurb}</p>}

        {/* spec boxes */}
        <div className="grid grid-cols-2 gap-2">
          <div className="spec-box">
            <div className="text-xl font-extrabold text-white">{box1Value}</div>
            <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-200/80">
              {box1Label}
            </div>
          </div>
          <div className="spec-box">
            <div className="text-xl font-extrabold text-white">{box2[0]}</div>
            <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-200/80">
              {box2[1]}
            </div>
          </div>
        </div>

        {/* duration pill */}
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-xs font-semibold text-slate-300">
          {product.duration}
        </div>

        {/* stock pill */}
        {product.stock != null && !product.outOfStock && (
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/50 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {product.stock} {t('catalog.inStock')}
            </span>
          </div>
        )}

        {/* price + CTA */}
        <div className="mt-auto flex items-end gap-3 border-t border-white/10 pt-4">
          <PriceTag product={product} />
          <div className="flex-1">
            {priceOnRequest ? (
              <a
                href={whatsappOrderLink(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient-pill w-full !rounded-xl px-3 py-2.5 text-sm"
              >
                {t('catalog.askWhatsapp')}
              </a>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                disabled={!orderable}
                className="btn-gradient-pill w-full !rounded-xl px-3 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                aria-live="polite"
              >
                {product.outOfStock
                  ? t('catalog.outOfStock')
                  : added
                    ? t('catalog.added')
                    : t('catalog.addToCart')}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
