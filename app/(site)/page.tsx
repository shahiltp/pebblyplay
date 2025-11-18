import { Metadata } from 'next';
import { getAbsoluteUrl, siteConfig } from '@/lib/site';
import { Hero } from '@/components/store/Hero';
import { Section } from '@/components/store/Section';
import { CategoryPills } from '@/components/store/CategoryPills';
import { ProductCard } from '@/components/store/ProductCard';
import { getProducts } from '@/server/catalog';
import { prisma } from '@/server/db';
import { getMinVariantPrice } from '@/server/catalog';
import { Shield, CreditCard, RotateCcw } from 'lucide-react';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: getAbsoluteUrl('/'),
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: getAbsoluteUrl('/'),
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: getAbsoluteUrl('/og-image.png'),
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [getAbsoluteUrl('/og-image.png')],
  },
};

export default async function HomePage() {
  // Organization JSON-LD
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    sameAs: [] as string[],
  };

  // Fetch categories and popular products
  const [categories, popularProducts] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    getProducts({ status: 'ACTIVE' }, { page: 1, pageSize: 8 }, 'newest'),
  ]);

  const trustFeatures = [
    { icon: Shield, label: 'Safe materials', description: 'Tested & certified' },
    { icon: CreditCard, label: 'Cashless & UPI', description: 'Secure payments' },
    { icon: RotateCcw, label: 'Easy returns', description: '7-day return policy' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Hero />
      
      <Section title="Shop by category">
        <CategoryPills categories={categories} />
      </Section>

      <Section title="Popular now" description="Discover our latest additions">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.products.map((product) => {
            const minPrice = getMinVariantPrice(product.variants);
            return (
              <ProductCard key={product.id} product={product} minPrice={minPrice} />
            );
          })}
        </div>
      </Section>

      {/* Trust Strip */}
      <section className="border-t bg-muted/30 py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.label} className="flex items-center gap-4 text-center md:text-left">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.label}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
