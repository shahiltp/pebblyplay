'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { formatINR } from '@/lib/money';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { addToCart } from '@/lib/cart';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { ImagePlaceholder } from '@/components/store/ImagePlaceholder';
import { Chip } from '@/components/ui/chip';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    images: Array<{ id: string; url: string; alt: string | null }>;
    variants: Array<{ id: string; priceCents: number; stock: number }>;
    ageMin: number | null;
    ageMax: number | null;
  };
  minPrice: number;
  className?: string;
}

function ReviewStars({ rating = 4.5 }: { rating?: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-yellow-400 text-sm">
          {i < fullStars ? '★' : i === fullStars && hasHalfStar ? '☆' : '☆'}
        </span>
      ))}
      <span className="text-xs text-muted-foreground ml-1">({rating})</span>
    </div>
  );
}

function AgeBadge({ ageMin, ageMax }: { ageMin: number | null; ageMax: number | null }) {
  if (ageMin === null && ageMax === null) return null;

  const ageText = ageMin !== null && ageMax !== null 
    ? `${ageMin}+`
    : ageMin !== null 
    ? `${ageMin}+`
    : `Up to ${ageMax}`;

  return (
    <Chip bg="rgba(79,70,229,0.18)">
      {ageText} years
    </Chip>
  );
}

export function ProductCard({ product, minPrice, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const firstImage = product.images[0];
  const isOutOfStock = product.variants.every((v) => v.stock === 0);
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  // Get in-stock variants
  const inStockVariants = product.variants.filter((v) => v.stock > 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If out of stock, show error
    if (isOutOfStock || inStockVariants.length === 0) {
      toast.error(`${product.title} is out of stock`);
      return;
    }

    // If only 1 in-stock variant, add it directly
    if (inStockVariants.length === 1) {
      const variant = inStockVariants[0];
      if (variant) {
        const userId = session?.user?.id || null;
        addToCart(variant.id, 1, userId);
        toast.success(`${product.title} added to cart`);
        
        // Dispatch event to update cart badge
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } else {
      // Multiple variants - navigate to product page for selection
      router.push(`/product/${product.slug}`);
    }
  };

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all',
        'hover:shadow-[0_14px_34px_rgba(15,23,42,0.08)] hover:-translate-y-0.5',
        isOutOfStock && 'opacity-60',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="block" aria-label={`View ${product.title}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-slate-100">
          {firstImage ? (
            <Image
              src={firstImage.url}
              alt={firstImage.alt || product.title}
              fill
              className={cn(
                'object-cover transition-transform duration-300',
                isHovered && !isOutOfStock && 'scale-105'
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <ImagePlaceholder />
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-lg font-semibold text-muted-foreground">Out of Stock</span>
            </div>
          )}
          {!isOutOfStock && isHovered && (
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <Button
                size="sm"
                onClick={handleQuickAdd}
                className="w-full"
                aria-label={`Quick add ${product.title} to cart`}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Quick Add
              </Button>
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base line-clamp-2 flex-1">{product.title}</h3>
            <AgeBadge ageMin={product.ageMin} ageMax={product.ageMax} />
          </div>
          <ReviewStars />
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xl font-bold text-primary">{formatINR(minPrice)}</p>
            {totalStock > 0 && totalStock < 10 && (
              <span className="text-xs text-warn">Only {totalStock} left!</span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}

