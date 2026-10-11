'use client';

import { useLanguage } from '@/lib/i18n';
import { formatPrice, type Product } from '@/lib/products';

interface PriceTagProps {
  product: Product;
}

/**
 * Red tilted PRICE tag with big discounted numerals.
 * When a regular price is higher, an overlapping yellow "Regular Price"
 * sticker shows the struck-through regular price.
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
    <div className="relative inline-block">
      {hasSticker && product.regularPrice != null && (
        <div className="absolute -top-3 -right-3 rotate-6 rounded-md bg-yellow-400 px-2 py-1 text-black shadow">
          <div className="text-[9px] font-bold uppercase tracking-wide">Regular Price</div>
          <div className="text-sm font-extrabold line-through">
            {formatPrice(product.regularPrice)}
          </div>
        </div>
      )}
      <div className="inline-block -rotate-3 rounded-lg bg-gradient-to-br from-red-500 to-red-700 px-4 py-2 shadow-lg">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
          Price
        </div>
        <div className="text-2xl font-extrabold text-white">{formatPrice(product.price)}</div>
      </div>
    </div>
  );
}
