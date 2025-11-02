'use client';

export interface CartItem {
  variantId: string;
  quantity: number;
}

const CART_STORAGE_KEY_PREFIX = 'pebblyplay_cart';

/**
 * Get cart storage key for a user (or guest)
 */
function getCartKey(userId?: string | null): string {
  if (userId) {
    return `${CART_STORAGE_KEY_PREFIX}_${userId}`;
  }
  return `${CART_STORAGE_KEY_PREFIX}_guest`;
}

/**
 * Get current user ID from session (client-side)
 * Note: This is a helper - components should pass userId explicitly
 */
function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    // Try to get from a session storage flag set by auth
    return sessionStorage.getItem('current_user_id');
  } catch {
    return null;
  }
}

/**
 * Set current user ID in session storage
 */
export function setCurrentUserId(userId: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (userId) {
      sessionStorage.setItem('current_user_id', userId);
    } else {
      sessionStorage.removeItem('current_user_id');
    }
  } catch (error) {
    console.error('Failed to set user ID:', error);
  }
}

/**
 * Get cart from localStorage for a specific user (or guest)
 */
export function getCart(userId?: string | null): CartItem[] {
  if (typeof window === 'undefined') return [];
  const uid = userId ?? getCurrentUserId();
  const key = getCartKey(uid);
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save cart to localStorage for a specific user (or guest)
 */
export function saveCart(items: CartItem[], userId?: string | null): void {
  if (typeof window === 'undefined') return;
  const uid = userId ?? getCurrentUserId();
  const key = getCartKey(uid);
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart:', error);
  }
}

/**
 * Clear cart for a specific user (or guest)
 */
export function clearCart(userId?: string | null): void {
  if (typeof window === 'undefined') return;
  const uid = userId ?? getCurrentUserId();
  const key = getCartKey(uid);
  localStorage.removeItem(key);
}

/**
 * Clear all carts (useful when user logs out)
 */
export function clearAllCarts(): void {
  if (typeof window === 'undefined') return;
  try {
    // Clear all cart keys
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CART_STORAGE_KEY_PREFIX)) {
        keys.push(key);
      }
    }
    keys.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear all carts:', error);
  }
}

/**
 * Add item to cart (or update quantity if exists)
 */
export function addToCart(variantId: string, quantity: number = 1, userId?: string | null): CartItem[] {
  const cart = getCart(userId);
  const existingIndex = cart.findIndex((item) => item.variantId === variantId);

  if (existingIndex >= 0 && cart[existingIndex]) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ variantId, quantity });
  }

  saveCart(cart, userId);
  return cart;
}

/**
 * Update item quantity in cart
 */
export function updateCartItem(variantId: string, quantity: number, userId?: string | null): CartItem[] {
  const cart = getCart(userId);
  const itemIndex = cart.findIndex((item) => item.variantId === variantId);

  if (itemIndex >= 0 && cart[itemIndex]) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
    saveCart(cart, userId);
  }

  return cart;
}

/**
 * Remove item from cart
 */
export function removeFromCart(variantId: string, userId?: string | null): CartItem[] {
  const cart = getCart(userId);
  const filtered = cart.filter((item) => item.variantId !== variantId);
  saveCart(filtered, userId);
  return filtered;
}

/**
 * Get cart item count
 */
export function getCartItemCount(userId?: string | null): number {
  const cart = getCart(userId);
  return cart.reduce((total, item) => total + item.quantity, 0);
}

