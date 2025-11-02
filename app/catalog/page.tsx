import { getProducts } from '@/server/catalog';
import { prisma } from '@/server/db';
import { getMinVariantPrice } from '@/server/catalog';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CatalogFilters } from '@/components/catalog/CatalogFilters';
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

  const formatPrice = (cents: number) => {
    return `₹${(cents / 100).toLocaleString('en-IN')}`;
  };

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
    <main className="container py-10">
      <h1 className="text-3xl font-semibold mb-6">Catalog</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          <CatalogFilters
            categories={categories}
            currentCategory={params.category}
            currentSort={sort}
            currentMinPrice={params.minPrice}
            currentMaxPrice={params.maxPrice}
            currentAgeMin={params.ageMin}
            currentAgeMax={params.ageMax}
          />
        </div>

        <div className="lg:col-span-3">
          {result.products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No products found matching your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {result.products.map((product) => {
                  const minPrice = getMinVariantPrice(product.variants);
                  const firstImage = product.images[0];

                  return (
                    <Link key={product.id} href={`/product/${product.slug}`}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
                          {firstImage ? (
                            <img
                              src={firstImage.url}
                              alt={firstImage.alt || product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              No Image
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                          <p className="text-2xl font-bold text-primary mb-2">{formatPrice(minPrice)}</p>
                          {product.ageMin !== null || product.ageMax !== null ? (
                            <p className="text-sm text-muted-foreground">
                              Ages {product.ageMin ?? '0'}-{product.ageMax ?? '12+'} years
                            </p>
                          ) : null}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              {result.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  {page > 1 && (
                    <Link href={`?${buildQueryString({})}&page=${page - 1}`}>
                      <Button variant="outline">Previous</Button>
                    </Link>
                  )}
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {result.totalPages}
                  </span>
                  {page < result.totalPages && (
                    <Link href={`?${buildQueryString({})}&page=${page + 1}`}>
                      <Button variant="outline">Next</Button>
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}