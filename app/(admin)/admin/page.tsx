import { requireRole } from '@/lib/auth-guard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminPage() {
  await requireRole(['OWNER', 'STAFF']);
  return (
    <main className="container py-10">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>Manage your product catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/products">
              <Button>View Products</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>View and manage customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/orders">
              <Button>View Orders</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}








