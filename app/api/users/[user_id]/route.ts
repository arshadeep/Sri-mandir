import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Collections } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/users/[user_id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params;

    // Validate ObjectId
    if (!ObjectId.isValid(user_id)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    const usersCollection = await getCollection(Collections.USERS);
    const user = await usersCollection.findOne({ _id: new ObjectId(user_id) });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Transform _id to id
    const { _id, ...userData } = user;
    return NextResponse.json({
      id: _id.toString(),
      ...userData,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
