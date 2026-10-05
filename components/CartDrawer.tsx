'use client';

import { useCallback, useEffect, useState } from 'react';
import { useCart } from '../lib/cart';
import { useLanguage } from '../lib/i18n';
import { formatPrice } from '../lib/products';

export default function CartDrawer() {
  const { items, setQty, removeItem, count, total } = useCart();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('ath:open-cart', onOpen);
    return () => window.removeEventListener('ath:open-cart', onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open ]);

  const scrollTo = useCallback((selector: string) => {
    setOpen(false);
    window.setTimeout(() => {
      document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[79] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-label={t('cart.title')}
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-[80] w-[min(26rem,92vw)] transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col border-l border-white/10 bg-[#0b1020]/95 backdrop-blur-xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            {t('cart.title')}
            {count > 0 && (
              <span className="rounded-full bg-cyan-400/15 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
                {count}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-14 w-14 text-slate-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l2.4 12.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20.5 7H6" />
              <circle cx="9.5" cy="20" r="1.4" />
              <circle cx="17" cy="20" r="1.4" />
            </svg>
            <p className="text-slate-400">{t('cart.empty')}</p>
            <button type="button" onClick={() => scrollTo('#products')} className="btn-ghost">
              {t('cart.emptyCta')}
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <ul className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <li key={item.product.id} className="glass flex gap-3 rounded-2xl p-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center text-lg font-bold text-white"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${item.product.art.from}, ${item.product.art.to})`,
                        }}
                      >
                        {item.product.art.glyph}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.product.name}</p>
                    <p className="text-xs text-slate-400">{item.product.duration}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => setQty(item.product.id, item.qty - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-sm text-slate-300 transition hover:border-cyan-400/50 hover:text-white"
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold">{item.qty}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setQty(item.product.id, item.qty + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-sm text-slate-300 transition hover:border-cyan-400/50 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold text-cyan-300">
                        {formatPrice(item.qty * item.product.price)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="mt-1 text-xs text-red-400/80 transition hover:text-red-300 hover:underline"
                    >
                      {t('cart.remove')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="border-t border-white/10 px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-slate-400">{t('cart.total')}</span>
                <span className="text-xl font-bold">{formatPrice(total)}</span>
              </div>
              <button type="button" onClick={() => scrollTo('#checkout')} className="btn-primary w-full">
                {t('cart.checkout')}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
