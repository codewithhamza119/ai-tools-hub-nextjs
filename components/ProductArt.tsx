import type { Product } from '@/lib/products';

interface ProductArtProps {
  product: Product;
  className?: string;
}

/**
 * Full-bleed 16:10 product artwork.
 * Renders the product image when available, otherwise a gradient monogram
 * with a soft radial highlight. Always clipped to its own bounds.
 */
export default function ProductArt({ product, className = '' }: ProductArtProps) {
  const base = `relative aspect-[16/10] overflow-hidden ${className}`.trim();

  if (product.image) {
    return (
      <div className={base}>
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  const { from, to, glyph } = product.art;

  return (
    <div
      className={base}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden={false}
      role="img"
      aria-label={product.name}
    >
      {/* radial white highlight */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 55%)',
        }}
      />
      {/* monogram */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="select-none text-6xl font-black text-white/90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]">
          {glyph}
        </span>
      </div>
    </div>
  );
}
