import { CheckoutClient } from '@/components/checkout/CheckoutClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { priceCart } from '@/server/cart';
import { getCart } from '@/lib/cart';

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  
  // Note: We can't access localStorage server-side, so pricing will be done client-side
  // This is just a placeholder - the CheckoutClient will handle everything

  return (
    <main className="container py-10">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
      <CheckoutClient userEmail={session?.user?.email || undefined} userId={session?.user?.id || undefined} />
    </main>
  );
}
