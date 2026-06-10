import { connectToDatabase } from '@/lib/db';
import Blog from '@/lib/models/Blog';

const staticRoutes = [
  ['', 'always', '1.0'],
  ['about', 'monthly', '0.8'],
  ['contact', 'monthly', '0.7'],
  ['policy', 'monthly', '0.6'],
  ['terms', 'monthly', '0.6'],
  ['disclaimer', 'monthly', '0.5'],
  ['rss', 'weekly', '0.6'],
];

export async function GET() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find({ status: 'published' }).sort({ updatedAt: -1 }).limit(200);
    const siteUrl = process.env.APP_URL || 'https://worldnow.news';

    const urls = staticRoutes
      .map(([path, changefreq, priority]) => `  <url>
    <loc>${siteUrl}/${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`)
      .join('\n');

    const articleUrls = blogs
      .map((blog: any) => `  <url>
    <loc>${siteUrl}/blog/${blog.slug}</loc>
    <lastmod>${new Date(blog.updatedAt || blog.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`)
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n${articleUrls}\n</urlset>`;

    return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
