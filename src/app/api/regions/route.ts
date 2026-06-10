import { connectToDatabase, getSeedData } from '@/lib/db';
import Region from '@/lib/models/Region';

const APPROVED_REGION_SLUGS = [
  'europe',
  'america',
  'asia',
  'middle-east',
  'africa',
  'oceania',
  'global',
];

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

    const seedData = getSeedData();
    const seedRegions = Array.isArray(seedData?.regions) ? seedData.regions : [];
    const seedMap = new Map(
      seedRegions.map((region: any) => [normalizeSlug(String(region?.slug || region?.name || '')), region])
    );

    await Region.deleteMany({ slug: { $nin: APPROVED_REGION_SLUGS } });

    await Promise.all(
      APPROVED_REGION_SLUGS.map(async (slug) => {
        const seedRegion = seedMap.get(slug);
        const name = String(seedRegion?.name || slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')).trim();

        await Region.findOneAndUpdate(
          { slug },
          {
            $set: {
              name,
              description: String(seedRegion?.description || `Coverage desk for ${name}.`),
            },
          },
          { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        );
      })
    );

    const regions = await Region.find({ slug: { $in: APPROVED_REGION_SLUGS } }).sort({ name: 1 });
    return Response.json(regions);
  } catch (error: any) {
    const seedData = getSeedData();
    const fallbackRegions = (Array.isArray(seedData?.regions) ? seedData.regions : [])
      .filter((region: any) => APPROVED_REGION_SLUGS.includes(normalizeSlug(String(region?.slug || region?.name || ''))))
      .sort((a: any, b: any) => String(a.name || '').localeCompare(String(b.name || '')));

    if (fallbackRegions.length > 0) {
      return Response.json(fallbackRegions, { status: 200 });
    }

    return Response.json({ error: error.message || 'Failed to load regions.' }, { status: 500 });
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
    const name = String(body.name || '').trim();
    const slug = normalizeSlug(String(body.slug || name));

    if (!name || !slug) {
      return Response.json({ error: 'Name and slug are required.' }, { status: 400 });
    }

    const region = await Region.create({ name, slug, description: body.description || '' });
    return Response.json(region, { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Unable to create region.' }, { status: 500 });
  }
}
