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
    const status = formData.get('status')?.toString() || '';

    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);

    router.push(`?${params.toString()}`);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    const search = searchParams.get('search') || '';

    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-4 mb-6">
      <form method="get" onSubmit={handleSearch} className="flex-1">
        <Input
          name="search"
          placeholder="Search by title..."
          defaultValue={searchParams.get('search') || ''}
          className="max-w-sm"
        />
        <input type="hidden" name="status" value={searchParams.get('status') || ''} />
      </form>
      <form method="get">
        <Select
          name="status"
          defaultValue={searchParams.get('status') || ''}
          onChange={handleStatusChange}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </Select>
        <input type="hidden" name="search" value={searchParams.get('search') || ''} />
      </form>
    </div>
  );
}

