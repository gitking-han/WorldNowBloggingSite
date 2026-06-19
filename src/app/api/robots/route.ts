import { SITE_URL } from '@/lib/site';

export async function GET() {
  const siteUrl = SITE_URL;
  const content = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\n\nSitemap: ${siteUrl}/sitemap.xml`;
  return new Response(content, { headers: { 'Content-Type': 'text/plain' } });
}
