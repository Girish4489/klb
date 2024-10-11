import handleError from '@/app/util/error/handleError';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = NextResponse.json({
      message: 'Logout successful',
      success: true,
    });
    response.cookies.set('token', '', { httpOnly: true, expires: new Date(0) });
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error) {
    return handleError.api(error, false);
  }
}
