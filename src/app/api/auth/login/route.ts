import handleError from '@/app/util/error/handleError';
import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    //check if user exists
    const user = await User.findOne({ email }).select(
      '-theme -profileImage -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry',
    );
    if (!user) throw new Error('User does not exist');

    // check if user is verified
    const isVerified = user.isVerified;
    if (isVerified === false || null || undefined) throw new Error('User is not verified');

    //check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) throw new Error('Invalid password');

    //create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    //create token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: '1d',
    });

    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 86400000),
    });

    return response;
  } catch (error) {
    return handleError.api(error);
  }
}
