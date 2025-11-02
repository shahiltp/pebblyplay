'use server';

import { priceCart } from '@/server/cart';
import type { CartItem } from '@/lib/cart';

/**
 * Server action to price cart items
 */
export async function priceCartAction(items: CartItem[]) {
  try {
    const result = await priceCart(items);
    return { success: true, ...result };
  } catch (error) {
    console.error('Error pricing cart:', error);
    return { success: false, error: 'Failed to price cart items' };
  }
}

