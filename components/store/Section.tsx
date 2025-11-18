import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ title, description, children, className }: SectionProps) {
  return (
    <section className={cn('py-12', className)}>
      <div className="container">
        {(title || description) && (
          <div className="mb-8 text-center">
            {title && (
              <h2 className="text-3xl font-bold font-display mb-2">{title}</h2>
            )}
            {description && (
              <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

