'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteProductAction } from '@/app/actions/products';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Props {
  productId: string;
  productTitle: string;
  hasVariants: boolean;
}

export function DeleteProductButton({ productId, productTitle, hasVariants }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteProductAction(productId, hasVariants);

        if (result.success) {
          toast.success('Product deleted successfully');
          router.push('/admin/products');
          router.refresh();
        } else {
          if (result.error?.includes('variants')) {
            // Show confirmation dialog for products with variants
            toast.error(result.error);
            // User can click delete again to force
          } else {
            toast.error(result.error || 'Failed to delete product');
          }
        }
      } catch (error) {
        toast.error('An error occurred');
      }
    });
  };

  const handleConfirmDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteProductAction(productId, true); // Force delete

        if (result.success) {
          toast.success('Product deleted successfully');
          setOpen(false);
          router.push('/admin/products');
          router.refresh();
        } else {
          toast.error(result.error || 'Failed to delete product');
        }
      } catch (error) {
        toast.error('An error occurred');
      }
    });
  };

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)} disabled={isPending}>
        Delete Product
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              {hasVariants ? (
                <>
                  This product has variants. Deleting it will also delete all variants and images. This action
                  cannot be undone.
                </>
              ) : (
                <>
                  Are you sure you want to delete &quot;{productTitle}&quot;? This action cannot be undone.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isPending}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

