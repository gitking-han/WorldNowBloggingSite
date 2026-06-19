import { connectToDatabase } from '@/lib/db';
import Blog from '@/lib/models/Blog';
import { SITE_URL } from '@/lib/site';

const escapeXml = (value: string) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category')?.trim();
    const limit = Number(searchParams.get('limit') || 12);

    const query: any = { status: 'published' };
    if (category) {
      query.$or = [
        { category: { $regex: new RegExp(category, 'i') } },
        { categories: { $in: [new RegExp(category, 'i')] } },
      ];
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 }).limit(Math.max(1, Math.min(limit, 30)));
    const siteUrl = SITE_URL;

    const items = blogs
      .map((blog: any) => {
        const title = escapeXml(blog.title || 'Untitled article');
        const summary = escapeXml(blog.excerpt || blog.metaDescription || 'Read the latest WORLD NOW report.');
        const link = `${siteUrl}/blog/${blog.slug}`;
        return `  <item>
    <title>${title}</title>
    <link>${link}</link>
    <guid>${link}</guid>
    <description>${summary}</description>
    <pubDate>${new Date(blog.createdAt || Date.now()).toUTCString()}</pubDate>
  </item>`;
      })
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>WORLD NOW</title>\n    <link>${siteUrl}</link>\n    <description>Pakistan's independent news and analysis site covering politics, economy, technology, culture, and global affairs.</description>\n    <language>en-us</language>\n${items}\n  </channel>\n</rss>`;

    return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
