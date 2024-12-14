import { connect } from '@/dbConfig/dbConfig';
import User from '@models/userModel';
import handleError from '@util/error/handleError';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'User found',
      data: user,
      success: true,
    });
  } catch (error) {
    return handleError.api(error, false);
  }
}
