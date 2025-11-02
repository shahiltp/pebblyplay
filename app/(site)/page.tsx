import { Metadata } from 'next';
import { getAbsoluteUrl, siteConfig } from '@/lib/site';

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
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

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
      <main className="container py-10">
        <h1 className="text-3xl font-semibold">Welcome to PebblyPlay</h1>
        <p className="mt-2 text-muted-foreground">Delightful toys for curious minds. INR-first shop.</p>
      </main>
    </>
  );
}
