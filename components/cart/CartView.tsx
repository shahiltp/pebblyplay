'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getCart, updateCartItem, removeFromCart, type CartItem } from '@/lib/cart';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface CartViewProps {
  serverPricedItems?: Array<{
    variantId: string;
    title: string;
    variantAttrs: Record<string, any>;
    priceCents: number;
    quantity: number;
    lineTotal: number;
    imageUrl?: string;
  }>;
  subtotalCents?: number;
  onCheckout?: () => void;
}

export function CartView({ serverPricedItems, subtotalCents, onCheckout }: CartViewProps) {
  const { data: session } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = session?.user?.id || null;
    setCart(getCart(userId));
  }, [session?.user?.id]);

  const handleUpdateQuantity = (variantId: string, quantity: number) => {
    const userId = session?.user?.id || null;
    const updated = updateCartItem(variantId, quantity, userId);
    setCart(updated);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleRemove = (variantId: string) => {
    const userId = session?.user?.id || null;
    const updated = removeFromCart(variantId, userId);
    setCart(updated);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const formatPrice = (cents: number) => {
    return `₹${(cents / 100).toLocaleString('en-IN')}`;
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Your cart is empty.</p>
        <Link href="/catalog">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  // If server-priced items are provided, use them; otherwise show loading state
  if (!serverPricedItems || !subtotalCents) {
    return (
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.variantId} className="flex items-center gap-4 border-b pb-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleUpdateQuantity(item.variantId, parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 border rounded"
              />
              <Button variant="ghost" size="sm" onClick={() => handleRemove(item.variantId)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {serverPricedItems.map((item) => (
          <div key={item.variantId} className="flex gap-4 border-b pb-4">
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.title} className="w-24 h-24 object-cover rounded" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold">{item.title}</h3>
              {Object.keys(item.variantAttrs).length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {Object.entries(item.variantAttrs)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ')}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-1">{formatPrice(item.priceCents)} each</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleUpdateQuantity(item.variantId, parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 border rounded text-sm"
                />
                <Button variant="ghost" size="sm" onClick={() => handleRemove(item.variantId)}>
                  Remove
                </Button>
              </div>
              <p className="font-semibold">{formatPrice(item.lineTotal)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Subtotal</span>
          <span className="text-xl font-bold">{formatPrice(subtotalCents)}</span>
        </div>
        <Button onClick={onCheckout} className="w-full" size="lg" disabled={loading}>
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </Button>
      </div>
    </div>
  );
}

