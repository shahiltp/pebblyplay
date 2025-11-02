'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCartItemCount } from '@/lib/cart';
import { ShoppingCart } from 'lucide-react';

export function CartBadge() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setItemCount(getCartItemCount());
    };

    updateCount();
    window.addEventListener('cartUpdated', updateCount);
    return () => window.removeEventListener('cartUpdated', updateCount);
  }, []);

  return (
    <Link href="/cart" className="relative flex items-center gap-1 hover:opacity-80">
      <ShoppingCart className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  );
}

