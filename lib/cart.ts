'use client';

export interface CartItem {
  variantId: string;
  quantity: number;
}

const CART_STORAGE_KEY = 'pebblyplay_cart';

/**
 * Get cart from localStorage
 */
export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save cart to localStorage
 */
export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart:', error);
  }
}

/**
 * Add item to cart (or update quantity if exists)
 */
export function addToCart(variantId: string, quantity: number = 1): CartItem[] {
  const cart = getCart();
  const existingIndex = cart.findIndex((item) => item.variantId === variantId);

  if (existingIndex >= 0 && cart[existingIndex]) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ variantId, quantity });
  }

  saveCart(cart);
  return cart;
}

/**
 * Update item quantity in cart
 */
export function updateCartItem(variantId: string, quantity: number): CartItem[] {
  const cart = getCart();
  const itemIndex = cart.findIndex((item) => item.variantId === variantId);

  if (itemIndex >= 0 && cart[itemIndex]) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
    saveCart(cart);
  }

  return cart;
}

/**
 * Remove item from cart
 */
export function removeFromCart(variantId: string): CartItem[] {
  const cart = getCart();
  const filtered = cart.filter((item) => item.variantId !== variantId);
  saveCart(filtered);
  return filtered;
}

/**
 * Clear entire cart
 */
export function clearCart(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_STORAGE_KEY);
}

/**
 * Get cart item count
 */
export function getCartItemCount(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

