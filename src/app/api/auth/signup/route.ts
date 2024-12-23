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

    //check if user already exists
    const user = await User.findOne({ email }).select(
      '-password -username -email -isVerified -isAdmin -theme -profileImage -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry',
    );

    if (user) throw new Error('User already exists');

    //hash password
    const hashedPassword = await bcryptUtil.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isCompanyMember: false, // Changed from newUser: true
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedUser = await newUser.save();

    //send verification email
    await sendEmail({ email, emailType: 'VERIFY', userId: savedUser._id.toString() });

    return NextResponse.json({
      message: 'Signup Successfull \n Please verify your email',
      success: true,
      savedUser,
    });
  } catch (error) {
    return handleError.api(error, false);
  }
}
