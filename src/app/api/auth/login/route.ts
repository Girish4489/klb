import { connect } from '@/dbConfig/dbConfig';
import Company from '@/models/companyModel';
import User from '@/models/userModel';
import bcryptUtil from '@util/bcrypt/bcrypt';
import handleError from '@util/error/handleError';
import { cookie, token } from '@util/token/token';
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

    // Fetch company details if user is not an owner
    let companyUser;
    if (user.companyAccess.role !== 'owner') {
      const company = await Company.findById(user.companyAccess.companyId);
      if (!company) throw new Error('Company does not exist');

      // Fetch user details from company users field
      companyUser = company.users.find((u) => u.userId.toString() === user._id.toString());
      if (!companyUser) throw new Error('User does not belong to this company');

      // Check if company user has login access
      if (!user.companyAccess.access.login) {
        throw new Error('User does not have login access in this company');
      }
    }

    // update last login
    user.lastLogin = new Date();

    // create token data
    const tokenData = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      companyAccess: user.companyAccess,
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
