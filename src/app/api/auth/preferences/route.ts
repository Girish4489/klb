import { connect } from '@/dbConfig/dbConfig';
import { UserTokenData } from '@helpers/getDataFromToken';
import User from '@models/userModel';
import handleError from '@util/error/handleError';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest) {
  try {
    const tokenData = await UserTokenData.create(request);
    const userId = tokenData.getId();

    const formData = await request.json();
    const { preferences } = formData;
    if (!preferences) throw new Error('No preferences provided');

    const updateResult = await User.updateOne({ _id: userId }, { $set: { preferences } });
    if (updateResult.modifiedCount === 0 && updateResult.acknowledged)
      throw new Error('User not found or preferences not updated');

    const updatedUser = await User.findById(userId).select('preferences');
    if (!updatedUser) throw new Error('User not found after update');

    return NextResponse.json({
      success: true,
      message: 'Preferences Updated Successfully',
      preferences: updatedUser.preferences,
    });
  } catch (error) {
    return handleError.api(error);
  }
}
