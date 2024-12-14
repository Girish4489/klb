import { connect } from '@/dbConfig/dbConfig';
import { UserTokenData } from '@helpers/getDataFromToken';
import Company from '@models/companyModel';
import User from '@models/userModel';
import handleError from '@util/error/handleError';
import { NextRequest, NextResponse } from 'next/server';

connect();

/**
 * Handles the GET request to retrieve company access information for a user.
 *
 * This function expects a query parameter containing the user ID and role. It queries the database for the user
 * and returns the company access information based on the user's role.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the company access information and a success status.
 *
 * @throws {Error} - Throws an error if the request query parameters are invalid or if there is an issue with the database query.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    if (!userId || !role) throw new Error('Missing required parameters');

    const tokenData = await UserTokenData.create(request);
    if (userId !== tokenData.getId()) throw new Error('Invalid user operation');

    const user = await User.findById({ _id: userId }).select(
      '-password -username -email -isVerified -isAdmin -theme -profileImage -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry',
    );
    if (!user) throw new Error('Invalid user');
    if (!user.companyAccess || (!user.companyAccess.companyId && user.companyAccess.role !== 'owner'))
      throw new Error('You account not linked with your company\nPlease contact Admin/Hr for linking');
    if (!user.companyAccess.companyId && user.companyAccess.role === 'owner')
      throw new Error('Company not yet created\nPlease register company');

    // TODO: not tested this case
    if (user.companyAccess.role !== 'owner') {
      const company = await Company.findOne({ 'users.userId': userId }).lean();
      if (!company) throw new Error('Company not found');

      if (['owner', 'admin', 'hr'].includes(role)) {
        return NextResponse.json({ success: true, data: company });
      } else {
        // fetch company details in that user array will have this user datails
        const user = company.users.find((user) => user.userId.toString() === userId);
        return NextResponse.json({ success: true, data: { ...company, users: [user] } });
      }
    } else {
      // if user role is owner fetch whole company with all users
      const company = await Company.findOne({ _id: user.companyAccess.companyId });
      if (!company) throw new Error('Company not found');
      return NextResponse.json({ success: true, data: company, message: 'Company details fetched successfuly' });
    }
  } catch (error) {
    return handleError.api(error, false);
  }
}
