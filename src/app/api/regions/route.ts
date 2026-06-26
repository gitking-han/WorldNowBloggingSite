import { connectToDatabase, getSeedData, writeSeedData } from '@/lib/db';
import Region from '@/lib/models/Region';

function normalizeSlug(value: string) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET() {
  try {
    await connectToDatabase();
    const regions = await Region.find().sort({ name: 1 });
    if (Array.isArray(regions) && regions.length > 0) {
      return Response.json(regions);
    }
  } catch (error: any) {
    console.warn('Database unavailable for regions, using seed data:', error.message);
  }

  const seedData = getSeedData();
  const fallbackRegions = (Array.isArray(seedData?.regions) ? seedData.regions : [])
    .sort((a: any, b: any) => String(a.name || '').localeCompare(String(b.name || '')));

  if (fallbackRegions.length > 0) {
    return Response.json(fallbackRegions, { status: 200 });
  }

  return Response.json({ error: 'Failed to load regions.' }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const name = String(body.name || '').trim();
    const slug = normalizeSlug(String(body.slug || name));

    if (!name || !slug) {
      return Response.json({ error: 'Name and slug are required.' }, { status: 400 });
    }

    try {
      await connectToDatabase();
      const region = await Region.create({ name, slug, description: body.description || '' });
      return Response.json(region, { status: 201 });
    } catch (error: any) {
      const seedData = getSeedData() || { categories: [], regions: [], blogs: [], messages: [], seo: {} };
      const nextRegions = Array.isArray(seedData.regions) ? [...seedData.regions] : [];
      const existingRegion = nextRegions.find((item: any) => normalizeSlug(String(item.slug || item.name || '')) === slug);
      if (existingRegion) {
        return Response.json(existingRegion, { status: 200 });
      }
      const region = {
        _id: `seed-${Date.now()}`,
        name,
        slug,
        description: body.description || '',
        createdAt: new Date().toISOString(),
      };
      nextRegions.push(region);
      seedData.regions = nextRegions;
      writeSeedData(seedData);
      return Response.json(region, { status: 201 });
    }
  } catch (error: any) {
    return Response.json({ error: error.message || 'Unable to create region.' }, { status: 500 });
  }
}
