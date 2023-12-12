import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/helpers/mailer';

connect();

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const { email } = reqBody;

  // fetch user password by email
  const user = await User.findOne({ email }).select('-password');
  if (!user || user == null || user == undefined) {
    return NextResponse.json({ error: 'User not found' }, { status: 400 });
  } else if (user.email !== email) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  } else if (user.isVerified === false) {
    return NextResponse.json({ error: 'Email not verified' }, { status: 400 });
  }

  try {
    if (user.email === email) {
      // send email
      await sendEmail({
        email,
        emailType: 'RESET',
        userId: user._id,
      });
      return NextResponse.json({
        message: 'check mail to reset password',
        success: true,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
