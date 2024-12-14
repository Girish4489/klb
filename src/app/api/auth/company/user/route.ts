import { connect } from '@/dbConfig/dbConfig';
import User from '@models/userModel';
import handleError from '@util/error/handleError';
import { NextRequest, NextResponse } from 'next/server';

connect();

/**
 * Handles the POST request to retrieve company access information for users based on their emails.
 *
 * This function expects a JSON body containing an array of emails. It queries the database for users
 * with the provided emails and returns their email and company access information.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the company access information and a success status.
 *
 * @throws {Error} - Throws an error if the request body is invalid or if there is an issue with the database query.
 */
export async function POST(request: NextRequest) {
  try {
    const { emails } = await request.json();

    if (!emails || !Array.isArray(emails)) {
      throw new Error('Invalid request body');
    }

    const users = await User.find({ email: { $in: emails } }).select('email companyAccess mobile');

    const companyAccess = users.map((user) => ({
      email: user.email,
      companyAccess: user.companyAccess,
    }));

    return NextResponse.json({ data: companyAccess, success: true }, { status: 200 });
  } catch (error) {
    return handleError.api(error, false);
  }
}
