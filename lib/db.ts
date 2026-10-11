import { createClient, type Client } from '@libsql/client';
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Turso (libsql) products table. Server-side only — never import from
 * client components. When TURSO_DATABASE_URL is missing, getDb() returns
 * null and callers fall back to the embedded seed catalog.
 */
export const productsTable = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  duration: text('duration').notNull(),
  price: integer('price'),
  regularPrice: integer('regular_price'),
  warrantyValue: integer('warranty_value'),
  warrantyUnit: text('warranty_unit'),
  noWarrantyNote: text('no_warranty_note'),
  image: text('image'),
  artFrom: text('art_from').notNull(),
  artTo: text('art_to').notNull(),
  artGlyph: text('art_glyph').notNull(),
  features: text('features').notNull(), // JSON string[]
  activation: text('activation').notNull(), // JSON string[]
  note: text('note'),
  stock: integer('stock'),
  outOfStock: integer('out_of_stock').notNull().default(0),
  sortOrder: integer('sort_order').notNull().default(0),
  updatedAt: text('updated_at'),
});

export type ProductRow = typeof productsTable.$inferSelect;
export type NewProductRow = typeof productsTable.$inferInsert;

let client: Client | null = null;

const schema = { productsTable };
export type AppDb = LibSQLDatabase<typeof schema>;

let db: AppDb | null = null;

function getClient(): Client | null {
  if (client) return client;
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) return null;
  client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return client;
}

/** Drizzle DB instance, or null when Turso is not configured. */
export function getDb(): AppDb | null {
  if (db) return db;
  const c = getClient();
  if (!c) return null;
  db = drizzle(c, { schema });
  return db;
}

/** Raw DDL used by scripts/seed.ts to create the table. */
export const CREATE_PRODUCTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  duration TEXT NOT NULL,
  price INTEGER,
  regular_price INTEGER,
  warranty_value INTEGER,
  warranty_unit TEXT,
  no_warranty_note TEXT,
  image TEXT,
  art_from TEXT NOT NULL,
  art_to TEXT NOT NULL,
  art_glyph TEXT NOT NULL,
  features TEXT NOT NULL,
  activation TEXT NOT NULL,
  note TEXT,
  stock INTEGER,
  out_of_stock INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category, sort_order);
`;
