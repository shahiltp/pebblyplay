import { Metadata } from 'next';
import { getAbsoluteUrl, siteConfig } from '@/lib/site';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: getAbsoluteUrl('/'),
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: getAbsoluteUrl('/'),
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: getAbsoluteUrl('/og-image.png'),
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [getAbsoluteUrl('/og-image.png')],
  },
};

const categoryCards = [
  {
    name: 'Plush',
    slug: 'plush',
    description: 'Soft and cuddly companions for every child',
  },
  {
    name: 'Puzzles',
    slug: 'puzzles',
    description: 'Brain-teasing fun for developing minds',
  },
  {
    name: 'STEM',
    slug: 'stem',
    description: 'Science, technology, engineering, and math toys',
  },
];

export default function HomePage() {
  // Organization JSON-LD
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    sameAs: [] as string[],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-background to-muted/20 py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-display">
              Play starts here.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Thoughtfully curated toys for curious minds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/catalog">Shop catalog</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link href="/catalog?sort=newest">New arrivals</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards Section */}
      <section className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categoryCards.map((category) => (
            <Card key={category.slug} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/catalog?category=${category.slug}`}>Explore {category.name}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
