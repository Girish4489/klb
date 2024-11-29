// Import necessary modules and models
import handleError from '@/app/util/error/handleError';
import { connect } from '@/dbConfig/dbConfig';
import { UserTokenData } from '@/helpers/getDataFromToken';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

connect();

async function getUserFromRequest(request: NextRequest) {
  const tokenData = await UserTokenData.create(request);
  const userId = tokenData.getId();
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  return user;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    const formData = await request.formData();
    const file = formData.get('profileImage') as File;

    if (!file) throw new Error('No file provided');

    const fileData = Buffer.from(await file.arrayBuffer());

    user.profileImage = {
      __filename: file.name,
      data: fileData.toString('base64'),
      contentType: file.type,
      uploadAt: new Date(),
    };

    await user.save();

    return NextResponse.json({ success: true, message: 'Profile updated', profileImage: user.profileImage });
  } catch (error) {
    return handleError.api(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    user.profileImage = {
      __filename: 'USER_PROFILE_404_ERROR',
      data: Buffer.from([]).toString('base64'),
      contentType: 'image/webp',
      uploadAt: new Date(),
    };

    await user.save();

    return NextResponse.json({ success: true, message: 'Profile image removed', profileImage: user.profileImage });
  } catch (error) {
    return handleError.api(error);
  }
}
