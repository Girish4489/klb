import { IUser } from '@models/userModel';
import { logoutUtils } from '@utils/auth/logoutUtils';
import handleError from '@utils/error/handleError';
import axios from 'axios';

export async function fetchUserData(): Promise<IUser | undefined> {
  try {
    const response = await axios.get('/api/auth/user');
    const { data: userData, success, message } = response.data;

    if (!success || !userData) {
      await logoutUtils.logout({
        onLogoutError: (error) => {
          console.error('Logout failed during user fetch:', error);
        },
      });
      throw new Error(message || 'User session expired. Please login again.');
    }

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
            toast: {
              position: {
                vertical: userData.preferences.toast?.position?.vertical || 'top',
                horizontal: userData.preferences.toast?.position?.horizontal || 'center',
              },
              duration: userData.preferences.toast?.duration || 4000,
            },
          }
        : undefined,
      lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : new Date(),
      createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
      updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date(),
    } as IUser;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 401)) {
      await logoutUtils.logout({
        onLogoutError: (error) => {
          console.error('Logout failed during error handling:', error);
        },
      });
      throw new Error('Session expired. Please login again.');
    }
    handleError.throw(error as Error);
  }
}
