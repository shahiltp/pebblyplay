import { NextResponse } from 'next/server';
import { getAbsoluteUrl } from '@/lib/site';

export async function GET() {
  const sitemapUrl = getAbsoluteUrl('/sitemap.xml');

  const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${sitemapUrl}
`.trim();

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

