// userUtils.ts
import { IUser } from '@/models/userModel';
import axios from 'axios';
import handleError from '../../error/handleError';

export async function fetchUserData() {
  const theme = document.documentElement.getAttribute('data-theme');
  try {
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
        uploadAt: userData.profileImage?.uploadAt ? new Date(userData.profileImage.uploadAt) : new Date(),
      },
      isVerified: userData.isVerified,
      isAdmin: userData.isAdmin,
      createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
      updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date(),
    } as IUser;
  } catch (error) {
    // console.error(error);
    handleError.throw(error);
  }
}
