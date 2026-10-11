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

/**
 * Equal-height product card: artwork, category eyebrow, name, duration,
 * price tag, warranty badge, and View Details / Add to Cart actions.
 * Out-of-stock products show a badge and a disabled cart button;
 * "price on request" products link straight to WhatsApp.
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

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl glass transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_0_35px_rgba(34,211,238,0.25)]">
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
      </button>

      <div className="flex grow flex-col gap-2 p-4">
        <p className="text-[10px] uppercase tracking-widest text-cyan-300/80">
          {categoryLabel(product.category)}
        </p>
        <h3 className="font-bold leading-snug">{product.name}</h3>
        <p className="text-xs text-slate-400">{product.duration}</p>

        <div>
          <PriceTag product={product} />
        </div>
        <div>
          <WarrantyBadge product={product} />
        </div>
        {product.stock != null && !product.outOfStock && (
          <p className="text-xs font-semibold text-emerald-300/90">
            {product.stock} {t('catalog.inStock')}
          </p>
        )}

        <div className="mt-auto flex gap-2 pt-3">
          <button
            type="button"
            onClick={() => onSelect(product)}
            className="btn-ghost flex-1 text-sm"
          >
            {t('catalog.viewDetails')}
          </button>
          {priceOnRequest ? (
            <a
              href={whatsappOrderLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 text-center text-sm"
            >
              {t('catalog.askWhatsapp')}
            </a>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={!orderable}
              className="btn-primary flex-1 text-sm disabled:cursor-not-allowed disabled:opacity-40"
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
    </article>
  );
}
