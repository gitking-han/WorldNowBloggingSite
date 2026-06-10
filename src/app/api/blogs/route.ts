import { connectToDatabase, getSeedData } from '@/lib/db';
import Blog from '@/lib/models/Blog';

function matchesCategory(blog: any, category: string) {
  const categories = Array.isArray(blog.categories) ? blog.categories : [blog.category].filter(Boolean);
  return categories.some((item: string) => item.toLowerCase() === category.toLowerCase());
}

function matchesRegion(blog: any, region: string) {
  const regionValues = [blog.region, blog.location]
    .filter(Boolean)
    .map((value: string) => value.toLowerCase());

  return regionValues.some((value: string) => value === region.toLowerCase() || value.includes(region.toLowerCase()));
}

function filterBlogs(blogs: any[], category?: string | null, search?: string | null, status: string = 'published', region?: string | null) {
  return blogs
    .filter((blog) => (status ? blog.status === status : true))
    .filter((blog) => (!category ? true : matchesCategory(blog, category) || blog.category?.toLowerCase() === category.toLowerCase()))
    .filter((blog) => (!region ? true : matchesRegion(blog, region)))
    .filter((blog) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return [blog.title, blog.content, blog.excerpt, blog.location]
        .filter(Boolean)
        .some((value: string) => value.toLowerCase().includes(q));
    })
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const region = searchParams.get('region');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'published';

    await connectToDatabase();

    const filters: any[] = [{ status }];

    if (category) {
      filters.push({
        $or: [
          { categories: category },
          { category: category }
        ]
      });
    }

    if (region) {
      filters.push({
        $or: [
          { region: region },
          { location: region }
        ]
      });
    }

    const query = filters.length > 1 ? { $and: filters } : filters[0];

    let blogs = await Blog.find(query).sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      blogs = blogs.filter((b: any) =>
        b.title.toLowerCase().includes(q) ||
        b.content.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        (b.location && b.location.toLowerCase().includes(q))
      );
    }

    return Response.json(blogs);
  } catch (error: any) {
    const seedData = getSeedData();
    if (seedData?.blogs) {
      const { searchParams } = new URL(request.url);
      const category = searchParams.get('category');
      const region = searchParams.get('region');
      const search = searchParams.get('search');
      const status = searchParams.get('status') || 'published';

      return Response.json(filterBlogs(seedData.blogs, category, search, status, region), { status: 200 });
    }

    return Response.json({ error: error.message || 'Failed to load blog posts.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();

    const categories = Array.isArray(body.categories)
      ? body.categories.map((c: any) => c?.toString().trim()).filter(Boolean)
      : (typeof body.category === 'string' && body.category.trim()
        ? [body.category.trim()]
        : ['world']);
    const uniqueCategories = Array.from(new Set(categories));

    const baseSlug = body.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    const finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const newBlog = await Blog.create({
      title: body.title,
      slug: finalSlug,
      content: body.content,
      excerpt: body.excerpt || body.content.slice(0, 150),
      categories: uniqueCategories,
      category: uniqueCategories[0],
      region: body.region || body.location || '',
      location: body.location || body.region || '',
      tags: body.tags || [],
      featuredImage: body.featuredImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
      author: body.author || 'Editorial Correspondent',
      status: body.status || 'published',
      seoTitle: body.seoTitle || `${body.title} - WORLD NOW`,
      metaDescription: body.metaDescription || body.excerpt || '',
      isFeatured: body.isFeatured || false
    });

    if (body.isFeatured) {
      await Blog.updateMany({ _id: { $ne: newBlog._id }, isFeatured: true }, { isFeatured: false });
    }

    return Response.json(newBlog);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
