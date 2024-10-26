import handleError from '@/app/util/error/handleError';
import { connect } from '@/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const reqBody = await request.json();

    const updateResult = await User.updateOne({ _id: userId }, { $set: { 'preferences.theme': reqBody.theme } });

    if (updateResult.modifiedCount === 0 && updateResult.matchedCount > 0) {
      throw new Error('Theme not updated');
    } else if (updateResult.matchedCount === 0) {
      throw new Error('User not found');
    }

    if (updateResult.modifiedCount > 0) {
      return NextResponse.json({
        message: 'Theme updated successfully',
        success: true,
      });
    } else {
      throw new Error('Theme not updated');
    }
  } catch (error) {
    return handleError.api(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select(
      '-password -__v -isAdmin -isVerified -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -profileImage -email',
    );
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({
      message: 'User found',
      success: true,
      user,
    });
  } catch (error) {
    return handleError.api(error);
  }
}
