import bcryptUtil from '@/app/util/bcrypt/bcrypt';
import handleError from '@/app/util/error/handleError';
import { cookie, token } from '@/app/util/token/token';
import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
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
    const validPassword = await bcryptUtil.verify(password, user.password);
    if (!validPassword) throw new Error('Invalid password');

    // update last login
    user.lastLogin = new Date();

    // create token data
    const tokenData = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    };

    // create token
    const authToken = await token.create(tokenData, '1d');

    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
    });

    const tokenExpiry = await token.expiry(authToken);
    await cookie.set(response, authToken, tokenExpiry);

    return response;
  } catch (error) {
    return handleError.api(error, false);
  }
}
