'use server';

import { prisma } from '@/server/db';
import { requireRole } from '@/lib/auth-guard';

/**
 * Get all categories
 */
export async function getCategoriesAction() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
}

