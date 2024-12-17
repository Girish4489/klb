// Import necessary modules and models
import { connect } from '@/dbConfig/dbConfig';
import { UserTokenData } from '@helpers/getDataFromToken';
import User from '@models/userModel';
import handleError from '@utils/error/handleError';
import { ImageMetadata } from '@utils/image/imageUtils';
import { NextRequest, NextResponse } from 'next/server';

connect();

async function getUserFromRequest(request: NextRequest) {
  const tokenData = await UserTokenData.create(request);
  const userId = tokenData.getId();
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  return user;
}

const DEFAULT_PROFILE_IMAGE = {
  __filename: 'USER_PROFILE_404_ERROR',
  data: '',
  contentType: '',
  size: 0,
  uploadAt: new Date(),
} as const;

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    const formData = await request.formData();

    const base64Data = formData.get('base64') as string;
    if (!base64Data) throw new Error('No image data provided');

    const metadata = JSON.parse(formData.get('metadata') as string) as ImageMetadata;
    if (!metadata) throw new Error('No metadata provided');

    user.profileImage = {
      __filename: metadata.filename,
      data: base64Data.split(',')[1],
      contentType: metadata.contentType,
      size: metadata.size,
      uploadAt: metadata.uploadedAt,
    };

    await user.save();
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profileImage: user.profileImage,
    });
  } catch (error) {
    return handleError.api(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    user.profileImage = DEFAULT_PROFILE_IMAGE;
    await user.save();
    return NextResponse.json({
      success: true,
      message: 'Profile image removed successfully',
      profileImage: DEFAULT_PROFILE_IMAGE,
    });
  } catch (error) {
    return handleError.api(error);
  }
}
