import bcryptUtil from '@/app/util/bcrypt/bcrypt';
import handleError from '@/app/util/error/handleError';
import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token, password } = reqBody;
    const user = await User.findOne({
      forgotPasswordToken: token,
    }).select('-username -email -isVerified -isAdmin -theme -profileImage  -verifyToken -verifyTokenExpiry');

    if (!user) {
      throw new Error('User not found or Link expired');
    }
    if (user.forgotPasswordTokenExpiry.getTime() < Date.now()) {
      throw new Error('Link expired');
    }
    if (user.forgotPasswordToken !== token) {
      throw new Error('Invalid token');
    }

    const prevHashedPassword = user.password;
    const isSamePassword = await bcryptUtil.verify(password, prevHashedPassword);
    if (isSamePassword) {
      throw new Error('New password cannot be the same as the old password');
    }

    //hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    user.password = hashedPassword;
    user.forgotPasswordToken = '';
    user.forgotPasswordTokenExpiry = new Date();
    user.updatedAt = new Date();
    await user.save();

    return NextResponse.json({
      message: 'Password reset successfully',
      success: true,
    });
  } catch (error) {
    return handleError.api(error, false);
  }
}
