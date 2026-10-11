'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { categories, categoryLabel, type CategoryId, type Product } from '@/lib/products';
import ProductGrid from './ProductGrid';
import ProductModal from './ProductModal';
import Reveal from './Reveal';

type Filter = CategoryId | 'all';

interface CatalogSectionProps {
  products: Product[];
}

/**
 * Product catalog section: reference-style header (eyebrow pill, huge
 * headline, price note, category filter pills) plus category-grouped
 * product grids with "{n} plans · low to high" labels. Product data comes
 * from the database (via props) — never from a static list.
 */
export default function CatalogSection({ products }: CatalogSectionProps) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Product | null>(null);

  const groups = categories.filter(
    (c): c is { id: CategoryId; label: string } => c.id !== 'all',
  );

  const ofCategory = (cat: CategoryId): Product[] =>
    products
      .filter((p) => p.category === cat)
      .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section id="products" className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <span className="glass inline-block rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200">
            {t('catalog.eyebrow')}
          </span>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="text-5xl font-black tracking-tight text-white md:text-6xl">
              {t('catalog.headline')}
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-slate-400">
              {t('catalog.note')}
            </p>
          </div>
        </Reveal>

        {/* filter pills */}
        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((c) => {
            const active = filter === c.id;
            const label = c.id === 'all' ? t('catalog.all') : categoryLabel(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                className={
                  active
                    ? 'rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-5 py-2 text-sm font-bold text-white shadow-lg'
                    : 'glass rounded-full px-5 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-blue-400/40 hover:text-white'
                }
                aria-pressed={active}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* grids */}
        <div className="mt-10">
          {filter === 'all' ? (
            <div className="flex flex-col gap-14">
              {groups.map((g) => {
                const items = ofCategory(g.id);
                if (items.length === 0) return null;
                return (
                  <Reveal key={g.id}>
                    <div className="mb-5 flex items-baseline justify-between border-b border-white/10 pb-3">
                      <h3 className="text-2xl font-extrabold text-white">
                        {categoryLabel(g.id)}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {items.length} {t('catalog.plansCount')}
                      </p>
                    </div>
                    <ProductGrid products={items} onSelect={setSelected} />
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <ProductGrid products={ofCategory(filter)} onSelect={setSelected} />
          )}
        </div>
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
