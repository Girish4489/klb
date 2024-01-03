import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;

    const user = await User.findOne({
      verifyToken: token,
    }).select(
      '-username -email -isAdmin -theme -profileImage -forgotPasswordToken -forgotPasswordTokenExpiry -updatedAt -createdAt -__v',
    );

    if (!user) throw new Error('User not found or Link expired');

    if (user.verifyTokenExpiry.getTime() < Date.now()) throw new Error('Link expired');

    if (user.verifyToken !== token) throw new Error('Invalid token');

    if (user.isVerified) throw new Error('Email already verified');

    user.isVerified = true;
    user.verifyToken = '';
    user.verifyTokenExpiry = new Date();
    await user.save();

    return NextResponse.json({
      message: 'Email verified Successfully',
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}
