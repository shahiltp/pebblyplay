'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export function ProductListFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search')?.toString() || '';
    const status = searchParams.get('status') || '';

    const params = new URLSearchParams();
    if (search) {
      params.set('search', search);
    }
    if (status) {
      params.set('status', status);
    }

    // Use push to trigger navigation and page re-render
    const queryString = params.toString();
    router.push(queryString ? `/admin/products?${queryString}` : '/admin/products');
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    const search = searchParams.get('search') || '';

    const params = new URLSearchParams(searchParams.toString());
    
    // Update or remove status param
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    
    // Preserve search if it exists
    if (search) {
      params.set('search', search);
    }

    // Use push to trigger navigation and page re-render
    const queryString = params.toString();
    router.push(queryString ? `/admin/products?${queryString}` : '/admin/products');
  };

  return (
    <div className="flex gap-4 mb-6">
      <form method="get" onSubmit={handleSearch} className="flex-1">
        <Input
          name="search"
          placeholder="Search by title..."
          defaultValue={searchParams.get('search') || ''}
          className="max-w-md w-full"
        />
        <input type="hidden" name="status" value={searchParams.get('status') || ''} />
      </form>
      <div className="w-[150px] flex-shrink-0">
        <Select
          name="status"
          value={searchParams.get('status') || ''}
          onChange={handleStatusChange}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </Select>
      </div>
    </div>
  );
}

