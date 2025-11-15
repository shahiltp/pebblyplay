import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/server/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderStatus } from '@prisma/client';

interface Props {
  params: {
    id: string;
  };
}

export default async function OrderDetailPage({ params }: Props) {
  await requireRole(['OWNER', 'STAFF']);

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const formatPrice = (cents: number) => {
    return `₹${(cents / 100).toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'CANCELED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="container py-10">
      <div className="mb-6">
        <Link href="/admin/orders">
          <Button variant="outline" size="sm">
            ← Back to Orders
          </Button>
        </Link>
      </div>

      <h1 className="text-2xl font-semibold mb-6">Order Details</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono text-sm">{order.id}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{order.email}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-lg font-semibold">{formatPrice(order.amountCents)}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Currency</p>
              <p>{order.currency}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Payment Provider</p>
              <p>{order.provider}</p>
            </div>

            {order.providerOrderId && (
              <div>
                <p className="text-sm text-muted-foreground">Provider Order ID</p>
                <p className="font-mono text-sm">{order.providerOrderId}</p>
              </div>
            )}

            {order.providerPaymentId && (
              <div>
                <p className="text-sm text-muted-foreground">Provider Payment ID</p>
                <p className="font-mono text-sm">{order.providerPaymentId}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Updated At</p>
              <p>{new Date(order.updatedAt).toLocaleString()}</p>
            </div>

            {order.emailSentAt && (
              <div>
                <p className="text-sm text-muted-foreground">Email Sent At</p>
                <p>{new Date(order.emailSentAt).toLocaleString()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            {order.items.length === 0 ? (
              <p className="text-muted-foreground">No items in this order</p>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Variant ID</TableHead>
                      <TableHead>Product ID</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs">{item.variantId.slice(0, 8)}...</TableCell>
                        <TableCell className="font-mono text-xs">{item.productId.slice(0, 8)}...</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatPrice(item.unitPriceCents)}</TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(item.unitPriceCents * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="border-t p-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(order.amountCents)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

