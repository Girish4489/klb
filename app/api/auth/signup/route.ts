import { connect } from '@/dbConfig/dbConfig';
import { sendEmail } from '@helpers/mailer';
import User from '@models/userModel';
import bcryptUtil from '@utils/bcrypt/bcrypt';
import handleError from '@utils/error/handleError';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    const user = await User.findOne({ email }).select('-password');
    if (user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email already registered',
          error: 'Please try logging in or use a different email',
        },
        { status: 400 },
      );
    }

    const hashedPassword = await bcryptUtil.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isCompanyMember: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedUser = await newUser.save();
    const mailResponse = await sendEmail({
      email,
      emailType: 'VERIFY',
      userId: savedUser._id.toString(),
    });

    if (!mailResponse.success) {
      await User.findByIdAndDelete(savedUser._id); // Rollback user creation
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to send verification email',
          error: mailResponse.error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: 'Signup successful! Please check your email for verification',
      success: true,
      savedUser,
    });
  } catch (error) {
    return handleError.api(error, false);
  }
}
