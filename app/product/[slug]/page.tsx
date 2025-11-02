import { getProductBySlug } from '@/server/catalog';
import { prisma } from '@/server/db';
import { getMinVariantPrice } from '@/server/catalog';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function generateStaticParams() {
  // Fetch all ACTIVE product slugs for static generation
  const products = await prisma.product.findMany({
    where: { status: 'ACTIVE' },
    select: { slug: true },
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.status !== 'ACTIVE') {
    notFound();
  }

  const minPrice = getMinVariantPrice(product.variants);

  // Build JSON-LD schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images.map((img) => img.url),
    category: product.category.name,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: minPrice / 100,
      availability: product.variants.some((v) => v.stock > 0)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}