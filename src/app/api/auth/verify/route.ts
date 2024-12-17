import { connect } from '@/dbConfig/dbConfig';
import User from '@models/userModel';
import handleError from '@utils/error/handleError';
import { token } from '@utils/token/token';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('authToken')?.value;

    if (!authToken) {
      return NextResponse.json({ success: false, message: 'No auth token' }, { status: 401 });
    }

    const tokenData = await token.verify(authToken);
    if (!tokenData) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findById(tokenData.id).select(
      '-password -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry',
    );

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
        isCompanyMember: user.isCompanyMember,
        companyAccess: user.companyAccess,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    return handleError.api(error, false);
  }
}
