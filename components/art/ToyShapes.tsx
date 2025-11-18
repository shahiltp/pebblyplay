import { cn } from '@/lib/utils';

interface ToyShapesProps {
  variant?: 'confetti' | 'blocks' | 'stars';
  className?: string;
  opacity?: number;
}

export function ToyShapes({ variant = 'confetti', className, opacity = 0.2 }: ToyShapesProps) {
  const baseProps = {
    'aria-hidden': true,
    focusable: false,
    className: cn('pointer-events-none', className),
    style: { opacity },
  };

  switch (variant) {
    case 'confetti':
      return (
        <svg
          {...baseProps}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Confetti shapes using brand colors */}
          <circle cx="30" cy="40" r="8" fill="var(--brand-primary)" />
          <circle cx="170" cy="60" r="6" fill="var(--brand-accent)" />
          <circle cx="50" cy="160" r="7" fill="#06B6D4" />
          <circle cx="150" cy="180" r="5" fill="#A855F7" />
          <rect x="80" y="30" width="12" height="12" rx="2" fill="var(--brand-primary)" />
          <rect x="120" y="140" width="10" height="10" rx="2" fill="var(--brand-accent)" />
          <rect x="40" y="100" width="8" height="8" rx="1" fill="#06B6D4" />
          <rect x="160" y="120" width="9" height="9" rx="1" fill="#A855F7" />
          <path
            d="M100 20 L105 30 L95 30 Z"
            fill="var(--brand-primary)"
          />
          <path
            d="M180 100 L185 110 L175 110 Z"
            fill="var(--brand-accent)"
          />
          <path
            d="M20 120 L25 130 L15 130 Z"
            fill="#06B6D4"
          />
        </svg>
      );

    case 'blocks':
      return (
        <svg
          {...baseProps}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Building blocks pattern */}
          <rect x="20" y="30" width="24" height="24" rx="4" fill="var(--brand-primary)" />
          <rect x="50" y="30" width="24" height="24" rx="4" fill="var(--brand-accent)" />
          <rect x="80" y="30" width="24" height="24" rx="4" fill="#06B6D4" />
          <rect x="35" y="60" width="24" height="24" rx="4" fill="#A855F7" />
          <rect x="65" y="60" width="24" height="24" rx="4" fill="var(--brand-primary)" />
          <rect x="20" y="90" width="24" height="24" rx="4" fill="var(--brand-accent)" />
          <rect x="50" y="90" width="24" height="24" rx="4" fill="#06B6D4" />
          <rect x="140" y="50" width="30" height="30" rx="5" fill="var(--brand-primary)" />
          <rect x="140" y="90" width="30" height="30" rx="5" fill="var(--brand-accent)" />
          <rect x="110" y="70" width="30" height="30" rx="5" fill="#06B6D4" />
          <rect x="150" y="130" width="25" height="25" rx="4" fill="#A855F7" />
        </svg>
      );

    case 'stars':
      return (
        <svg
          {...baseProps}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Star shapes */}
          <path
            d="M30 40 L32 46 L38 46 L33 50 L35 56 L30 52 L25 56 L27 50 L22 46 L28 46 Z"
            fill="var(--brand-primary)"
          />
          <path
            d="M170 60 L171 64 L175 64 L172 67 L173 71 L170 68 L167 71 L168 67 L165 64 L169 64 Z"
            fill="var(--brand-accent)"
          />
          <path
            d="M50 160 L51 164 L55 164 L52 167 L53 171 L50 168 L47 171 L48 167 L45 164 L49 164 Z"
            fill="#06B6D4"
          />
          <path
            d="M150 180 L151 184 L155 184 L152 187 L153 191 L150 188 L147 191 L148 187 L145 184 L149 184 Z"
            fill="#A855F7"
          />
          <path
            d="M100 30 L101 34 L105 34 L102 37 L103 41 L100 38 L97 41 L98 37 L95 34 L99 34 Z"
            fill="var(--brand-primary)"
          />
          <path
            d="M120 140 L121 144 L125 144 L122 147 L123 151 L120 148 L117 151 L118 147 L115 144 L119 144 Z"
            fill="var(--brand-accent)"
          />
          <path
            d="M180 120 L181 124 L185 124 L182 127 L183 131 L180 128 L177 131 L178 127 L175 124 L179 124 Z"
            fill="#06B6D4"
          />
        </svg>
      );

    default:
      return null;
  }
}

