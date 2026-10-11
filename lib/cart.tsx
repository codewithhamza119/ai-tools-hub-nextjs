'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProduct, isOrderable, type Product } from './products';

export interface CartItem {
  product: Product;
  qty: number;
}

interface StoredEntry {
  id: string;
  qty: number;
  /** product snapshot at add-time; older carts only have id+qty */
  snapshot?: Product;
}

interface CartCtx {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
}

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = 'ath-cart';

function load(): StoredEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredEntry[];
    return Array.isArray(parsed) ? parsed.filter((e) => typeof e.id === 'string') : [];
  } catch {
    return [];
  }
}

/** Resolve a stored entry to a cart item (migrates legacy id-only entries). */
function resolveEntry(e: StoredEntry): CartItem | null {
  const qty = Math.max(1, e.qty || 1);
  if (e.snapshot && isOrderable(e.snapshot)) return { product: e.snapshot, qty };
  const legacy = getProduct(e.id);
  if (legacy && isOrderable(legacy)) return { product: legacy, qty };
  return null;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<StoredEntry[]>([]);

  useEffect(() => {
    setEntries(load());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* ignore */
    }
  }, [entries]);

  const value = useMemo<CartCtx>(() => {
    const items: CartItem[] = entries
      .map(resolveEntry)
      .filter((x): x is CartItem => x !== null);

    return {
      items,
      addItem: (product: Product) => {
        if (!isOrderable(product)) return;
        setEntries((prev) => {
          const found = prev.find((e) => e.id === product.id);
          if (found)
            return prev.map((e) =>
              e.id === product.id ? { ...e, qty: e.qty + 1, snapshot: product } : e,
            );
          return [...prev, { id: product.id, qty: 1, snapshot: product }];
        });
      },
      removeItem: (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id)),
      setQty: (id: string, qty: number) =>
        setEntries((prev) =>
          qty <= 0 ? prev.filter((e) => e.id !== id) : prev.map((e) => (e.id === id ? { ...e, qty } : e)),
        ),
      clear: () => setEntries([]),
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * (i.product.price ?? 0), 0),
    };
  }, [entries]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
