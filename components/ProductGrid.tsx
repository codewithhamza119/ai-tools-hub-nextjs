import type { Product } from '@/lib/products';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onSelect: (p: Product) => void;
}

/** Responsive product grid: 1 → 2 → 4 columns, 26px gutters. */
export default function ProductGrid({ products, onSelect }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-[26px] sm:grid-cols-2 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onSelect={onSelect} />
      ))}
    </div>
  );
}
