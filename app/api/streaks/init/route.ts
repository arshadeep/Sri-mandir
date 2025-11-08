import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Collections } from '@/lib/db/mongodb';

// POST /api/streaks/init - Initialize streak for a user
export async function POST(request: NextRequest) {
  try {
    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    const streaksCollection = await getCollection(Collections.STREAKS);

    // Check if streak already exists
    const existing = await streaksCollection.findOne({ user_id });

    if (existing) {
      const { _id, ...streakData } = existing;
      return NextResponse.json(streakData);
    }

    // Create new streak
    const streakDoc = {
      user_id,
      current_streak: 0,
      longest_streak: 0,
      last_completed_date: null,
      grace_used_in_window: false,
      window_start_date: null,
    };

    await streaksCollection.insertOne(streakDoc);

    return NextResponse.json(streakDoc, { status: 201 });
  } catch (error) {
    console.error('Error initializing streak:', error);
    return NextResponse.json(
      { error: 'Failed to initialize streak' },
      { status: 500 }
    );
  }
}
