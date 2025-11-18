import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { withTextOn } from '@/lib/color';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Custom background color in hex format (with or without #).
   * When provided, text color will be automatically calculated for optimal contrast.
   */
  bg?: string;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, bg, style, ...props }, ref) => {
    // If custom bg is provided, calculate appropriate text color
    const customStyles = bg
      ? (() => {
          const { bg: normalizedBg, text } = withTextOn(bg);
          return {
            ...style,
            backgroundColor: normalizedBg,
            color: text,
          } as React.CSSProperties;
        })()
      : style;

    return (
      <div
        ref={ref}
        className={cn(
          badgeVariants({ variant }),
          bg && 'border-transparent focus:ring-2 focus:ring-offset-2',
          // Ensure focus ring is visible - use white ring on dark bg, dark ring on light bg
          bg && (withTextOn(bg).text === '#FFFFFF' 
            ? 'focus:ring-white' 
            : 'focus:ring-gray-900'),
          className
        )}
        style={customStyles}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

