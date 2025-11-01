import { requireRole } from '@/lib/auth-guard';
import { getCategoriesAction } from '@/app/actions/categories';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function NewProductPage() {
  await requireRole(['OWNER', 'STAFF']);

  const categories = await getCategoriesAction();

  return (
    <main className="container py-10">
      <h1 className="text-2xl font-semibold mb-6">Create Product</h1>
      <ProductForm categories={categories} />
    </main>
  );
}

