'use client';

import { useLanguage } from '@/lib/i18n';
import type { Product } from '@/lib/products';

interface WarrantyBadgeProps {
  product: Product;
}

/**
 * Teal pill with checkmark for replacement warranty;
 * amber warning pill when the product carries a no-warranty note;
 * null otherwise.
 */
export default function WarrantyBadge({ product }: WarrantyBadgeProps) {
  const { warrantyLabel } = useLanguage();

  if (product.warranty) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/60 bg-teal-400/10 px-3 py-1 text-xs font-bold text-teal-300">
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12.5 2.5 2.5 4.5-5" />
        </svg>
        {warrantyLabel(product.warranty)}
      </span>
    );
  }

  if (product.noWarrantyNote) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/60 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3 2.5 20h19L12 3Z" />
          <path d="M12 9v4" />
          <circle cx="12" cy="16.8" r="0.6" fill="currentColor" stroke="none" />
        </svg>
        {product.noWarrantyNote}
      </span>
    );
  }

  return null;
}
