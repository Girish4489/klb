// userUtils.ts
import { IUser } from '@/models/userModel';
import axios from 'axios';

export async function fetchUserData() {
  try {
    const theme = document.documentElement.getAttribute('data-theme');
    const {
      data: { data: userData },
    } = await axios.get('/api/auth/user');
    return {
      username: userData.username,
      email: userData.email,
      theme: userData.theme || theme || 'default',
      profileImage: {
        __filename: userData.profileImage?.__filename || 'USER_PROFILE_404_ERROR',
        data: userData.profileImage?.data,
        contentType: userData.profileImage?.contentType || 'image/webp',
        uploadAt: new Date(userData.profileImage?.uploadAt) || new Date(),
      },
      isVerified: userData.isVerified,
      isAdmin: userData.isAdmin,
      createdAt: new Date(userData.createdAt) || new Date(),
      updatedAt: new Date(userData.updatedAt) || new Date(),
    } as IUser;
  } catch (error: any) {
    throw error;
  }
}
