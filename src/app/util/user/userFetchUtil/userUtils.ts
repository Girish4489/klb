import handleError from '@/app/util/error/handleError';
import { IUser } from '@/models/userModel';
import axios from 'axios';

export async function fetchUserData() {
  try {
    const {
      data: { data: userData, success: userSuccess, message: userMessage },
    } = await axios.get('/api/auth/user');

    if (!userData) throw new Error('User not found' + '\n😢 Please try sometime later or Login again');
    if (!userSuccess)
      throw new Error(userMessage ?? 'Failed to fetch user data' + '\n😢 Please try sometime later or Login again');

    if (userSuccess) {
      return {
        ...userData,
        profileImage: userData.profileImage
          ? {
              __filename: userData.profileImage.__filename || 'USER_PROFILE_404_ERROR',
              data: userData.profileImage.data,
              contentType: userData.profileImage.contentType || 'image/webp',
              uploadAt: userData.profileImage.uploadAt ? new Date(userData.profileImage.uploadAt) : new Date(),
            }
          : undefined,
        preferences: userData.preferences
          ? {
              theme: userData.preferences.theme || 'default',
              fonts: {
                name: userData.preferences.fonts?.name || 'Roboto',
                weight: userData.preferences.fonts?.weight || 400,
              },
            }
          : undefined,
        lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : new Date(),
        createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
        updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date(),
      } as IUser;
    }
  } catch (error) {
    handleError.throw(error);
  }
}
