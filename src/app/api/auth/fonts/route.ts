import handleError from '@/app/util/error/handleError';
import { connect } from '@/dbConfig/dbConfig';
import { TokenData } from '@/helpers/getDataFromToken';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest) {
  try {
    const tokenData = await TokenData.create(request);
    const userId = tokenData.getId();

    const formData = await request.json();
    const { fonts } = formData;
    if (!fonts) throw new Error('No fonts provided');

    const updateResult = await User.updateOne({ _id: userId }, { $set: { 'preferences.fonts': fonts } });
    if (updateResult.modifiedCount === 0 && updateResult.acknowledged)
      throw new Error('User not found or fonts not updated');

    return NextResponse.json({ success: true, message: 'Fonts Updated Successfully', fonts });
  } catch (error) {
    return handleError.api(error);
  }
}
