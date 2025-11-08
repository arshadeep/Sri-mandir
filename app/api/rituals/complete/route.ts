import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Collections } from '@/lib/db/mongodb';
import { ritualHistoryCreateSchema } from '@/lib/schemas';
import { z } from 'zod';

// POST /api/rituals/complete - Complete a ritual and update streak
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = ritualHistoryCreateSchema.parse(body);

    const ritualHistoryCollection = await getCollection(Collections.RITUAL_HISTORY);
    const streaksCollection = await getCollection(Collections.STREAKS);

    // Save ritual history
    const result = await ritualHistoryCollection.insertOne(validatedData);

    // Get or create streak
    let streak = await streaksCollection.findOne({ user_id: validatedData.user_id });

    if (!streak) {
      // Create new streak
      const newStreak = {
        user_id: validatedData.user_id,
        current_streak: 0,
        longest_streak: 0,
        last_completed_date: null,
        grace_used_in_window: false,
        window_start_date: null,
      };
      await streaksCollection.insertOne(newStreak);
      streak = await streaksCollection.findOne({ user_id: validatedData.user_id });
      if (!streak) {
        throw new Error('Failed to create streak');
      }
    }

    const today = validatedData.date;
    const lastCompleted = streak.last_completed_date;

    // Check if already completed today
    if (lastCompleted === today) {
      return NextResponse.json({
        message: 'Already completed today',
        streak: streak.current_streak,
      });
    }

    // Calculate new streak
    let newStreak = 1;

    if (lastCompleted) {
      const lastDate = new Date(lastCompleted);
      const currentDate = new Date(today);
      const daysDiff = Math.floor(
        (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 1) {
        // Consecutive day
        newStreak = (streak.current_streak || 0) + 1;
      } else if (daysDiff === 0) {
        // Same day (shouldn't happen)
        newStreak = streak.current_streak || 1;
      } else {
        // Gap - reset streak
        newStreak = 1;
      }
    }

    // Update streak
    const longestStreak = Math.max(streak.longest_streak || 0, newStreak);

    await streaksCollection.updateOne(
      { user_id: validatedData.user_id },
      {
        $set: {
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_completed_date: today,
        },
      }
    );

    // Check if milestone reached
    const milestones = [3, 7, 21, 40];
    const milestone = milestones.includes(newStreak);

    return NextResponse.json({
      message: 'Ritual completed',
      streak: newStreak,
      longest_streak: longestStreak,
      milestone,
      id: result.insertedId.toString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error completing ritual:', error);
    return NextResponse.json(
      { error: 'Failed to complete ritual' },
      { status: 500 }
    );
  }
}
