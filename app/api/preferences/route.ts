import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Collections } from '@/lib/db/mongodb';
import { preferencesCreateSchema } from '@/lib/schemas';
import { z } from 'zod';

// POST /api/preferences - Create or update preferences
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = preferencesCreateSchema.parse(body);

    const preferencesCollection = await getCollection(Collections.PREFERENCES);

    // Check if preferences already exist
    const existing = await preferencesCollection.findOne({
      user_id: validatedData.user_id,
    });

    if (existing) {
      // Update existing preferences
      await preferencesCollection.updateOne(
        { user_id: validatedData.user_id },
        { $set: validatedData }
      );
    } else {
      // Insert new preferences
      await preferencesCollection.insertOne(validatedData);
    }

    return NextResponse.json(validatedData, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating/updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to create/update preferences' },
      { status: 500 }
    );
  }
}
