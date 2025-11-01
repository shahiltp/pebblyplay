import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/server/db';
import { getCategoriesAction } from '@/app/actions/categories';
import { ProductForm } from '@/components/admin/ProductForm';
import { DeleteProductButton } from '@/components/admin/DeleteProductButton';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default async function EditProductPage({ params }: Props) {
  await requireRole(['OWNER', 'STAFF']);

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      images: true,
      variants: true,
    },
  });

  if (!product) {
    notFound();
  }

  const categories = await getCategoriesAction();

  return (
    <main className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Edit Product</h1>
        <DeleteProductButton
          productId={product.id}
          productTitle={product.title}
          hasVariants={product.variants.length > 0}
        />
      </div>
      <ProductForm categories={categories} product={product} />
    </main>
  );
}
