import { connectToDatabase, getSeedData } from '@/lib/db';
import Category from '@/lib/models/Category';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find();
    return Response.json(categories);
  } catch (error: any) {
    const seedData = getSeedData();
    if (seedData?.categories) {
      return Response.json(seedData.categories, { status: 200 });
    }

    return Response.json({ error: error.message || 'Failed to load categories.' }, { status: 500 });
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
    const { name, slug, description } = body;

    if (!name || !slug) {
      return Response.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const category = await Category.create({ name, slug: slug.toLowerCase(), description });
    return Response.json(category);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
