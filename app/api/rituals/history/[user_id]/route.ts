import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Collections } from '@/lib/db/mongodb';

// GET /api/rituals/history/[user_id] - Get ritual history for a user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params;

    // Get limit from query params (default: 100)
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    const ritualHistoryCollection = await getCollection(Collections.RITUAL_HISTORY);

    // Get ritual history sorted by date (newest first)
    const history = await ritualHistoryCollection
      .find({ user_id })
      .sort({ date: -1 })
      .limit(limit)
      .toArray();

    // Transform _id to id
    const transformedHistory = history.map((item) => {
      const { _id, ...historyData } = item;
      return {
        id: _id.toString(),
        ...historyData,
      };
    });

    return NextResponse.json(transformedHistory);
  } catch (error) {
    console.error('Error fetching ritual history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ritual history' },
      { status: 500 }
    );
  }
}
