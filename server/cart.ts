import { prisma } from './db';
import type { CartItem } from '@/lib/cart';

export interface PricedCartItem {
  variantId: string;
  title: string;
  variantAttrs: Record<string, any>;
  priceCents: number;
  quantity: number;
  lineTotal: number;
  imageUrl?: string;
}

/**
 * Price cart items server-side with validation
 * Validates that variants exist and parent products are ACTIVE
 * Returns enriched items with server-side pricing
 */
export async function priceCart(items: CartItem[]): Promise<{
  items: PricedCartItem[];
  subtotalCents: number;
}> {
  if (items.length === 0) {
    return { items: [], subtotalCents: 0 };
  }

  const variantIds = items.map((item) => item.variantId);

  // Fetch variants with product info
  const variants = await prisma.productVariant.findMany({
    where: {
      id: { in: variantIds },
    },
    include: {
      product: {
        include: {
          images: {
            take: 1,
            orderBy: { id: 'asc' },
          },
        },
      },
    },
  });

  // Validate all items and build priced cart
  const pricedItems: PricedCartItem[] = [];
  let subtotalCents = 0;

  for (const cartItem of items) {
    const variant = variants.find((v) => v.id === cartItem.variantId);

    // Skip invalid items (variant not found or product not ACTIVE)
    if (!variant || variant.product.status !== 'ACTIVE') {
      continue;
    }

    const lineTotal = variant.priceCents * cartItem.quantity;
    subtotalCents += lineTotal;

    pricedItems.push({
      variantId: variant.id,
      title: variant.product.title,
      variantAttrs: (variant.optionValues as Record<string, any>) || {},
      priceCents: variant.priceCents,
      quantity: cartItem.quantity,
      lineTotal,
      imageUrl: variant.product.images[0]?.url,
    });
  }

  return {
    items: pricedItems,
    subtotalCents,
  };
}

