import { asc } from 'drizzle-orm';
import { getDb, productsTable, type ProductRow } from './db';
import { categories, type CategoryId, type Product } from './products';
import { SEED_PRODUCTS } from './seed-catalog';

/**
 * Server-side catalog access. Reads from Turso when configured,
 * otherwise falls back to the embedded seed catalog so the site
 * (and `next build`) always works without env vars.
 */

function rowToProduct(row: ProductRow): Product {
  const parseList = (raw: string): string[] => {
    try {
      const v = JSON.parse(raw);
      return Array.isArray(v) ? v.map(String) : [];
    } catch {
      return [];
    }
  };
  return {
    id: row.id,
    name: row.name,
    category: row.category as CategoryId,
    duration: row.duration,
    regularPrice: row.regularPrice,
    price: row.price,
    warranty:
      row.warrantyValue != null && row.warrantyUnit
        ? { value: row.warrantyValue, unit: row.warrantyUnit as 'days' | 'months' }
        : null,
    noWarrantyNote: row.noWarrantyNote ?? undefined,
    image: row.image ?? undefined,
    art: { from: row.artFrom, to: row.artTo, glyph: row.artGlyph },
    features: parseList(row.features),
    activation: parseList(row.activation),
    note: row.note ?? undefined,
    stock: row.stock,
    outOfStock: row.outOfStock === 1,
    sortOrder: row.sortOrder,
    updatedAt: row.updatedAt ?? undefined,
  };
}

const CATEGORY_ORDER = categories
  .filter((c) => c.id !== 'all')
  .map((c) => c.id as CategoryId);

function sortCatalog(list: Product[]): Product[] {
  return [...list].sort((a, b) => {
    const ca = CATEGORY_ORDER.indexOf(a.category);
    const cb = CATEGORY_ORDER.indexOf(b.category);
    if (ca !== cb) return ca - cb;
    return a.sortOrder - b.sortOrder;
  });
}

/** All products, category-grouped and ordered. Never throws. */
export async function getCatalog(): Promise<Product[]> {
  const db = getDb();
  if (!db) return sortCatalog(SEED_PRODUCTS);
  try {
    const rows = await db
      .select()
      .from(productsTable)
      .orderBy(asc(productsTable.sortOrder));
    if (rows.length === 0) return sortCatalog(SEED_PRODUCTS);
    return sortCatalog(rows.map(rowToProduct));
  } catch {
    return sortCatalog(SEED_PRODUCTS);
  }
}

/** Products of one category, ordered by sortOrder. */
export async function getProductsByCategory(cat: CategoryId): Promise<Product[]> {
  return (await getCatalog()).filter((p) => p.category === cat);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return (await getCatalog()).find((p) => p.id === id);
}

export { rowToProduct };
