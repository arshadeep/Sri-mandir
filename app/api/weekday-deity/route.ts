import { NextResponse } from 'next/server';
import { WEEKDAY_DEITY_MAP } from '@/lib/types';

// GET /api/weekday-deity - Get deity for current weekday
export async function GET() {
  try {
    // Get current weekday (0=Monday, 6=Sunday)
    const today = new Date();
    const weekday = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday

    // Convert to Monday-based (0=Monday)
    const mondayBasedWeekday = weekday === 0 ? 6 : weekday - 1;

    const deity = WEEKDAY_DEITY_MAP[mondayBasedWeekday];

    return NextResponse.json({
      weekday: mondayBasedWeekday,
      deity: deity || null,
      message: deity
        ? `Today is a day of devotion to ${deity}`
        : 'Continue your devotion today',
    });
  } catch (error) {
    console.error('Error getting weekday deity:', error);
    return NextResponse.json(
      { error: 'Failed to get weekday deity' },
      { status: 500 }
    );
  }
}
