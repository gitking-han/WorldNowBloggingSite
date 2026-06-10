export async function GET() {
  const siteUrl = process.env.APP_URL || 'https://worldnow.news';
  const content = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\n\nSitemap: ${siteUrl}/sitemap.xml`;
  return new Response(content, { headers: { 'Content-Type': 'text/plain' } });
}
