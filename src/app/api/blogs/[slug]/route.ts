import { connectToDatabase, getSeedData } from '@/lib/db';
import Blog from '@/lib/models/Blog';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    await connectToDatabase();
    const slug = params.slug;

    const blog = await Blog.findOne({ slug });
    if (!blog) {
      const seedData = getSeedData();
      const fallbackBlog = Array.isArray(seedData?.blogs)
        ? seedData.blogs.find((entry: any) => entry.slug === slug)
        : null;

      if (fallbackBlog) {
        return Response.json(fallbackBlog, { status: 200 });
      }

      return Response.json({ error: 'Article not found' }, { status: 404 });
    }

    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

    const updated = await Blog.findById(blog._id);
    return Response.json(updated);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
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

    const updatedBlog = await Blog.findOneAndUpdate(
      { slug: params.slug },
      {
        title: body.title,
        content: body.content,
        excerpt: body.excerpt,
        categories: uniqueCategories,
        category: uniqueCategories[0],
        region: body.region || body.location || '',
        location: body.location || body.region || '',
        tags: body.tags || [],
        featuredImage: body.featuredImage,
        author: body.author,
        status: body.status,
        isFeatured: body.isFeatured,
        seoTitle: body.seoTitle,
        metaDescription: body.metaDescription
      },
      { returnDocument: 'after' }
    );

    if (body.isFeatured) {
      await Blog.updateMany({ _id: { $ne: updatedBlog._id }, isFeatured: true }, { isFeatured: false });
    }

    return Response.json(updatedBlog);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    await Blog.findOneAndDelete({ slug: params.slug });
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
