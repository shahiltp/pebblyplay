'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroProps {
  headline?: string;
  subheadline?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  promoBadge?: string;
  className?: string;
}

export function Hero({
  headline = 'Play starts here.',
  subheadline = 'Thoughtfully curated toys for curious minds.',
  primaryCta = { label: 'Shop catalog', href: '/catalog' },
  secondaryCta = { label: 'New arrivals', href: '/catalog?sort=newest' },
  promoBadge = 'Free shipping over ₹999',
  className,
}: HeroProps) {
  return (
    <section className={cn('relative w-full bg-gradient-to-b from-background to-muted/20 py-20 overflow-hidden', className)}>
      {/* Decorative floating shapes */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <ToyShape
          className="absolute top-20 left-10 w-16 h-16 text-primary/20 animate-float"
          style={{ animationDelay: '0s', animationDuration: '4s' }}
        />
        <ToyShape
          className="absolute top-40 right-20 w-12 h-12 text-accent/20 animate-float"
          style={{ animationDelay: '1s', animationDuration: '5s' }}
        />
        <ToyShape
          className="absolute bottom-20 left-1/4 w-10 h-10 text-primary/15 animate-float"
          style={{ animationDelay: '2s', animationDuration: '6s' }}
        />
        <ToyShape
          className="absolute bottom-40 right-1/3 w-14 h-14 text-accent/15 animate-float"
          style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}
        />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {promoBadge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <span>🎁</span>
              <span>{promoBadge}</span>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-display">
            {headline}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            {subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href={primaryCta.href as any}>{primaryCta.label}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link href={secondaryCta.href as any}>{secondaryCta.label}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ToyShape({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simple toy shape - teddy bear outline */}
      <circle cx="50" cy="35" r="15" />
      <ellipse cx="50" cy="65" rx="20" ry="25" />
      <circle cx="42" cy="32" r="3" />
      <circle cx="58" cy="32" r="3" />
      <path d="M 45 40 Q 50 45 55 40" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

