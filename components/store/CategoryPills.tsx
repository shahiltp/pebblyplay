'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryPillsProps {
  categories: Category[];
  className?: string;
}

const categoryIcons: Record<string, string> = {
  plush: '🧸',
  puzzles: '🧩',
  vehicles: '🚗',
  stem: '🔬',
};

export function CategoryPills({ categories, className }: CategoryPillsProps) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  return (
    <div className={cn('flex gap-3 overflow-x-auto pb-2 scrollbar-hide', className)}>
      {categories.map((category) => {
        const isActive = currentCategory === category.slug;
        const icon = categoryIcons[category.slug.toLowerCase()] || '🎁';

        return (
          <Link
            key={category.id}
            href={isActive ? '/catalog' : `/catalog?category=${category.slug}`}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
              isActive
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
            aria-label={`Filter by ${category.name}`}
            aria-current={isActive ? 'true' : undefined}
          >
            <span className="text-lg" aria-hidden="true">
              {icon}
            </span>
            <span>{category.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

