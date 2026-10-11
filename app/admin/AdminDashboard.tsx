'use client';

import { useMemo, useState } from 'react';
import { categoryLabel, formatPrice, type CategoryId, type Product } from '@/lib/products';
import { bannerFor } from '@/lib/banners';
import { adminLogout, deleteProduct, saveProduct } from './actions';

const inputCls =
  'w-full rounded-xl border border-white/15 bg-[#0a0f24] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20 placeholder:text-slate-500';
const labelCls = 'block text-[11px] font-bold uppercase tracking-wider text-slate-400';
const sectionCls = 'rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5';
const sectionTitleCls = 'mb-4 flex items-center gap-2 text-sm font-extrabold text-white';

type Draft = { [k: string]: string };

function toDraft(p: Product): Draft {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    duration: p.duration,
    price: p.price != null ? String(p.price) : '',
    regularPrice: p.regularPrice != null ? String(p.regularPrice) : '',
    stock: p.stock != null ? String(p.stock) : '',
    warrantyValue: p.warranty ? String(p.warranty.value) : '',
    warrantyUnit: p.warranty ? p.warranty.unit : 'days',
    noWarrantyNote: p.noWarrantyNote ?? '',
    outOfStock: p.outOfStock ? 'on' : '',
    note: p.note ?? '',
    features: p.features.join('\n'),
    activation: p.activation.join('\n'),
    image: p.image ?? '',
    artFrom: p.art.from,
    artTo: p.art.to,
    artGlyph: p.art.glyph,
    sortOrder: String(p.sortOrder),
  };
}

const blankDraft = (): Draft => ({
  id: '',
  name: '',
  category: 'ai',
  duration: '1 Month',
  price: '',
  regularPrice: '',
  stock: '',
  warrantyValue: '',
  warrantyUnit: 'days',
  noWarrantyNote: '',
  outOfStock: '',
  note: '',
  features: '',
  activation: '',
  image: '',
  artFrom: '#7c3aed',
  artTo: '#06b6d4',
  artGlyph: 'NA',
  sortOrder: '99',
});

const CATS: CategoryId[] = ['ai', 'video', 'design', 'social', 'creator'];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {hint && <span className="mt-0.5 block text-[11px] text-slate-500">{hint}</span>}
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

