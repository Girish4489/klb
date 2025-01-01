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

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email is required',
          error: 'Please provide an email address',
        },
        { status: 400 },
      );
    }

    // Use lean() for better performance and only select needed fields
    const user = await User.findOne({ email }).select('_id email isVerified').lean();

    if (!user || !user._id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Account not found',
          error: 'Please check your email or sign up',
        },
        { status: 404 },
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email already verified',
          error: 'Please login to your account',
        },
        { status: 400 },
      );
    }

    const mailResponse = await sendEmail({
      email,
      emailType: 'VERIFY',
      userId: user._id.toString(), // Ensure ID is a string
    });

    if (!mailResponse.success) {
      console.error('Mail sending failed:', mailResponse.error);
      return NextResponse.json(
        {
          success: false,
          message: mailResponse.message,
          error: mailResponse.error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: 'Verification email sent successfully',
      success: true,
    });
  } catch (error) {
    console.error('Resend email error:', error);
    return handleError.api(error, false);
  }
}
