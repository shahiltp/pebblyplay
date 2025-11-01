import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/server/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProductListFilters } from '@/components/admin/ProductListFilters';
import { ProductStatus } from '@prisma/client';

interface Props {
  searchParams: {
    search?: string;
    status?: string;
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  await requireRole(['OWNER', 'STAFF']);

  const search = searchParams.search || '';
  const statusFilter = searchParams.status as ProductStatus | undefined;

  const where: any = {};
  if (search) {
    where.title = {
      contains: search,
      mode: 'insensitive',
    };
  }
  if (statusFilter) {
    where.status = statusFilter;
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <main className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/admin/products/new">
          <Button>Create Product</Button>
        </Link>
      </div>

      <ProductListFilters />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        product.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : product.status === 'DRAFT'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(product.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
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
