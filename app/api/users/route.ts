import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Collections } from '@/lib/db/mongodb';
import { userCreateSchema } from '@/lib/schemas';
import { z } from 'zod';

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = userCreateSchema.parse(body);

    // Insert user into database
    const usersCollection = await getCollection(Collections.USERS);
    const userDoc = {
      ...validatedData,
      created_at: new Date().toISOString(),
    };

    const result = await usersCollection.insertOne(userDoc);

    const user = {
      id: result.insertedId.toString(),
      ...userDoc,
    };

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
