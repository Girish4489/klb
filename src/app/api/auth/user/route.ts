import { connect } from '@/dbConfig/dbConfig';
import { UserTokenData } from '@/helpers/getDataFromToken';
import User from '@/models/userModel';
import handleError from '@util/error/handleError';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(request: NextRequest) {
  try {
    const tokenData = await UserTokenData.create(request);
    const userId = tokenData.getId();
    const user = await User.findOne({ _id: userId }).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({
      message: 'User found',
      data: user,
      success: true,
    });
  } catch (error) {
    return handleError.api(error, false);
  }
}
