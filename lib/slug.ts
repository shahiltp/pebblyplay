import { prisma } from '@/server/db';

/**
 * Convert a string to a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // Trim hyphens from start
    .replace(/-+$/, ''); // Trim hyphens from end
}

/**
 * Ensure a slug is unique by appending -1, -2, etc. if needed
 * @param slug - The slug to check
 * @param excludeId - Optional product ID to exclude from uniqueness check (for updates)
 */
export async function ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
  let candidate = slug;
  let counter = 1;

  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    // If no existing product, or it's the same product we're updating, slug is unique
    if (!existing || (excludeId && existing.id === excludeId)) {
      return candidate;
    }

    // Otherwise, try with counter appended
    candidate = `${slug}-${counter}`;
    counter++;
  }
}

