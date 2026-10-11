/**
 * Seed the Turso database with the canonical AI Tools HuB catalog.
 *
 * Usage:
 *   1. Create a free database at https://turso.tech (turso db create ai-tools-hub)
 *   2. Copy .env.example to .env and fill in TURSO_DATABASE_URL + TURSO_AUTH_TOKEN
 *      (turso db show <name> --url / turso db tokens create <name>)
 *   3. npx tsx scripts/seed.ts
 *
 * Safe to re-run: it clears the products table and re-inserts the seed catalog.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@libsql/client';
import { CREATE_PRODUCTS_TABLE_SQL, type NewProductRow } from '../lib/db';
import { SEED_PRODUCTS } from '../lib/seed-catalog';

// Minimal .env loader (no dotenv dependency needed)
function loadEnv() {
  const p = resolve(process.cwd(), '.env');
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      process.env[m[1]] = v;
    }
  }
}

function toRow(p: (typeof SEED_PRODUCTS)[number], now: string): NewProductRow {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    duration: p.duration,
    price: p.price,
    regularPrice: p.regularPrice,
    warrantyValue: p.warranty?.value ?? null,
    warrantyUnit: p.warranty?.unit ?? null,
    noWarrantyNote: p.noWarrantyNote ?? null,
    image: p.image ?? null,
    artFrom: p.art.from,
    artTo: p.art.to,
    artGlyph: p.art.glyph,
    features: JSON.stringify(p.features),
    activation: JSON.stringify(p.activation),
    note: p.note ?? null,
    stock: p.stock,
    outOfStock: p.outOfStock ? 1 : 0,
    sortOrder: p.sortOrder,
    updatedAt: now,
  };
}

async function main() {
  loadEnv();
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    console.error('Missing TURSO_DATABASE_URL. Copy .env.example to .env and fill it in.');
    process.exit(1);
  }
  const authToken = process.env.TURSO_AUTH_TOKEN;

  const client = createClient({ url, authToken });

  console.log('Creating products table (if needed)...');
  for (const stmt of CREATE_PRODUCTS_TABLE_SQL.split(';')) {
    const sql = stmt.trim();
    if (sql) await client.execute(sql);
  }

  console.log('Clearing old rows...');
  await client.execute('DELETE FROM products');

  const now = new Date().toISOString();
  console.log(`Inserting ${SEED_PRODUCTS.length} products...`);
  const insertSql = `INSERT INTO products
    (id, name, category, duration, price, regular_price, warranty_value, warranty_unit,
     no_warranty_note, image, art_from, art_to, art_glyph, features, activation,
     note, stock, out_of_stock, sort_order, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const nil = (v: string | number | null | undefined): string | number | null =>
    v === undefined ? null : v;
  for (const p of SEED_PRODUCTS) {
    const r = toRow(p, now);
    await client.execute(insertSql, [
      nil(r.id), nil(r.name), nil(r.category), nil(r.duration), nil(r.price),
      nil(r.regularPrice), nil(r.warrantyValue), nil(r.warrantyUnit),
      nil(r.noWarrantyNote), nil(r.image), nil(r.artFrom), nil(r.artTo),
      nil(r.artGlyph), nil(r.features), nil(r.activation), nil(r.note),
      nil(r.stock), nil(r.outOfStock), nil(r.sortOrder), nil(r.updatedAt),
    ]);
  }

  const count = await client.execute('SELECT COUNT(*) AS n FROM products');
  console.log(`Done. products table now has ${count.rows[0].n} rows.`);
  client.close();
}

main().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
