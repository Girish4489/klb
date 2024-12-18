import { connect } from '@/dbConfig/dbConfig';
import { sendEmail } from '@helpers/mailer';
import User from '@models/userModel';
import handleError from '@util/error/handleError';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    //check if user already exists
    const user = await User.findOne({ email: email }).select(
      '-password -username -isAdmin -theme -profileImage -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry',
    );

    if (!user) throw new Error('User not found');

    if (user.isVerified) throw new Error('User already verified');

    //send verification email
    await sendEmail({
      email: email,
      emailType: 'VERIFY',
      userId: user._id.toString(),
    });

    return NextResponse.json({
      message: 'Verification email sent',
      success: true,
    });
  } catch (error) {
    return handleError.api(error, false);
  }
}
