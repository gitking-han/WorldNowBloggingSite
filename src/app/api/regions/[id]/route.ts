import { connectToDatabase, getSeedData, writeSeedData } from '@/lib/db';
import Region from '@/lib/models/Region';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await connectToDatabase();
      const body = await request.json();
      const updates: any = {};

      if (body.name) updates.name = body.name;
      if (body.description !== undefined) updates.description = body.description;
      if (body.slug) updates.slug = String(body.slug).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const region = await Region.findByIdAndUpdate(params.id, updates, { new: true });
      if (!region) {
        return Response.json({ error: 'Region not found.' }, { status: 404 });
      }

      return Response.json(region);
    } catch (error: any) {
      const seedData = getSeedData() || { categories: [], regions: [], blogs: [], messages: [], seo: {} };
      const nextRegions = Array.isArray(seedData.regions) ? [...seedData.regions] : [];
      const regionIndex = nextRegions.findIndex((item: any) => String(item._id || '').toLowerCase() === String(params.id).toLowerCase());
      if (regionIndex < 0) {
        return Response.json({ error: 'Region not found.' }, { status: 404 });
      }
      const body = await request.json();
      nextRegions[regionIndex] = {
        ...nextRegions[regionIndex],
        name: body.name || nextRegions[regionIndex].name,
        slug: body.slug ? String(body.slug).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : nextRegions[regionIndex].slug,
        description: body.description !== undefined ? body.description : nextRegions[regionIndex].description,
      };
      seedData.regions = nextRegions;
      writeSeedData(seedData);
      return Response.json(nextRegions[regionIndex]);
    }
  } catch (error: any) {
    return Response.json({ error: error.message || 'Unable to update region.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    try {
      await connectToDatabase();
      const deleted = await Region.findByIdAndDelete(params.id);
      if (!deleted) {
        return Response.json({ error: 'Region not found.' }, { status: 404 });
      }

      return Response.json({ success: true });
    } catch (error: any) {
      const seedData = getSeedData() || { categories: [], regions: [], blogs: [], messages: [], seo: {} };
      const nextRegions = Array.isArray(seedData.regions) ? seedData.regions.filter((item: any) => String(item._id || '').toLowerCase() !== String(params.id).toLowerCase()) : [];
      seedData.regions = nextRegions;
      writeSeedData(seedData);
      return Response.json({ success: true });
    }
  } catch (error: any) {
    return Response.json({ error: error.message || 'Unable to delete region.' }, { status: 500 });
  }
}
