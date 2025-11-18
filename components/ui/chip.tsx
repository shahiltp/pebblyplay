'use client';

import { withTextOn } from '@/lib/color';
import { cn } from '@/lib/utils';

interface ChipProps {
  bg?: string;
  className?: string;
  children: React.ReactNode;
}

export function Chip({ bg = 'rgba(226,232,240,1)', className, children }: ChipProps) {
  const { bg: safeBg, text } = withTextOn(bg);

  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-black/5', className)}
      style={{ backgroundColor: safeBg, color: text }}
    >
      {children}
    </span>
  );
}

