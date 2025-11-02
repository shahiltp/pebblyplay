'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { addToCart } from '@/lib/cart';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import type { Product, ProductVariant, Image as ImageType, Category } from '@prisma/client';

interface ProductDetailClientProps {
  product: Product & {
    category: Category;
    images: ImageType[];
    variants: ProductVariant[];
  };
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { data: session } = useSession();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const selectedImage = product.images[selectedImageIndex];

  const formatPrice = (cents: number) => {
    return `₹${(cents / 100).toLocaleString('en-IN')}`;
  };

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    const userId = session?.user?.id || null;
    addToCart(selectedVariant.id, 1, userId);
    toast.success(`${product.title} added to cart`);
    
    // Dispatch event to update cart badge
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Build variant options for selector
  const variantOptions = product.variants.map((variant, index) => {
    const options = (variant.optionValues as Record<string, any>) || {};
    const optionStr = Object.entries(options)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    return {
      index,
      label: optionStr || variant.sku,
      variant,
    };
  });

  return (
    <main className="container py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Carousel */}
        <div>
          <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-muted">
            {selectedImage ? (
              <img
                src={selectedImage.url}
                alt={selectedImage.alt || product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded overflow-hidden border-2 ${
                    index === selectedImageIndex ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt || `${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-semibold mb-2">{product.title}</h1>
          <p className="text-muted-foreground mb-4">{product.category.name}</p>

          <div className="text-3xl font-bold text-primary mb-4">
            {selectedVariant ? formatPrice(selectedVariant.priceCents) : 'Price not available'}
          </div>

          {product.description && (
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          {/* Age Range */}
          {(product.ageMin !== null || product.ageMax !== null) && (
            <div className="mb-4">
              <span className="text-sm font-medium">Age Range: </span>
              <span className="text-sm text-muted-foreground">
                {product.ageMin ?? '0'}-{product.ageMax ?? '12+'} years
              </span>
            </div>
          )}

          {/* Variant Selector */}
          {variantOptions.length > 1 && (
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Select Variant</label>
              <Select
                value={selectedVariantIndex.toString()}
                onChange={(e) => setSelectedVariantIndex(parseInt(e.target.value, 10))}
              >
                {variantOptions.map((option, index) => (
                  <option key={option.variant.id} value={index.toString()}>
                    {option.label} - {formatPrice(option.variant.priceCents)}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {/* Variant Details */}
          {selectedVariant && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">SKU:</span> {selectedVariant?.sku || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Stock:</span>{' '}
                    <span
                      className={(selectedVariant?.stock ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}
                    >
                      {(selectedVariant?.stock ?? 0) > 0 ? `In Stock (${selectedVariant.stock})` : 'Out of Stock'}
                    </span>
                  </div>
                  {selectedVariant && Object.entries((selectedVariant.optionValues as Record<string, any>) || {}).map(
                    ([key, value]) => (
                      <div key={key}>
                        <span className="font-medium capitalize">{key}:</span> {String(value)}
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add to Cart */}
          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0}
            className="w-full"
            size="lg"
          >
            {selectedVariant && selectedVariant.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </main>
  );
}

