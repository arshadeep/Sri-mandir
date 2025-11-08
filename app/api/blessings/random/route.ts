import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Collections } from '@/lib/db/mongodb';

// GET /api/blessings/random - Get a random blessing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deity = searchParams.get('deity');

    const blessingsCollection = await getCollection(Collections.BLESSINGS);

    // Build query
    const query: any = { active: true };

    if (deity) {
      query.$or = [{ deity }, { deity: null }];
    }

    // Get all matching blessings
    const blessings = await blessingsCollection.find(query).toArray();

    if (!blessings || blessings.length === 0) {
      // Return default blessing
      return NextResponse.json({
        text_en: 'May divine grace guide and protect you throughout your day.',
        tone: 'calm',
        deity: deity || null,
      });
    }

    // Select random blessing
    const randomIndex = Math.floor(Math.random() * blessings.length);
    const blessing = blessings[randomIndex];

    // Transform _id to id
    const { _id, ...blessingData } = blessing;

    return NextResponse.json({
      id: _id.toString(),
      ...blessingData,
    });
  } catch (error) {
    console.error('Error fetching random blessing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blessing' },
      { status: 500 }
    );
  }
}
