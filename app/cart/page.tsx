import { CartClient } from '@/components/cart/CartClient';

export default function CartPage() {
  return (
    <main className="container py-10">
      <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
      <CartClient />
    </main>
  );
}
