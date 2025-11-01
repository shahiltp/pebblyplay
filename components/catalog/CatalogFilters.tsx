'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface Props {
  categories: Array<{ id: string; name: string; slug: string }>;
  currentCategory?: string;
  currentSort?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
  currentAgeMin?: string;
  currentAgeMax?: string;
}

export function CatalogFilters({ categories, currentCategory, currentSort, currentMinPrice, currentMaxPrice, currentAgeMin, currentAgeMax }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const buildQueryString = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.delete('page'); // Reset to page 1 when filters change
    return params.toString();
  };

  const handleChange = (key: string, value: string) => {
    router.push(`?${buildQueryString({ [key]: value || undefined })}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Category</label>
        <Select
          defaultValue={currentCategory || ''}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Price Range</label>
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
            placeholder="Min ₹"
            defaultValue={currentMinPrice || ''}
          />
          <Input
            name="maxPrice"
            type="number"
            placeholder="Max ₹"
            defaultValue={currentMaxPrice || ''}
          />
          <Button type="submit" size="sm">Apply</Button>
        </form>
      </div>

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
            placeholder="Min age"
            defaultValue={currentAgeMin || ''}
          />
          <Input
            name="ageMax"
            type="number"
            placeholder="Max age"
            defaultValue={currentAgeMax || ''}
          />
          <Button type="submit" size="sm">Apply</Button>
        </form>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Sort By</label>
        <Select
          defaultValue={currentSort || 'newest'}
          onChange={(e) => handleChange('sort', e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </Select>
      </div>
    </div>
  );
}

