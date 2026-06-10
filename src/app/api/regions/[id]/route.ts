import { connectToDatabase } from '@/lib/db';
import Region from '@/lib/models/Region';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
    return Response.json({ error: error.message || 'Unable to update region.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const deleted = await Region.findByIdAndDelete(params.id);
    if (!deleted) {
      return Response.json({ error: 'Region not found.' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Unable to delete region.' }, { status: 500 });
  }
}
