// userUtils.ts
import { IUser } from '@/models/userModel';

import axios from 'axios';
import handleError from '../../error/handleError';

export type UserState = Omit<IUser, 'password'>;

export async function fetchUserData() {
  const theme = document.documentElement.getAttribute('data-theme');
  try {
    const {
      data: { data: userData, success: userSuccess, message: userMessage },
    } = await axios.get('/api/auth/user');
    if (!userData) throw new Error('User not found' + '\n😢 Please try sometime later or Login again');
    if (!userSuccess)
      throw new Error(userMessage ?? 'Failed to fetch user data' + '\n😢 Please try sometime later or Login again');
    if (userSuccess) {
      return {
        username: userData.username,
        email: userData.email,
        profileImage: {
          __filename: userData.profileImage?.__filename || 'USER_PROFILE_404_ERROR',
          data: userData.profileImage?.data,
          contentType: userData.profileImage?.contentType || 'image/webp',
          uploadAt: userData.profileImage?.uploadAt ? new Date(userData.profileImage.uploadAt) : new Date(),
        },
        preferences: {
          theme: userData.theme || theme || 'default',
          fonts: {
            name: userData.preferences?.fonts?.name || 'Roboto',
            weight: userData.preferences?.fonts?.weight || 400,
          },
        },
        isVerified: userData.isVerified,
        isAdmin: userData.isAdmin,
        createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
        updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date(),
      } as UserState;
    }
  } catch (error) {
    // console.error(error);
    handleError.throw(error);
  }
}
