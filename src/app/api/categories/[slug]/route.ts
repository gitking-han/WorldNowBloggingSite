import { connectToDatabase } from '@/lib/db';
import Category from '@/lib/models/Category';

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();
    const name = String(body.name || '').trim();
    const slug = String(body.slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const category = await Category.findOneAndUpdate(
      { slug: params.slug },
      { name, slug, description: body.description || '' },
      { returnDocument: 'after' }
    );

    if (!category) {
      return Response.json({ error: 'Category not found.' }, { status: 404 });
    }

    return Response.json(category);
  } catch (error: any) {
    return Response.json({ error: error.message || 'Unable to update category.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const category = await Category.findOneAndDelete({ slug: params.slug });
    if (!category) {
      return Response.json({ error: 'Category not found.' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Unable to delete category.' }, { status: 500 });
  }
}
