'use client';

import { useLanguage } from '@/lib/i18n';
import { formatPrice, type Product } from '@/lib/products';

interface PriceTagProps {
  product: Product;
}

/**
 * Red tilted PRICE box with big white numerals.
 * When a regular price is higher, a rotated yellow "REGULAR PRICE" sticky
 * note overlaps the top-right showing the struck-through regular price.
 * When the product has no set price, a "Price on request" pill is shown.
 */
export default function PriceTag({ product }: PriceTagProps) {
  const { t } = useLanguage();

  if (product.price == null) {
    return (
      <span className="inline-block rounded-lg border border-slate-400/30 bg-slate-500/15 px-4 py-2 text-sm font-bold text-slate-200">
        {t('catalog.priceOnRequest')}
      </span>
    );
  }

  const hasSticker = product.regularPrice != null && product.regularPrice > product.price;

  return (
    <div className="relative inline-block shrink-0">
      {hasSticker && product.regularPrice != null && (
        <div className="absolute -top-4 right-1 z-10 rotate-6 rounded-md bg-yellow-400 px-2 py-1 text-black shadow-lg">
          <div className="text-[8px] font-extrabold uppercase leading-none tracking-wide">
            Regular Price
          </div>
          <div className="text-sm font-extrabold leading-tight line-through">
            {formatPrice(product.regularPrice)}
          </div>
        </div>
      )}
      <div className="inline-block -rotate-2 rounded-xl bg-gradient-to-br from-red-500 to-red-700 px-4 py-2 shadow-[0_6px_20px_rgba(239,68,68,0.4)]">
        <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/75">
          Price
        </div>
        <div className="whitespace-nowrap text-2xl font-extrabold text-white">
          {formatPrice(product.price)}
        </div>
      </div>
    </div>
  );
}
