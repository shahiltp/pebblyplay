import { getProducts } from '@/server/catalog';
import { prisma } from '@/server/db';
import { getMinVariantPrice } from '@/server/catalog';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/store/FilterBar';
import { ProductCard } from '@/components/store/ProductCard';
import { EmptyState } from '@/components/store/EmptyState';
import { Metadata } from 'next';
import { getAbsoluteUrl, siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Catalog',
  description: 'Browse our collection of delightful toys for curious minds',
  alternates: {
    canonical: getAbsoluteUrl('/catalog'),
  },
  openGraph: {
    type: 'website',
    url: getAbsoluteUrl('/catalog'),
    siteName: siteConfig.name,
    title: 'Catalog | ' + siteConfig.name,
    description: 'Browse our collection of delightful toys for curious minds',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catalog | ' + siteConfig.name,
    description: 'Browse our collection of delightful toys for curious minds',
  },
};

interface Props {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    ageMin?: string;
    ageMax?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const pageSize = 12;

  const filters = {
    status: 'ACTIVE' as const,
    categorySlug: params.category,
    minPrice: params.minPrice ? parseInt(params.minPrice) * 100 : undefined, // Convert to cents
    maxPrice: params.maxPrice ? parseInt(params.maxPrice) * 100 : undefined,
    ageMin: params.ageMin ? parseInt(params.ageMin) : undefined,
    ageMax: params.ageMax ? parseInt(params.ageMax) : undefined,
  };

  const sort = (params.sort as any) || 'newest';

  const result = await getProducts(filters, { page, pageSize }, sort);
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  const buildQueryString = (updates: Record<string, string | undefined>) => {
    const urlParams = new URLSearchParams(Object.fromEntries(Object.entries(params)));
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        urlParams.set(key, value);
      } else {
        urlParams.delete(key);
      }
    });
    // Don't delete page here, we'll handle it per-link
    return urlParams.toString();
  };

  return (
    <main>
      <div className="container py-8">
        <h1 className="text-3xl font-bold font-display mb-6">Catalog</h1>
      </div>

      <FilterBar
        categories={categories}
        currentCategory={params.category}
        currentSort={sort}
        currentMinPrice={params.minPrice}
        currentMaxPrice={params.maxPrice}
        currentAgeMin={params.ageMin}
        currentAgeMax={params.ageMax}
      />

      <div className="container py-8">
        {result.products.length === 0 ? (
          <EmptyState
            title="No products found"
            message="Try adjusting your filters or browse all products."
            actionLabel="Browse All Products"
            actionHref="/catalog"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {result.products.map((product) => {
                const minPrice = getMinVariantPrice(product.variants);
                return (
                  <ProductCard key={product.id} product={product} minPrice={minPrice} />
                );
              })}
            </div>

            {result.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                {page > 1 && (
                  <Button asChild variant="outline">
                    <Link href={`?${buildQueryString({})}&page=${page - 1}`} aria-label="Previous page">
                      Previous
                    </Link>
                  </Button>
                )}
                <span className="text-sm text-muted-foreground">
                  Page {page} of {result.totalPages}
                </span>
                {page < result.totalPages && (
                  <Button asChild variant="outline">
                    <Link href={`?${buildQueryString({})}&page=${page + 1}`} aria-label="Next page">
                      Next
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}