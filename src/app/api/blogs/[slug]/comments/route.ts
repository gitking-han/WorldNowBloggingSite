import { connectToDatabase, getSeedData } from '@/lib/db';
import Blog from '@/lib/models/Blog';
import Comment from '@/lib/models/Comment';

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    await connectToDatabase();

    const blog = await Blog.findOne({ slug: params.slug });
    const seedData = getSeedData();
    const fallbackBlog = Array.isArray(seedData?.blogs)
      ? seedData.blogs.find((entry: any) => entry.slug === params.slug)
      : null;

    if (!blog && !fallbackBlog) {
      return Response.json({ error: 'Article not found' }, { status: 404 });
    }

    const comments = await Comment.find({ blogSlug: params.slug, status: 'approved' })
      .sort({ createdAt: -1 })
      .lean();

    return Response.json(comments, { status: 200 });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Unable to load comments.' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    await connectToDatabase();

    const blog = await Blog.findOne({ slug: params.slug });
    const seedData = getSeedData();
    const fallbackBlog = Array.isArray(seedData?.blogs)
      ? seedData.blogs.find((entry: any) => entry.slug === params.slug)
      : null;

    if (!blog && !fallbackBlog) {
      return Response.json({ error: 'Article not found' }, { status: 404 });
    }

    const body = await request.json();
    const name = String(body.name || '').trim();
    const content = String(body.content || '').trim();
    const email = String(body.email || '').trim();

    if (!name || !content) {
      return Response.json({ error: 'Name and comment are required.' }, { status: 400 });
    }

    const comment = await Comment.create({
      blogSlug: params.slug,
      blogTitle: (blog || fallbackBlog)?.title || params.slug,
      name,
      email: email || undefined,
      content,
      status: 'approved',
    });

    return Response.json(comment, { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Unable to post comment.' }, { status: 500 });
  }
}
