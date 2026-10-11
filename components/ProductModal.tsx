'use client';

import { useEffect } from 'react';
import { useCart } from '@/lib/cart';
import { useLanguage } from '@/lib/i18n';
import { whatsappOrderLink, isOrderable, type Product } from '@/lib/products';
import PriceTag from './PriceTag';
import ProductArt from './ProductArt';
import WarrantyBadge from './WarrantyBadge';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

/**
 * Product detail dialog: artwork header, price, warranty, features,
 * activation steps, notes, claim guidance, and WhatsApp / cart actions.
 * Renders nothing when no product is selected.
 */
export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { t, warrantyLabel } = useLanguage();
  const { addItem } = useCart();

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [product, onClose]);

  if (!product) return null;

  const showClaim = product.warranty !== null;
  const orderable = isOrderable(product);
  const priceOnRequest = product.price == null && !product.outOfStock;

  return (
    <div className="fixed inset-0 z-[70] flex" role="dialog" aria-modal="true" aria-label={product.name}>
      {/* backdrop */}
      <button
        type="button"
        onClick={onClose}
        aria-label={t('modal.close')}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />

      <div className="relative m-auto max-h-[90vh] w-[min(48rem,92vw)] overflow-y-auto rounded-2xl glass">
        <ProductArt product={product} className="!aspect-auto h-52" />

        <div className="flex flex-col gap-5 p-6">
          {/* header */}
          <div>
            <h2 className="text-2xl font-extrabold">{product.name}</h2>
            <p className="mt-1 text-sm text-slate-400">
              {t('modal.duration')}: {product.duration}
            </p>
          </div>

          {/* price + warranty */}
          <div className="flex flex-wrap items-center gap-4">
            <PriceTag product={product} />
            <WarrantyBadge product={product} />
            {product.outOfStock && (
              <span className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white">
                {t('catalog.outOfStock')}
              </span>
            )}
          </div>
          {product.stock != null && !product.outOfStock && (
            <p className="text-sm font-semibold text-emerald-300/90">
              {product.stock} {t('catalog.inStock')}
            </p>
          )}

          {/* features */}
          <section>
            <h3 className="mb-2 text-lg font-bold">{t('modal.features')}</h3>
            <ul className="flex flex-col gap-1.5 text-sm text-slate-200">
              {product.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckIcon />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* activation */}
          <section>
            <h3 className="mb-2 text-lg font-bold">{t('modal.activation')}</h3>
            <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm text-slate-200">
              {product.activation.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>

          {/* note callout */}
          {product.note && (
            <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-200 glass">
              {product.note}
            </div>
          )}

          {/* warranty claim guidance */}
          {showClaim && product.warranty && (
            <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm glass">
              <h4 className="mb-1 font-bold text-emerald-200">{t('modal.claimTitle')}</h4>
              <p className="text-slate-300">
                {t('modal.claimText')}
                <span className="mt-1 block font-semibold text-emerald-300">
                  {warrantyLabel(product.warranty)}
                </span>
              </p>
            </div>
          )}

          {/* actions */}
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href={whatsappOrderLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp flex-1 text-center text-sm"
            >
              {priceOnRequest ? t('catalog.askWhatsapp') : t('modal.orderWhatsapp')}
            </a>
            {!priceOnRequest && (
              <button
                type="button"
                onClick={() => addItem(product)}
                disabled={!orderable}
                className="btn-primary flex-1 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                {product.outOfStock ? t('catalog.outOfStock') : t('catalog.addToCart')}
              </button>
            )}
            <button type="button" onClick={onClose} className="btn-ghost text-sm">
              {t('modal.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
