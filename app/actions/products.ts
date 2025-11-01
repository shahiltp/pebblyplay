'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/server/db';
import { requireRole } from '@/lib/auth-guard';
import { productSchema, type ProductInput } from '@/lib/validators';
import { ensureUniqueSlug } from '@/lib/slug';
import { ProductStatus } from '@prisma/client';

/**
 * Create a new product with variants and images
 */
export async function createProductAction(input: ProductInput) {
  try {
    await requireRole(['OWNER', 'STAFF']);

    // Validate input
    const validated = productSchema.parse(input);

    // Ensure unique slug
    const uniqueSlug = await ensureUniqueSlug(validated.slug);

    // Use transaction to create product, variants, and images
    const result = await prisma.$transaction(async (tx) => {
      // Create product
      const product = await tx.product.create({
        data: {
          title: validated.title,
          slug: uniqueSlug,
          description: validated.description,
          categoryId: validated.categoryId,
          ageMin: validated.ageMin ?? null,
          ageMax: validated.ageMax ?? null,
          status: validated.status as ProductStatus,
        },
      });

      // Create images
      const imageIds = validated.imageIds || [];
      if (imageIds.length > 0) {
        // Fetch images to update with productId
        await tx.image.updateMany({
          where: {
            id: { in: imageIds },
          },
          data: {
            productId: product.id,
          },
        });
      }

      // Create variants
      const variants = await Promise.all(
        validated.variants.map((variant) =>
          tx.productVariant.create({
            data: {
              productId: product.id,
              sku: variant.sku,
              optionValues: variant.optionValues,
              priceCents: variant.priceCents,
              stock: variant.stock,
              imageIds: variant.imageIds || [],
            },
          })
        )
      );

      // Check SKU uniqueness
      const skus = variants.map((v) => v.sku);
      const duplicates = skus.filter((sku, index) => skus.indexOf(sku) !== index);
      if (duplicates.length > 0) {
        throw new Error(`Duplicate SKUs found: ${duplicates.join(', ')}`);
      }

      return { product, variants };
    });

    revalidatePath('/catalog');
    revalidatePath('/admin/products');
    revalidatePath(`/product/${uniqueSlug}`);

    return { success: true, productId: result.product.id };
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to create product' };
  }
}

/**
 * Update an existing product
 */
export async function updateProductAction(productId: string, input: ProductInput) {
  try {
    await requireRole(['OWNER', 'STAFF']);

    // Validate input
    const validated = productSchema.parse(input);

    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });

    if (!existing) {
      return { success: false, error: 'Product not found' };
    }

    // Ensure unique slug (excluding current product)
    const uniqueSlug = await ensureUniqueSlug(validated.slug, productId);

    // Use transaction to update product, variants, and images
    await prisma.$transaction(async (tx) => {
      // Update product
      await tx.product.update({
        where: { id: productId },
        data: {
          title: validated.title,
          slug: uniqueSlug,
          description: validated.description,
          categoryId: validated.categoryId,
          ageMin: validated.ageMin ?? null,
          ageMax: validated.ageMax ?? null,
          status: validated.status as ProductStatus,
        },
      });

      // Handle images: remove old associations, add new ones
      await tx.image.updateMany({
        where: { productId },
        data: { productId: null },
      });

      const imageIds = validated.imageIds || [];
      if (imageIds.length > 0) {
        await tx.image.updateMany({
          where: {
            id: { in: imageIds },
          },
          data: {
            productId,
          },
        });
      }

      // Delete old variants
      await tx.productVariant.deleteMany({
        where: { productId },
      });

      // Create new variants
      await Promise.all(
        validated.variants.map((variant) =>
          tx.productVariant.create({
            data: {
              productId,
              sku: variant.sku,
              optionValues: variant.optionValues,
              priceCents: variant.priceCents,
              stock: variant.stock,
              imageIds: variant.imageIds || [],
            },
          })
        )
      );
    });

    revalidatePath('/catalog');
    revalidatePath('/admin/products');
    revalidatePath(`/product/${uniqueSlug}`);
    revalidatePath(`/product/${existing.slug}`); // In case slug changed

    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to update product' };
  }
}

/**
 * Delete a product (only if it has no variants or confirmed)
 */
export async function deleteProductAction(productId: string, force: boolean = false) {
  try {
    await requireRole(['OWNER', 'STAFF']);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: true,
      },
    });

    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    // Prevent deletion if has variants (unless forced)
    if (product.variants.length > 0 && !force) {
      return { success: false, error: 'Product has variants. Confirm deletion to proceed.' };
    }

    // Delete product (variants and images will cascade)
    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath('/catalog');
    revalidatePath('/admin/products');
    revalidatePath(`/product/${product.slug}`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to delete product' };
  }
}

