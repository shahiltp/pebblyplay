import { prisma } from './db';
import { Prisma } from '@prisma/client';

export interface CatalogFilters {
  categoryId?: string;
  categorySlug?: string;
  minPrice?: number; // in cents
  maxPrice?: number; // in cents
  ageMin?: number;
  ageMax?: number;
  status?: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  search?: string;
}

export interface CatalogPagination {
  page: number;
  pageSize: number;
}

export type CatalogSort = 'price-asc' | 'price-desc' | 'newest' | 'oldest';

export interface GetProductsResult {
  products: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    categoryId: string;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    ageMin: number | null;
    ageMax: number | null;
    status: string;
    images: Array<{
      id: string;
      url: string;
      alt: string | null;
    }>;
    variants: Array<{
      id: string;
      priceCents: number;
      stock: number;
    }>;
    createdAt: Date;
    updatedAt: Date;
  }>;
  total: number;
  totalPages: number;
}

/**
 * Get products with filters, pagination, and sorting
 */
export async function getProducts(
  filters: CatalogFilters = {},
  pagination: CatalogPagination = { page: 1, pageSize: 12 },
  sort: CatalogSort = 'newest'
): Promise<GetProductsResult> {
  const { page, pageSize } = pagination;
  const skip = (page - 1) * pageSize;

  const where: Prisma.ProductWhereInput = {};

  // Status filter (default to ACTIVE for public catalog)
  if (filters.status) {
    where.status = filters.status;
  }

  // Category filter
  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  } else if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug };
  }

  // Search by title
  if (filters.search) {
    where.title = {
      contains: filters.search,
      mode: 'insensitive',
    };
  }

  // Age range filter
  if (filters.ageMin !== undefined || filters.ageMax !== undefined) {
    where.OR = [
      // Product age range overlaps with filter range
      {
        AND: [
          filters.ageMin !== undefined ? { ageMin: { lte: filters.ageMin } } : {},
          filters.ageMax !== undefined ? { ageMax: { gte: filters.ageMax } } : {},
        ],
      },
      // Product has no age range (null means any age)
      {
        ageMin: null,
        ageMax: null,
      },
    ];
  }

  // Build sort order
  let orderBy: Prisma.ProductOrderByWithRelationInput;
  switch (sort) {
    case 'price-asc':
    case 'price-desc':
      // For price sorting, we'll need to sort by variants after fetching
      // For now, use updatedAt as fallback
      orderBy = { updatedAt: 'desc' };
      break;
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' };
      break;
  }

  // Fetch products with relations
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: pageSize,
      orderBy,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            alt: true,
          },
          orderBy: {
            id: 'asc', // Consistent ordering
          },
        },
        variants: {
          select: {
            id: true,
            priceCents: true,
            stock: true,
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  // Handle price sorting if needed
  let sortedProducts = products;
  if (sort === 'price-asc' || sort === 'price-desc') {
    sortedProducts = [...products].sort((a, b) => {
      const priceA = getMinVariantPrice(a.variants);
      const priceB = getMinVariantPrice(b.variants);
      return sort === 'price-asc' ? priceA - priceB : priceB - priceA;
    });
  }

  // Apply price range filter after fetching (since we need to calculate min price)
  let filteredProducts = sortedProducts;
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    filteredProducts = sortedProducts.filter((product) => {
      const minPrice = getMinVariantPrice(product.variants);
      if (filters.minPrice !== undefined && minPrice < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && minPrice > filters.maxPrice) return false;
      return true;
    });
  }

  const totalPages = Math.ceil(total / pageSize);

  return {
    products: filteredProducts as GetProductsResult['products'],
    total,
    totalPages,
  };
}

/**
 * Get a single product by slug with all relations
 */
export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: {
        orderBy: {
          id: 'asc',
        },
      },
      variants: {
        orderBy: {
          priceCents: 'asc',
        },
      },
    },
  });
}

/**
 * Get the minimum price (in cents) from product variants
 */
export function getMinVariantPrice(variants: Array<{ priceCents: number }>): number {
  if (variants.length === 0) return 0;
  return Math.min(...variants.map((v) => v.priceCents));
}