function ProductForm({ initial, onDone }: { initial: Draft; onDone: () => void }) {
  const [draft, setDraft] = useState<Draft>(initial);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (v: string) => setDraft((d) => ({ ...d, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData();
    for (const [k, v] of Object.entries(draft)) fd.set(k, v);
    if (!draft.outOfStock) fd.delete('outOfStock');
    const res = await saveProduct(fd);
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? 'Save failed.');
      return;
    }
    onDone();
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4">
      {/* Basic info */}
      <div className={sectionCls}>
        <p className={sectionTitleCls}><span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/20 text-xs">1</span> Basic info</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Product name">
              <input className={inputCls} value={draft.name} onChange={(e) => set('name')(e.target.value)} required placeholder="e.g. Canva Pro" />
            </Field>
          </div>
          <Field label="Category">
            <select className={inputCls} value={draft.category} onChange={(e) => set('category')(e.target.value)}>
              {CATS.map((c) => (
                <option key={c} value={c}>{categoryLabel(c)}</option>
              ))}
            </select>
          </Field>
          <Field label="Duration">
            <input className={inputCls} value={draft.duration} onChange={(e) => set('duration')(e.target.value)} placeholder="1 Month" />
          </Field>
          <Field label="Sort order" hint="Lower shows first">
            <input className={inputCls} inputMode="numeric" value={draft.sortOrder} onChange={(e) => set('sortOrder')(e.target.value)} />
          </Field>
          <Field label="Image path" hint="Leave empty to use the category banner">
            <input className={inputCls} value={draft.image} onChange={(e) => set('image')(e.target.value)} placeholder="/images/banners/..." />
          </Field>
        </div>
      </div>

      {/* Pricing & stock */}
      <div className={sectionCls}>
        <p className={sectionTitleCls}><span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-xs">2</span> Pricing & stock</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Price (Rs)" hint="Empty = price on request">
            <input className={inputCls} inputMode="numeric" value={draft.price} onChange={(e) => set('price')(e.target.value)} placeholder="1499" />
          </Field>
          <Field label="Regular price (Rs)" hint="Struck-through original">
            <input className={inputCls} inputMode="numeric" value={draft.regularPrice} onChange={(e) => set('regularPrice')(e.target.value)} placeholder="1999" />
          </Field>
          <Field label="Stock" hint="Empty = not tracked">
            <input className={inputCls} inputMode="numeric" value={draft.stock} onChange={(e) => set('stock')(e.target.value)} placeholder="50" />
          </Field>
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <input
            type="checkbox"
            checked={draft.outOfStock === 'on'}
            onChange={(e) => set('outOfStock')(e.target.checked ? 'on' : '')}
            className="h-5 w-5 accent-red-500"
          />
          <span className="text-sm font-bold text-red-300">Out of stock <span className="font-normal text-red-300/70">— customers cannot order</span></span>
        </label>
      </div>

      {/* Warranty */}
      <div className={sectionCls}>
        <p className={sectionTitleCls}><span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/20 text-xs">3</span> Warranty</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Warranty value" hint="Empty = no warranty">
            <input className={inputCls} inputMode="numeric" value={draft.warrantyValue} onChange={(e) => set('warrantyValue')(e.target.value)} placeholder="15" />
          </Field>
          <Field label="Warranty unit">
            <select className={inputCls} value={draft.warrantyUnit} onChange={(e) => set('warrantyUnit')(e.target.value)}>
              <option value="days">days</option>
              <option value="months">months</option>
              <option value="years">years</option>
            </select>
          </Field>
        </div>
        <div className="mt-4">
          <Field label="No-warranty note" hint="Shown instead of the warranty badge">
            <input className={inputCls} value={draft.noWarrantyNote} onChange={(e) => set('noWarrantyNote')(e.target.value)} placeholder="No Replacement Warranty." />
          </Field>
        </div>
      </div>

      {/* Content */}
      <div className={sectionCls}>
        <p className={sectionTitleCls}><span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-xs">4</span> Content</p>
        <div className="space-y-4">
          <Field label="Features" hint="One per line — shown on the product card and details">
            <textarea className={inputCls} rows={4} value={draft.features} onChange={(e) => set('features')(e.target.value)} />
          </Field>
          <Field label="Activation steps" hint="One per line">
            <textarea className={inputCls} rows={3} value={draft.activation} onChange={(e) => set('activation')(e.target.value)} />
          </Field>
          <Field label="Note" hint="Amber callout on the product page">
            <input className={inputCls} value={draft.note} onChange={(e) => set('note')(e.target.value)} />
          </Field>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">{error}</p>
      )}

      <div className="flex gap-3 pb-2">
        <button type="submit" disabled={busy} className="btn-primary flex-1 py-3 disabled:opacity-50">
          {busy ? 'Saving…' : 'Save product'}
        </button>
        <button type="button" onClick={onDone} className="btn-ghost px-6 py-3">
          Cancel
        </button>
      </div>
    </form>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-black ${accent}`}>{value}</p>
    </div>
  );
}

function Thumb({ p }: { p: Product }) {
  const src = p.image || bannerFor(p.id);
  if (!src) {
    return (
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-black text-white"
        style={{ backgroundImage: `linear-gradient(135deg, ${p.art.from}, ${p.art.to})` }}
      >
        {p.art.glyph}
      </div>
    );
  }
  return <img src={src} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" loading="lazy" />;
}

export default function AdminDashboard({ products }: { products: Product[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState<'all' | CategoryId>('all');

  const stats = useMemo(() => {
    const out = products.filter((p) => p.outOfStock).length;
    const low = products.filter((p) => !p.outOfStock && p.stock != null && p.stock <= 10).length;
    const cats = new Set(products.map((p) => p.category)).size;
    return { total: products.length, out, low, cats };
  }, [products]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => (catFilter === 'all' ? true : p.category === catFilter))
      .filter((p) => (q ? `${p.name} ${p.id}`.toLowerCase().includes(q) : true))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [products, query, catFilter]);

  async function onDelete(id: string) {
    if (!window.confirm('Delete this product permanently?')) return;
    setDeleting(id);
    const res = await deleteProduct(id);
    setDeleting(null);
    if (!res.ok) window.alert(res.error ?? 'Delete failed.');
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="AI Tools HuB" className="h-11 w-11 rounded-2xl object-cover" />
          <div>
            <h1 className="text-xl font-black sm:text-2xl">Store Admin</h1>
            <p className="text-xs text-slate-400 sm:text-sm">AI Tools HuB · changes go live instantly</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-ghost px-4 py-2 text-sm">
            View site
          </a>
          <button type="button" onClick={() => adminLogout()} className="btn-ghost px-4 py-2 text-sm">
            Log out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Products" value={stats.total} accent="text-white" />
        <StatCard label="Categories" value={stats.cats} accent="text-violet-300" />
        <StatCard label="Out of stock" value={stats.out} accent={stats.out ? 'text-red-300' : 'text-white'} />
        <StatCard label="Low stock ≤10" value={stats.low} accent={stats.low ? 'text-amber-300' : 'text-white'} />
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className={`${inputCls} pl-10`}
          />
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
          </svg>
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value as 'all' | CategoryId)} className={`${inputCls} sm:w-48`}>
          <option value="all">All categories</option>
          {CATS.map((c) => (
            <option key={c} value={c}>{categoryLabel(c)}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setEditing(editing === 'new' ? null : 'new')}
          className="btn-primary whitespace-nowrap px-5 py-2.5 text-sm"
        >
          {editing === 'new' ? 'Close form' : '+ Add product'}
        </button>
      </div>

      {editing === 'new' && (
        <div className="glass mt-4 rounded-3xl p-4 sm:p-6">
          <h2 className="text-lg font-extrabold">New product</h2>
          <ProductForm initial={blankDraft()} onDone={() => setEditing(null)} />
        </div>
      )}

      {/* Product list */}
      <div className="mt-4 overflow-hidden rounded-3xl border border-white/10">
        {visible.length === 0 && (
          <p className="px-6 py-12 text-center text-sm text-slate-400">No products match your search.</p>
        )}
        <ul className="divide-y divide-white/10">
          {visible.map((p) => (
            <li key={p.id} className="bg-white/[0.02] transition hover:bg-white/[0.05]">
              <div className="flex items-center gap-4 px-4 py-3 sm:px-5">
                <Thumb p={p} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-bold text-white">{p.name}</p>
                    {p.outOfStock ? (
                      <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-300">Out of stock</span>
                    ) : p.stock != null && p.stock <= 10 ? (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300">Low stock</span>
                    ) : null}
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-400">
                    {categoryLabel(p.category)} · {p.duration} ·{' '}
                    <span className="font-semibold text-slate-200">{p.price != null ? formatPrice(p.price) : 'Price on request'}</span>
                    {p.regularPrice != null && p.price != null && p.regularPrice > p.price && (
                      <span className="ml-1.5 text-slate-500 line-through">{formatPrice(p.regularPrice)}</span>
                    )}
                    {p.stock != null && <span className="ml-1.5">· {p.stock} in stock</span>}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(editing === p.id ? null : p.id)}
                    className="rounded-xl border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-200 transition hover:bg-violet-500/20"
                  >
                    {editing === p.id ? 'Close' : 'Edit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(p.id)}
                    disabled={deleting === p.id}
                    className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                  >
                    {deleting === p.id ? '…' : 'Delete'}
                  </button>
                </div>
              </div>
              {editing === p.id && (
                <div className="border-t border-white/10 px-4 py-2 sm:px-5">
                  <ProductForm initial={toDraft(p)} onDone={() => setEditing(null)} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        {visible.length} of {products.length} products · Edits publish to the live site immediately
      </p>
    </div>
  );
}
