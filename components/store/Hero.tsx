'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ToyShapes } from '@/components/art/ToyShapes';

interface HeroProps {
  headline?: string;
  subheadline?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  promoBadge?: string;
  showArt?: boolean;
  artVariant?: 'confetti' | 'blocks' | 'stars';
  className?: string;
}

export function Hero({
  headline = 'Play starts here.',
  subheadline = 'Thoughtfully curated toys for curious minds.',
  primaryCta = { label: 'Shop catalog', href: '/catalog' },
  secondaryCta = { label: 'New arrivals', href: '/catalog?sort=newest' },
  promoBadge = 'Free shipping over ₹999',
  showArt = false,
  artVariant = 'confetti',
  className,
}: HeroProps) {
  return (
    <section className={cn('relative w-full bg-gradient-to-b from-background to-muted/20 py-20 overflow-hidden', className)}>
      {/* Decorative art shapes */}
      {showArt && (
        <div className="absolute inset-0 pointer-events-none hidden sm:block" aria-hidden="true">
          <div className="absolute top-20 left-10 w-16 h-16 animate-float" style={{ animationDelay: '0s', animationDuration: '4s' }}>
            <ToyShapes variant={artVariant} opacity={0.2} />
          </div>
          <div className="absolute top-40 right-20 w-12 h-12 animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }}>
            <ToyShapes variant={artVariant} opacity={0.15} />
          </div>
          <div className="absolute bottom-20 left-1/4 w-10 h-10 animate-float" style={{ animationDelay: '2s', animationDuration: '6s' }}>
            <ToyShapes variant={artVariant} opacity={0.12} />
          </div>
          <div className="absolute bottom-40 right-1/3 w-14 h-14 animate-float" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}>
            <ToyShapes variant={artVariant} opacity={0.18} />
          </div>
        </div>
      )}

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

