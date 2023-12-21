import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/helpers/mailer';

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    //check if user already exists
    const user = await User.findOne({ email: email }).select(
      '-password -username -isAdmin -theme -profileImage -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry',
    );
    if (!user) {
      return NextResponse.json({
        message: 'User not found',
        success: false,
      });
    }

    //send verification email
    if (!user.isVerified) {
      try {
        await sendEmail({
          email: email,
          emailType: 'VERIFY',
          userId: user._id,
        });
        return NextResponse.json({
          message: 'Email sent successfully',
          success: true,
        });
      } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
    if (user.isVerified) {
      return NextResponse.json({
        message: 'User already verified',
        success: false,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
