import { prisma } from '@/server/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';

interface Props {
  searchParams: Promise<{
    oid?: string;
  }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderId = params.oid;

  if (!orderId) {
    return (
      <main className="container py-10">
        <Card>
          <CardContent className="py-12 text-center">
            <h1 className="text-2xl font-semibold mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">No order ID provided.</p>
            <Link href="/catalog">
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          order: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const formatPrice = (cents: number) => {
    return `₹${(cents / 100).toLocaleString('en-IN')}`;
  };

  return (
    <main className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono text-sm">{order.id}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{order.email}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Order Status</p>
            <span
              className={`px-3 py-1 rounded text-sm font-medium ${
                order.status === 'PAID'
                  ? 'bg-green-100 text-green-800'
                  : order.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {order.status}
            </span>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Item #{item.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × {formatPrice(item.unitPriceCents)}
                    </p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.unitPriceCents * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount</span>
              <span>{formatPrice(order.amountCents)}</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Link href="/catalog" className="flex-1">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
            {order.userId && (
              <Link href="/account" className="flex-1">
                <Button className="w-full">View Account</Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

