import { cn } from '@/lib/utils';

interface BlobProps {
  className?: string;
}

export function Blob({ className }: BlobProps) {
  return (
    <svg
      aria-hidden
      focusable={false}
      className={cn('pointer-events-none', className)}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-primary)" />
          <stop offset="100%" stopColor="var(--brand-accent)" />
        </linearGradient>
        <filter id="blobBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
        </filter>
      </defs>
      <path
        d="M200 50 C250 50, 300 80, 320 130 C340 180, 330 230, 300 270 C270 310, 220 340, 170 330 C120 320, 80 280, 60 230 C40 180, 50 120, 90 80 C130 40, 180 30, 200 50 Z"
        fill="url(#blobGradient)"
        filter="url(#blobBlur)"
      />
    </svg>
  );
}

