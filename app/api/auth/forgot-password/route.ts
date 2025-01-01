import { connect } from '@/dbConfig/dbConfig';
import { sendEmail } from '@helpers/mailer';
import User from '@models/userModel';
import handleError from '@utils/error/handleError';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    const user = await User.findOne({ email }).select('-password');
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Account not found',
          error: 'Please check your email or sign up',
        },
        { status: 404 },
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email not verified',
          error: 'Please verify your email first through the signup page',
        },
        { status: 400 },
      );
    }

    const mailResponse = await sendEmail({
      email,
      emailType: 'RESET',
      userId: user._id.toString(),
    });

    if (!mailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to send reset email',
          error: mailResponse.error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: 'Password reset link sent to your email',
      success: true,
    });
  } catch (error) {
    return handleError.api(error, false);
  }
}
