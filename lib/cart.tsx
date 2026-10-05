'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProduct, type Product } from './products';

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartCtx {
  items: CartItem[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
}

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = 'ath-cart';

function load(): { id: string; qty: number }[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { id: string; qty: number }[];
    return Array.isArray(parsed) ? parsed.filter((e) => typeof e.id === 'string') : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<{ id: string; qty: number }[]>([]);

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
      .map((e) => {
        const product = getProduct(e.id);
        return product ? { product, qty: Math.max(1, e.qty) } : null;
      })
      .filter((x): x is CartItem => x !== null);

    return {
      items,
      addItem: (id: string) =>
        setEntries((prev) => {
          const found = prev.find((e) => e.id === id);
          if (found) return prev.map((e) => (e.id === id ? { ...e, qty: e.qty + 1 } : e));
          return [...prev, { id, qty: 1 }];
        }),
      removeItem: (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id)),
      setQty: (id: string, qty: number) =>
        setEntries((prev) =>
          qty <= 0 ? prev.filter((e) => e.id !== id) : prev.map((e) => (e.id === id ? { ...e, qty } : e)),
        ),
      clear: () => setEntries([]),
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * i.product.price, 0),
    };
  }, [entries]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
