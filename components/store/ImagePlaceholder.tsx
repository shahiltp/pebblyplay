import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImagePlaceholderProps {
  className?: string;
}

export function ImagePlaceholder({ className }: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'w-full h-full flex items-center justify-center bg-slate-100',
        className
      )}
      aria-hidden="true"
    >
      <Package className="w-12 h-12 text-slate-400" aria-hidden="true" />
    </div>
  );
}

