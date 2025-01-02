import { connect } from '@/dbConfig/dbConfig';
import Company from '@models/companyModel';
import User from '@models/userModel';
import bcryptUtil from '@utils/bcrypt/bcrypt';
import handleError from '@utils/error/handleError';
import { token } from '@utils/token/token';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // Check if user exists
    const user = await User.findOne({ email }).select(
      '-theme -profileImage -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry',
    );
    if (!user) throw new Error('User does not exist');

    // Check if user is verified
    if (!user.isVerified) throw new Error('User is not verified');

    // Check if password is correct
    const validPassword = await bcryptUtil.verify(password, user.password);
    if (!validPassword) throw new Error('Invalid password');

    // Fetch company details only if user is a company member and not an owner
    if (user.isCompanyMember && user.companyAccess?.role !== 'owner') {
      const company = await Company.findById(user.companyAccess?.companyId);
      if (!company) throw new Error('Company does not exist');

      const companyUser = company.users.find((u) => u.userId.toString() === user._id.toString());
      if (!companyUser) throw new Error('User does not belong to this company');

      if (!user.companyAccess?.access.login) {
        throw new Error('User does not have login access in this company');
      }
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create token data
    const tokenData = {
      _id: user._id, // Added _id field
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      isCompanyMember: user.isCompanyMember,
      companyAccess: user.companyAccess,
      lastLogin: user.lastLogin,
    };

    // Create token
    const authToken = await token.create(tokenData, '1d');
    if (!authToken) {
      throw new Error('Failed to create authentication token');
    }

    const tokenExpiry = await token.expiry(authToken);
    if (!tokenExpiry) {
      throw new Error('Failed to get token expiry');
    }

    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
        isCompanyMember: user.isCompanyMember,
        companyAccess: user.companyAccess,
      },
    });

    // Set cookie with proper security options
    response.cookies.set('authToken', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(tokenExpiry * 1000),
    });

    return response;
  } catch (error) {
    return handleError.api(error, false);
  }
}
