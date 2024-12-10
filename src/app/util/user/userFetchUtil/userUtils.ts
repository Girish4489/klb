import { IUser } from '@models/userModel';
import handleError from '@util/error/handleError';
import axios from 'axios';

const handleLogout = () => {
  // Clear all local storage data
  localStorage.clear();
  // Redirect to login page
  window.location.href = '/auth/login';
};

export async function fetchUserData() {
  try {
    const {
      data: { data: userData, success: userSuccess, message: userMessage },
    } = await axios.get('/api/auth/user');

    if (!userData || !userSuccess) {
      handleLogout();
      throw new Error(userMessage ?? 'User session expired. Please login again.');
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
          }
        : undefined,
      lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : new Date(),
      createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
      updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date(),
    } as IUser;
  } catch (error: unknown) {
    // If it's a 404 or 401 error, handle logout
    if (axios.isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 401)) {
      handleLogout();
    }
    handleError.throw(error);
  }
}

export { handleLogout };
