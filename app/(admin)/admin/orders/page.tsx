import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/server/db';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderStatus } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Props {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: Props) {
  await requireRole(['OWNER', 'STAFF']);

  const params = await searchParams;
  const statusFilter = params.status as OrderStatus | undefined;

  const where: any = {};
  if (statusFilter) {
    where.status = statusFilter;
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6">
        <Link href="/admin/orders">
          <Button variant={!statusFilter ? 'default' : 'outline'} size="sm">
            All
          </Button>
        </Link>
        {(['PENDING', 'PAID', 'FAILED', 'CANCELED'] as OrderStatus[]).map((status) => (
          <Link key={status} href={`/admin/orders?status=${status}`}>
            <Button variant={statusFilter === status ? 'default' : 'outline'} size="sm">
              {status}
            </Button>
          </Link>
        ))}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Order ID</TableHead>
              <TableHead className="min-w-[200px]">Email</TableHead>
              <TableHead className="min-w-[100px]">Amount</TableHead>
              <TableHead className="min-w-[80px]">Items</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="min-w-[120px]">Created</TableHead>
              <TableHead className="text-right min-w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}...</TableCell>
                  <TableCell>{order.email}</TableCell>
                  <TableCell className="font-medium tabular-nums">{formatPrice(order.amountCents)}</TableCell>
                  <TableCell className="tabular-nums">{order.items.length} item(s)</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="tabular-nums">{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}

