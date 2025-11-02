'use client';

import { useState, useEffect } from 'react';
import { getCart, type CartItem, updateCartItem, removeFromCart } from '@/lib/cart';
import { priceCartAction } from '@/app/actions/cart';
import { CartView } from './CartView';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export function CartClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pricedItems, setPricedItems] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      const userId = session?.user?.id || null;
      const clientCart = getCart(userId);
      setCart(clientCart);

      if (clientCart.length > 0) {
        try {
          const result = await priceCartAction(clientCart);
          if (result.success && 'items' in result && 'subtotalCents' in result) {
            setPricedItems(result.items || []);
            setSubtotal(result.subtotalCents || 0);
          }
        } catch (error) {
          console.error('Failed to price cart:', error);
        }
      }
      setLoading(false);
    };

    loadCart();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [session?.user?.id]);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading) {
    return <div className="text-center py-12">Loading cart...</div>;
  }

  return (
    <CartView
      serverPricedItems={pricedItems}
      subtotalCents={subtotal}
      onCheckout={handleCheckout}
    />
  );
}

