'use server';

import { prisma } from '@/server/db';
import { requireRole } from '@/lib/auth-guard';

/**
 * Create image records from uploaded URLs
 */
export async function createImagesAction(urls: Array<{ url: string; name: string }>) {
  try {
    await requireRole(['OWNER', 'STAFF']);

    const images = await Promise.all(
      urls.map((file) =>
        prisma.image.create({
          data: {
            url: file.url,
            alt: file.name,
          },
        })
      )
    );

    return { success: true, images };
  } catch (error) {
    console.error('Error creating images:', error);
    return { success: false, error: 'Failed to create images' };
  }
}

