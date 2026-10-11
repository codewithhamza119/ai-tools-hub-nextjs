'use client';

import { useState } from 'react';
import { formatPrice, type CategoryId, type Product } from '@/lib/products';
import { adminLogout, deleteProduct, saveProduct } from './actions';

const inputCls =
  'w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/60';
const labelCls = 'block text-xs font-semibold uppercase tracking-wide text-slate-400';

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

function ProductForm({
  initial,
  onDone,
}: {
  initial: Draft;
  onDone: () => void;
}) {
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
    // checkbox convention: presence of 'on' means checked
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
    <form onSubmit={onSubmit} className="glass mt-3 rounded-2xl p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>
            Name
            <input className={inputCls} value={draft.name} onChange={(e) => set('name')(e.target.value)} required />
          </label>
        </div>
        <div>
          <label className={labelCls}>
            Category
            <select className={inputCls} value={draft.category} onChange={(e) => set('category')(e.target.value)}>
              {(['ai', 'video', 'design', 'social'] as CategoryId[]).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label className={labelCls}>
            Duration
            <input className={inputCls} value={draft.duration} onChange={(e) => set('duration')(e.target.value)} />
          </label>
        </div>
        <div>
          <label className={labelCls}>
            Price (Rs) — empty = on request
            <input className={inputCls} inputMode="numeric" value={draft.price} onChange={(e) => set('price')(e.target.value)} />
          </label>
        </div>
        <div>
          <label className={labelCls}>
            Regular price (Rs)
            <input className={inputCls} inputMode="numeric" value={draft.regularPrice} onChange={(e) => set('regularPrice')(e.target.value)} />
          </label>
        </div>
        <div>
          <label className={labelCls}>
            Stock — empty = not tracked
            <input className={inputCls} inputMode="numeric" value={draft.stock} onChange={(e) => set('stock')(e.target.value)} />
          </label>
        </div>
        <div>
          <label className={labelCls}>
            Sort order
            <input className={inputCls} inputMode="numeric" value={draft.sortOrder} onChange={(e) => set('sortOrder')(e.target.value)} />
          </label>
        </div>
        <div>
          <label className={labelCls}>
            Warranty value — empty = none
            <input className={inputCls} inputMode="numeric" value={draft.warrantyValue} onChange={(e) => set('warrantyValue')(e.target.value)} />
          </label>
        </div>
        <div>
          <label className={labelCls}>
            Warranty unit
            <select className={inputCls} value={draft.warrantyUnit} onChange={(e) => set('warrantyUnit')(e.target.value)}>
              <option value="days">days</option>
              <option value="months">months</option>
            </select>
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>
            No-warranty note (shown instead of warranty badge)
            <input className={inputCls} value={draft.noWarrantyNote} onChange={(e) => set('noWarrantyNote')(e.target.value)} />
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>
            Note (amber callout)
            <input className={inputCls} value={draft.note} onChange={(e) => set('note')(e.target.value)} />
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>
            Features (one per line)
            <textarea className={inputCls} rows={4} value={draft.features} onChange={(e) => set('features')(e.target.value)} />
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>
            Activation steps (one per line)
            <textarea className={inputCls} rows={3} value={draft.activation} onChange={(e) => set('activation')(e.target.value)} />
          </label>
        </div>
        <div>
          <label className={labelCls}>
            Image path (optional)
            <input className={inputCls} value={draft.image} onChange={(e) => set('image')(e.target.value)} placeholder="/images/xyz.jpg" />
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <label className={labelCls}>
            Art from
            <input className={inputCls} value={draft.artFrom} onChange={(e) => set('artFrom')(e.target.value)} />
          </label>
          <label className={labelCls}>
            Art to
            <input className={inputCls} value={draft.artTo} onChange={(e) => set('artTo')(e.target.value)} />
          </label>
          <label className={labelCls}>
            Glyph
            <input className={inputCls} value={draft.artGlyph} onChange={(e) => set('artGlyph')(e.target.value)} />
          </label>
        </div>
        <label className="flex items-center gap-3 rounded-xl border border-white/15 bg-black/30 px-3 py-2.5 sm:col-span-2">
          <input
            type="checkbox"
            checked={draft.outOfStock === 'on'}
            onChange={(e) => set('outOfStock')(e.target.checked ? 'on' : '')}
            className="h-5 w-5 accent-red-500"
          />
          <span className="text-sm font-bold text-red-300">Out of stock (cannot be ordered)</span>
        </label>
      </div>
      {error && <p className="mt-3 text-sm font-semibold text-red-400">{error}</p>}
      <div className="mt-4 flex gap-2">
        <button type="submit" disabled={busy} className="btn-primary flex-1 py-2.5 disabled:opacity-50">
          {busy ? 'Saving…' : 'Save'}
        </button>
        <button type="button" onClick={onDone} className="btn-ghost px-5 py-2.5">
          Cancel
        </button>
      </div>
    </form>
  );
}

function fmtUpdated(iso?: string): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

export default function AdminDashboard({ products }: { products: Product[] }) {
  const [editing, setEditing] = useState<string | null>(null); // product id or 'new'
  const [deleting, setDeleting] = useState<string | null>(null);

  async function onDelete(id: string) {
    if (!window.confirm('Delete this product permanently?')) return;
    setDeleting(id);
    const res = await deleteProduct(id);
    setDeleting(null);
    if (!res.ok) window.alert(res.error ?? 'Delete failed.');
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Products</h1>
          <p className="text-sm text-slate-400">{products.length} products · edits go live instantly</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditing(editing === 'new' ? null : 'new')}
            className="btn-primary px-4 py-2 text-sm"
          >
            + Add
          </button>
          <button type="button" onClick={() => adminLogout()} className="btn-ghost px-4 py-2 text-sm">
            Log out
          </button>
        </div>
      </div>

      {editing === 'new' && (
        <ProductForm initial={blankDraft()} onDone={() => setEditing(null)} />
      )}

      <ul className="mt-6 space-y-3">
        {products.map((p) => (
          <li key={p.id} className="glass rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-bold">{p.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {p.category} · {p.duration} ·{' '}
                  {p.price != null ? formatPrice(p.price) : 'price on request'}
                  {p.stock != null && ` · stock ${p.stock}`}
                  {p.outOfStock && ' · OUT OF STOCK'}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">Updated: {fmtUpdated(p.updatedAt)}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(editing === p.id ? null : p.id)}
                  className="btn-ghost px-3 py-1.5 text-xs"
                >
                  {editing === p.id ? 'Close' : 'Edit'}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(p.id)}
                  disabled={deleting === p.id}
                  className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300 disabled:opacity-50"
                >
                  {deleting === p.id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
            {editing === p.id && (
              <ProductForm initial={toDraft(p)} onDone={() => setEditing(null)} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
