import { connectToDatabase, getSeedData, writeSeedData } from '@/lib/db';
import Category from '@/lib/models/Category';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find();
    if (Array.isArray(categories) && categories.length > 0) {
      return Response.json(categories);
    }
  } catch (error: any) {
    console.warn('Database unavailable for categories, using seed data:', error.message);
  }

  const seedData = getSeedData();
  if (Array.isArray(seedData?.categories)) {
    return Response.json(seedData.categories, { status: 200 });
  }

  return Response.json({ error: 'Failed to load categories.' }, { status: 500 });
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

    const normalizedSlug = String(slug).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    try {
      const category = await Category.create({ name, slug: normalizedSlug, description });
      return Response.json(category, { status: 201 });
    } catch (error: any) {
      const seedData = getSeedData() || { categories: [], regions: [], blogs: [], messages: [], seo: {} };
      const nextCategories = Array.isArray(seedData.categories) ? [...seedData.categories] : [];
      const existingIndex = nextCategories.findIndex((item: any) => String(item.slug || '').toLowerCase() === normalizedSlug);
      if (existingIndex >= 0) {
        return Response.json(nextCategories[existingIndex], { status: 200 });
      }

      const category = {
        _id: `seed-${Date.now()}`,
        name,
        slug: normalizedSlug,
        description: description || '',
        createdAt: new Date().toISOString(),
      };
      nextCategories.push(category);
      seedData.categories = nextCategories;
      writeSeedData(seedData);
      return Response.json(category, { status: 201 });
    }
  } catch (error: any) {
    return Response.json({ error: error.message || 'Unable to create category.' }, { status: 500 });
  }
}
