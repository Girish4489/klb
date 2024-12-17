import { connect } from '@/dbConfig/dbConfig';
import { sendEmail } from '@helpers/mailer';
import User from '@models/userModel';
import handleError from '@utils/error/handleError';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    // fetch user password by email
    const user = await User.findOne({ email }).select(
      '-password -username -theme -profileImage -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry',
    );

    if (!user || user.email !== email) {
      throw new Error('User not found \n Invalid email address \n Please signup');
    }

    if (!user.isVerified) {
      throw new Error('Email not verified \n Verify from signup page');
    }

    // send email
    await sendEmail({
      email,
      emailType: 'RESET',
      userId: user._id.toString(),
    });
    return NextResponse.json({
      message: 'Check mail to reset password',
      success: true,
    });
  } catch (error) {
    return handleError.api(error, false);
  }
}
