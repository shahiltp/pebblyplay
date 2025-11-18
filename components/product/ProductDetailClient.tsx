'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { addToCart } from '@/lib/cart';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { formatINR } from '@/lib/money';
import { ShoppingCart, Shield, Truck, RotateCcw, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
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

  function ReviewStars({ rating = 4.5 }: { rating?: number }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-lg">
            {i < fullStars ? '★' : i === fullStars && hasHalfStar ? '☆' : '☆'}
          </span>
        ))}
        <span className="text-sm text-muted-foreground ml-2">({rating})</span>
      </div>
    );
  }

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
    <main className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Media Gallery */}
        <div>
          <div className="aspect-square mb-4 rounded-2xl overflow-hidden bg-muted relative">
            {selectedImage ? (
              <Image
                src={selectedImage.url}
                alt={selectedImage.alt || product.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    'aspect-square rounded-xl overflow-hidden border-2 transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                    index === selectedImageIndex
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-transparent hover:border-muted-foreground/20'
                  )}
                  aria-label={`View image ${index + 1} of ${product.images.length}`}
                  aria-current={index === selectedImageIndex ? 'true' : undefined}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 12.5vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details - Sticky */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-6">
            <div>
              <Link
                href={`/catalog?category=${product.category.slug}`}
                className="text-sm text-accent hover:underline mb-2 inline-block"
              >
                {product.category.name}
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold font-display mb-3">{product.title}</h1>
              <ReviewStars />
            </div>

            <div>
              <div className="text-4xl font-bold text-primary mb-2">
                {selectedVariant ? formatINR(selectedVariant.priceCents) : 'Price not available'}
              </div>
              {(product.ageMin !== null || product.ageMax !== null) && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent/10 text-accent">
                  Ages {product.ageMin ?? '0'}-{product.ageMax ?? '12+'} years
                </div>
              )}
            </div>

            {product.description && (
              <div>
                <h2 className="font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Variant Selector - Chips */}
            {variantOptions.length > 1 && (
              <div>
                <label className="text-sm font-medium mb-3 block">Select Variant</label>
                <div className="flex flex-wrap gap-2">
                  {variantOptions.map((option, index) => {
                    const isSelected = index === selectedVariantIndex;
                    const options = (option.variant.optionValues as Record<string, any>) || {};
                    return (
                      <button
                        key={option.variant.id}
                        type="button"
                        onClick={() => setSelectedVariantIndex(index)}
                        className={cn(
                          'px-4 py-2 rounded-full text-sm font-medium transition-all',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                          isSelected
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        )}
                        aria-label={`Select variant: ${option.label}`}
                        aria-pressed={isSelected}
                      >
                        {Object.entries(options).map(([key, value]) => (
                          <span key={key}>
                            {key}: {String(value)}
                          </span>
                        ))}
                        {Object.keys(options).length === 0 && <span>{option.variant.sku}</span>}
                        <span className="ml-2">- {formatINR(option.variant.priceCents)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock Status */}
            {selectedVariant && (
              <div className="flex items-center gap-2">
                {(selectedVariant.stock ?? 0) > 0 ? (
                  <>
                    <Check className="w-5 h-5 text-success" aria-hidden="true" />
                    <span className="text-success font-medium">
                      In Stock ({selectedVariant.stock} available)
                    </span>
                  </>
                ) : (
                  <span className="text-danger font-medium">Out of Stock</span>
                )}
              </div>
            )}

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className="w-full"
              size="lg"
              aria-label={`Add ${product.title} to cart`}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {selectedVariant && selectedVariant.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <Shield className="w-6 h-6 text-primary mx-auto mb-2" aria-hidden="true" />
                <p className="text-xs text-muted-foreground">Safe Materials</p>
              </div>
              <div className="text-center">
                <Truck className="w-6 h-6 text-primary mx-auto mb-2" aria-hidden="true" />
                <p className="text-xs text-muted-foreground">Free Shipping</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 text-primary mx-auto mb-2" aria-hidden="true" />
                <p className="text-xs text-muted-foreground">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

