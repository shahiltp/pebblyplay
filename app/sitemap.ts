import { MetadataRoute } from 'next';
import { prisma } from '@/server/db';
import { getAbsoluteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getAbsoluteUrl('');

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: getAbsoluteUrl('/catalog'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Fetch all ACTIVE products
  const products = await prisma.product.findMany({
    where: { status: 'ACTIVE' },
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  // Add product URLs
  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: getAbsoluteUrl(`/product/${product.slug}`),
    lastModified: product.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...routes, ...productUrls];
}

