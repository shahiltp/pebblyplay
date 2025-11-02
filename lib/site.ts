/**
 * Site configuration for canonical URLs, meta tags, etc.
 * Update SITE_URL in production to your actual domain.
 */
export const siteConfig = {
  name: 'PebblyPlay',
  url: process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'https://pebblyplay.com',
  description: 'Delightful toys for curious minds. INR-first shop.',
} as const;

/**
 * Get absolute URL for a path
 */
export function getAbsoluteUrl(path: string): string {
  const base = siteConfig.url;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

