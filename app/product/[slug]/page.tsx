import { getProductBySlug, getProducts } from '@/server/catalog';
import { prisma } from '@/server/db';
import { getMinVariantPrice } from '@/server/catalog';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';
import { Section } from '@/components/store/Section';
import { ProductCard } from '@/components/store/ProductCard';
import { Metadata } from 'next';
import { getAbsoluteUrl, siteConfig } from '@/lib/site';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function generateStaticParams() {
  try {
    // Fetch all ACTIVE product slugs for static generation
    const products = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      select: { slug: true },
    });

    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    // Handle case where database is empty or tables don't exist (e.g., in CI)
    console.warn('generateStaticParams: Could not fetch products:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.status !== 'ACTIVE') {
    return {};
  }

  const firstImage = product.images[0]?.url;
  const description = product.description || `${product.title} - Available at ${siteConfig.name}`;

  return {
    title: product.title,
    description,
    alternates: {
      canonical: getAbsoluteUrl(`/product/${slug}`),
    },
    openGraph: {
      type: 'website',
      url: getAbsoluteUrl(`/product/${slug}`),
      siteName: siteConfig.name,
      title: product.title,
      description,
      images: firstImage ? [firstImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description,
      images: firstImage ? [firstImage] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.status !== 'ACTIVE') {
    notFound();
  }

  const minPrice = getMinVariantPrice(product.variants);

  // Fetch related products (same category, excluding current product)
  const relatedProducts = await getProducts(
    { status: 'ACTIVE', categoryId: product.categoryId },
    { page: 1, pageSize: 4 },
    'newest'
  );

  // Filter out current product
  const filteredRelated = relatedProducts.products.filter((p) => p.id !== product.id).slice(0, 4);

  // Build JSON-LD schema - ensure lowPrice uses lowest variant price
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
      lowPrice: minPrice / 100,
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
      {filteredRelated.length > 0 && (
        <Section title="Related Products" description="You might also like">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRelated.map((relatedProduct) => {
              const relatedMinPrice = getMinVariantPrice(relatedProduct.variants);
              return (
                <ProductCard key={relatedProduct.id} product={relatedProduct} minPrice={relatedMinPrice} />
              );
            })}
          </div>
        </Section>
      )}
    </>
  );
}
