import Hero from '@/components/Hero';
import TrustStrip from '@/components/TrustStrip';
import CatalogSection from '@/components/CatalogSection';
import CheckoutSection from '@/components/CheckoutSection';
import FaqSection from '@/components/FaqSection';
import CommunitySection from '@/components/CommunitySection';
import { getCatalog } from '@/lib/catalog';

/** Always render the latest catalog from the database. */
export const dynamic = 'force-dynamic';

function jsonLd(products: Awaited<ReturnType<typeof getCatalog>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI Tools HuB — Product Catalog',
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        description: `${p.name} — ${p.duration}`,
        category: p.category,
        ...(p.price != null
          ? {
              offers: {
                '@type': 'Offer',
                priceCurrency: 'PKR',
                price: p.price,
                availability: p.outOfStock
                  ? 'https://schema.org/OutOfStock'
                  : 'https://schema.org/InStock',
              },
            }
          : {}),
      },
    })),
  };
}

export default async function Home() {
  const products = await getCatalog();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(products)) }}
      />
      <Hero />
      <TrustStrip />
      <CatalogSection products={products} />
      <CheckoutSection />
      <FaqSection />
      <CommunitySection />
    </>
  );
}
