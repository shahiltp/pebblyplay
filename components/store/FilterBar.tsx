'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown, Filter, X } from 'lucide-react';

interface FilterBarProps {
  categories: Array<{ id: string; name: string; slug: string }>;
  currentCategory?: string;
  currentSort?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
  currentAgeMin?: string;
  currentAgeMax?: string;
}

export function FilterBar({
  categories,
  currentCategory,
  currentSort = 'newest',
  currentMinPrice,
  currentMaxPrice,
  currentAgeMin,
  currentAgeMax,
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const buildQueryString = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.delete('page');
    return params.toString();
  };

  const handleChange = (key: string, value: string) => {
    router.push(`?${buildQueryString({ [key]: value || undefined })}`);
  };

  const clearFilters = () => {
    router.push('/catalog');
  };

  const hasActiveFilters = currentCategory || currentMinPrice || currentMaxPrice || currentAgeMin || currentAgeMax;

  return (
    <div
      className={cn(
        'bg-background border-b transition-all',
        isSticky && 'sticky top-0 z-40 shadow-md'
      )}
    >
      <div className="container py-4">
        {/* Mobile: Collapsible button */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full justify-between"
            aria-expanded={isOpen}
            aria-controls="filter-content"
          >
            <span className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                  Active
                </span>
              )}
            </span>
            <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
          </Button>
        </div>

        {/* Filter content */}
        <div
          id="filter-content"
          className={cn(
            'mt-4 lg:mt-0 space-y-4',
            !isOpen && 'hidden lg:block'
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sort */}
            <div>
              <label htmlFor="sort" className="text-sm font-medium mb-2 block">
                Sort By
              </label>
              <select
                id="sort"
                value={currentSort}
                onChange={(e) => handleChange('sort', e.target.value)}
                className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Sort products"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="text-sm font-medium mb-2 block">
                Category
              </label>
              <select
                id="category"
                value={currentCategory || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">Price Range (₹)</label>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  router.push(
                    `?${buildQueryString({
                      minPrice: formData.get('minPrice')?.toString(),
                      maxPrice: formData.get('maxPrice')?.toString(),
                    })}`
                  );
                }}
                className="flex gap-2"
              >
                <Input
                  name="minPrice"
                  type="number"
                  placeholder="Min"
                  defaultValue={currentMinPrice || ''}
                  className="rounded-2xl"
                  aria-label="Minimum price"
                />
                <Input
                  name="maxPrice"
                  type="number"
                  placeholder="Max"
                  defaultValue={currentMaxPrice || ''}
                  className="rounded-2xl"
                  aria-label="Maximum price"
                />
                <Button type="submit" size="sm" className="rounded-2xl">Apply</Button>
              </form>
            </div>

            {/* Age Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">Age Range</label>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  router.push(
                    `?${buildQueryString({
                      ageMin: formData.get('ageMin')?.toString(),
                      ageMax: formData.get('ageMax')?.toString(),
                    })}`
                  );
                }}
                className="flex gap-2"
              >
                <Input
                  name="ageMin"
                  type="number"
                  placeholder="Min"
                  defaultValue={currentAgeMin || ''}
                  className="rounded-2xl"
                  aria-label="Minimum age"
                />
                <Input
                  name="ageMax"
                  type="number"
                  placeholder="Max"
                  defaultValue={currentAgeMax || ''}
                  className="rounded-2xl"
                  aria-label="Maximum age"
                />
                <Button type="submit" size="sm" className="rounded-2xl">Apply</Button>
              </form>
            </div>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground"
                aria-label="Clear all filters"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

