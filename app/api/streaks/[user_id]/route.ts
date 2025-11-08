import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Collections } from '@/lib/db/mongodb';

// GET /api/streaks/[user_id] - Get streak for a user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params;

    const streaksCollection = await getCollection(Collections.STREAKS);
    const streak = await streaksCollection.findOne({ user_id });

    if (!streak) {
      // Initialize if not exists
      const newStreak = {
        user_id,
        current_streak: 0,
        longest_streak: 0,
        last_completed_date: null,
        grace_used_in_window: false,
        window_start_date: null,
      };

      await streaksCollection.insertOne(newStreak);
      return NextResponse.json(newStreak);
    }

    // Remove _id from response
    const { _id, ...streakData } = streak;
    return NextResponse.json(streakData);
  } catch (error) {
    console.error('Error fetching streak:', error);
    return NextResponse.json(
      { error: 'Failed to fetch streak' },
      { status: 500 }
    );
  }
}
