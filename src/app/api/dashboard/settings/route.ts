// Import necessary modules and models
import { connect } from '@/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    const user = await User.findById(userId);

    // Make sure that the user exists
    if (!user) throw new Error('User not found');

    // Access the file through request.file
    const formData = await request.formData();
    const file = formData.get('profileImage') as File;

    // Check if a file was provided
    if (!file) throw new Error('No file provided');

    // Process the file, e.g., store it in MongoDB or perform other operations

    // Convert file to Buffer
    const fileData = Buffer.from(await file.arrayBuffer());

    // Add image data to the user document
    user.profileImage.__filename = file.name;
    user.profileImage.data = fileData;
    user.profileImage.contentType = file.type;
    user.profileImage.uploadAt = new Date();

    user.save();

    return NextResponse.json({ success: true, message: 'Profile updated' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
