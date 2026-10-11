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
 * Product catalog section: filter pills + category-grouped product grid,
 * with the product detail modal hosted here. Product data comes from the
 * database (via props) — never from a static list.
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
          <h2 className="grad-text text-center text-3xl font-extrabold sm:text-4xl">
            {t('catalog.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">{t('catalog.sub')}</p>
        </Reveal>

        {/* filter pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
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
                    ? 'rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 px-5 py-2 text-sm font-bold text-white shadow-lg'
                    : 'glass rounded-full px-5 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-white'
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
              {groups.map((g) => (
                <Reveal key={g.id}>
                  <h3 className="mb-5 text-xl font-bold">{categoryLabel(g.id)}</h3>
                  <ProductGrid products={ofCategory(g.id)} onSelect={setSelected} />
                </Reveal>
              ))}
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
