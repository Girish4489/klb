import handleError from '@utils/error/handleError';
import { cookie } from '@utils/token/token';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = NextResponse.json({
      message: 'Logout successful',
      success: true,
    });
    await cookie.set(response, '', 0);
    return response;
  } catch (error) {
    return handleError.api(error, false);
  }
}
