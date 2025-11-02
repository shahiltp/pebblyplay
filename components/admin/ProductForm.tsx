'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductInput } from '@/lib/validators';
import { slugify } from '@/lib/slug';
import { createProductAction, updateProductAction } from '@/app/actions/products';
import { createImagesAction } from '@/app/actions/images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadThingButton } from '@/components/ui/uploadthing';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import type { Category, Product, Image as ImageType, ProductVariant } from '@prisma/client';

interface ProductFormProps {
  categories: Category[];
  product?: Product & {
    images: ImageType[];
    variants: ProductVariant[];
    category: Category;
  };
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; url: string; alt: string | null }>>(
    product?.images || []
  );
  const [imageOrder, setImageOrder] = useState<string[]>(
    product?.images.map((img) => img.id) || []
  );

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title || '',
      slug: product?.slug || '',
      description: product?.description || '',
      categoryId: product?.categoryId || '',
      ageMin: product?.ageMin || null,
      ageMax: product?.ageMax || null,
      status: product?.status || 'DRAFT',
      variants: product?.variants.map((v) => ({
        sku: v.sku,
        optionValues: (v.optionValues as Record<string, any>) || {},
        priceCents: v.priceCents,
        stock: v.stock,
        imageIds: v.imageIds || [],
      })) || [
        {
          sku: '',
          optionValues: {},
          priceCents: 0,
          stock: 0,
          imageIds: [],
        },
      ],
      imageIds: imageOrder,
    },
  });

  const variants = form.watch('variants');
  const title = form.watch('title');

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('title', e.target.value);
    if (!product) {
      // Only auto-generate slug for new products
      const generatedSlug = slugify(e.target.value);
      form.setValue('slug', generatedSlug);
    }
  };

  const handleImageUpload = async (files?: Array<{ url: string; name: string }>) => {
    if (!files || files.length === 0) return;
    const result = await createImagesAction(files);
    if (result.success && result.images) {
      const newImages = result.images;
      setUploadedImages((prev) => [...prev, ...newImages]);
      setImageOrder((prev) => [...prev, ...newImages.map((img) => img.id)]);
      form.setValue('imageIds', [...imageOrder, ...newImages.map((img) => img.id)]);
      toast.success('Images uploaded successfully');
    } else {
      toast.error('Failed to upload images');
    }
  };

  const removeImage = (imageId: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
    setImageOrder((prev) => prev.filter((id) => id !== imageId));
    form.setValue(
      'imageIds',
      imageOrder.filter((id) => id !== imageId)
    );
  };

  const addVariant = () => {
    form.setValue('variants', [
      ...variants,
      {
        sku: '',
        optionValues: {},
        priceCents: 0,
        stock: 0,
        imageIds: [],
      },
    ]);
  };

  const removeVariant = (index: number) => {
    form.setValue(
      'variants',
      variants.filter((_, i) => i !== index)
    );
  };

  const addVariantOption = (variantIndex: number, key: string, value: string) => {
    const variant = variants[variantIndex];
    if (!variant) return;
    form.setValue(`variants.${variantIndex}.optionValues`, {
      ...variant.optionValues,
      [key]: value,
    });
  };

  const removeVariantOption = (variantIndex: number, key: string) => {
    const variant = variants[variantIndex];
    if (!variant) return;
    const { [key]: _, ...rest } = variant.optionValues;
    form.setValue(`variants.${variantIndex}.optionValues`, rest);
  };

  const onSubmit = async (data: ProductInput) => {
    startTransition(async () => {
      try {
        const result = product
          ? await updateProductAction(product.id, { ...data, imageIds: imageOrder })
          : await createProductAction({ ...data, imageIds: imageOrder });

        if (result.success) {
          toast.success(product ? 'Product updated successfully' : 'Product created successfully');
          router.push('/admin/products');
          router.refresh();
        } else {
          toast.error(result.error || 'Failed to save product');
        }
      } catch (error) {
        toast.error('An error occurred');
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register('title')} onChange={handleTitleChange} />
            <FormMessage name="title" />
          </FormField>

          <FormField>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...form.register('slug')} />
            <FormMessage name="slug" />
          </FormField>

          <FormField>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register('description')} rows={4} />
            <FormMessage name="description" />
          </FormField>

          <FormField>
            <Label htmlFor="categoryId">Category</Label>
            <Select id="categoryId" {...form.register('categoryId')}>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
            <FormMessage name="categoryId" />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField>
              <Label htmlFor="ageMin">Min Age (years)</Label>
              <Input
                id="ageMin"
                type="number"
                {...form.register('ageMin', { valueAsNumber: true })}
              />
              <FormMessage name="ageMin" />
            </FormField>

            <FormField>
              <Label htmlFor="ageMax">Max Age (years)</Label>
              <Input
                id="ageMax"
                type="number"
                {...form.register('ageMax', { valueAsNumber: true })}
              />
              <FormMessage name="ageMax" />
            </FormField>
          </div>

          <FormField>
            <Label htmlFor="status">Status</Label>
            <Select id="status" {...form.register('status')}>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
            <FormMessage name="status" />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <UploadThingButton
            endpoint="productImages"
            onClientUploadComplete={handleImageUpload}
            onUploadError={(error) => toast.error(`Upload failed: ${error.message}`)}
          />
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {imageOrder
                .map((id) => uploadedImages.find((img) => img.id === id))
                .filter(Boolean)
                .map((image) => (
                  <div key={image!.id} className="relative group">
                    <img src={image!.url} alt={image!.alt || ''} className="w-full h-32 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeImage(image!.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Variants</CardTitle>
          <Button type="button" onClick={addVariant} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Variant
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {variants.map((variant, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Variant {index + 1}</h4>
                {variants.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeVariant(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <Label htmlFor={`variants.${index}.sku`}>SKU</Label>
                  <Input id={`variants.${index}.sku`} {...form.register(`variants.${index}.sku`)} />
                  <FormMessage name={`variants.${index}.sku`} />
                </FormField>

                <FormField>
                  <Label htmlFor={`variants.${index}.priceCents`}>Price (in paise)</Label>
                  <Input
                    id={`variants.${index}.priceCents`}
                    type="number"
                    {...form.register(`variants.${index}.priceCents`, { valueAsNumber: true })}
                  />
                  <FormMessage name={`variants.${index}.priceCents`} />
                </FormField>

                <FormField>
                  <Label htmlFor={`variants.${index}.stock`}>Stock</Label>
                  <Input
                    id={`variants.${index}.stock`}
                    type="number"
                    {...form.register(`variants.${index}.stock`, { valueAsNumber: true })}
                  />
                  <FormMessage name={`variants.${index}.stock`} />
                </FormField>
              </div>

              <div>
                <Label>Options (e.g., Color: Red, Size: M)</Label>
                <div className="space-y-2 mt-2">
                  {Object.entries(variant.optionValues || {}).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <Input value={key} placeholder="Option name" readOnly className="flex-1" />
                      <Input
                        value={String(value)}
                        placeholder="Option value"
                        readOnly
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariantOption(index, key)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Option name (e.g., Color)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const key = e.currentTarget.value.trim();
                          const value = (e.currentTarget.nextElementSibling as HTMLInputElement)?.value.trim();
                          if (key && value) {
                            addVariantOption(index, key, value);
                            e.currentTarget.value = '';
                            (e.currentTarget.nextElementSibling as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <Input
                      placeholder="Option value (e.g., Red)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const key = (e.currentTarget.previousElementSibling as HTMLInputElement)?.value.trim();
                          const value = e.currentTarget.value.trim();
                          if (key && value) {
                            addVariantOption(index, key, value);
                            e.currentTarget.value = '';
                            (e.currentTarget.previousElementSibling as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {product ? 'Update Product' : 'Create Product'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
      </form>
    </Form>
  );
}
