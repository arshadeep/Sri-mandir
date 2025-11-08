import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Collections } from '@/lib/db/mongodb';
import { preferencesCreateSchema } from '@/lib/schemas';
import { z } from 'zod';

// GET /api/preferences/[user_id] - Get user preferences
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params;

    const preferencesCollection = await getCollection(Collections.PREFERENCES);
    const preferences = await preferencesCollection.findOne({ user_id });

    if (!preferences) {
      return NextResponse.json(
        { error: 'Preferences not found' },
        { status: 404 }
      );
    }

    // Remove _id from response
    const { _id, ...prefsData } = preferences;
    return NextResponse.json(prefsData);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

// PUT /api/preferences/[user_id] - Update user preferences
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params;
    const body = await request.json();

    // Validate request body
    const validatedData = preferencesCreateSchema.parse({
      ...body,
      user_id, // Ensure user_id from params is used
    });

    const preferencesCollection = await getCollection(Collections.PREFERENCES);

    // Update preferences
    await preferencesCollection.updateOne(
      { user_id },
      { $set: validatedData },
      { upsert: true } // Create if doesn't exist
    );

    return NextResponse.json(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}
