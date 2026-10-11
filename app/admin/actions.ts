'use server';

import { createHmac, timingSafeEqual } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { getDb, productsTable, type NewProductRow } from '@/lib/db';

const COOKIE_NAME = 'ath_admin';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function expectedCookieValue(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHmac('sha256', pw).update('ai-tools-hub-admin').digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/** True when the request carries a valid admin cookie. */
export async function isAdminAuthed(): Promise<boolean> {
  const expected = expectedCookieValue();
  if (!expected) return false;
  const val = cookies().get(COOKIE_NAME)?.value;
  return !!val && safeEqual(val, expected);
}

async function requireAdmin() {
  if (!(await isAdminAuthed())) throw new Error('Not authorized');
  const db = getDb();
  if (!db) throw new Error('Database not configured — set TURSO_DATABASE_URL.');
  return db;
}

export async function adminLogin(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return { ok: false, error: 'ADMIN_PASSWORD is not set on the server.' };
  const input = String(formData.get('password') ?? '');
  if (!safeEqual(input, pw)) return { ok: false, error: 'Wrong password.' };
  const expected = expectedCookieValue();
  if (!expected) return { ok: false, error: 'ADMIN_PASSWORD is not set on the server.' };
  cookies().set(COOKIE_NAME, expected, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
  return { ok: true };
}

export async function adminLogout(): Promise<void> {
  cookies().delete(COOKIE_NAME);
  redirect('/admin');
}

const numOrNull = (v: FormDataEntryValue | null): number | null => {
  if (v == null) return null;
  const s = String(v).trim();
  if (s === '') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

const strOrNull = (v: FormDataEntryValue | null): string | null => {
  if (v == null) return null;
  const s = String(v).trim();
  return s === '' ? null : s;
};

const listFromTextarea = (v: FormDataEntryValue | null): string[] =>
  String(v ?? '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || `product-${Date.now()}`
  );
}

export async function saveProduct(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  let db;
  try {
    db = await requireAdmin();
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Not authorized' };
  }

  const rawId = strOrNull(formData.get('id'));
  const name = strOrNull(formData.get('name'));
  if (!name) return { ok: false, error: 'Name is required.' };
  const id = rawId ?? `${slugify(name)}-${Date.now().toString(36)}`;

  const warrantyValue = numOrNull(formData.get('warrantyValue'));
  const warrantyUnitRaw = strOrNull(formData.get('warrantyUnit'));
  const warrantyUnit =
    warrantyValue != null && (warrantyUnitRaw === 'days' || warrantyUnitRaw === 'months')
      ? warrantyUnitRaw
      : null;

  const row: NewProductRow = {
    id,
    name,
    category: strOrNull(formData.get('category')) ?? 'ai',
    duration: strOrNull(formData.get('duration')) ?? 'Plan Access',
    price: numOrNull(formData.get('price')),
    regularPrice: numOrNull(formData.get('regularPrice')),
    warrantyValue: warrantyUnit ? warrantyValue : null,
    warrantyUnit,
    noWarrantyNote: strOrNull(formData.get('noWarrantyNote')),
    image: strOrNull(formData.get('image')),
    artFrom: strOrNull(formData.get('artFrom')) ?? '#7c3aed',
    artTo: strOrNull(formData.get('artTo')) ?? '#06b6d4',
    artGlyph: strOrNull(formData.get('artGlyph')) ?? name.slice(0, 2),
    features: JSON.stringify(listFromTextarea(formData.get('features'))),
    activation: JSON.stringify(listFromTextarea(formData.get('activation'))),
    note: strOrNull(formData.get('note')),
    stock: numOrNull(formData.get('stock')),
    outOfStock: formData.get('outOfStock') === 'on' ? 1 : 0,
    sortOrder: numOrNull(formData.get('sortOrder')) ?? 0,
    updatedAt: new Date().toISOString(),
  };

  try {
    await db
      .insert(productsTable)
      .values(row)
      .onConflictDoUpdate({ target: productsTable.id, set: row });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed.' };
  }

  revalidatePath('/');
  revalidatePath('/admin');
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<{ ok: boolean; error?: string }> {
  let db;
  try {
    db = await requireAdmin();
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Not authorized' };
  }
  try {
    await db.delete(productsTable).where(eq(productsTable.id, id));
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Delete failed.' };
  }
  revalidatePath('/');
  revalidatePath('/admin');
  return { ok: true };
}
