import { connect } from '@/dbConfig/dbConfig';
import User from '@models/userModel';
import handleError from '@util/error/handleError';
import { token } from '@util/token/token';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('authToken')?.value || '';

    if (!authToken) throw new Error('No token provided');

    const tokenData = await token.verify(authToken);

    if (!tokenData) throw new Error('Invalid token');

    const user = await User.findById(tokenData.id).select('-password');

    if (!user) throw new Error('User not found');

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Auth verification error:', error.message);
    } else {
      console.error('Auth verification error:', error);
    }
    return handleError.api(error, false);
  }
}
