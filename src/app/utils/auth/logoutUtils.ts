import { authUtils } from '@utils/auth/authUtils';
import handleError from '@utils/error/handleError';
import axios from 'axios';

export const logoutUtils = {
  async logout(callbacks?: { onLogoutSuccess?: () => void; onLogoutError?: (error: unknown) => void }) {
    try {
      // Clear storage first
      authUtils.clearAuth();

      // Attempt server logout
      try {
        await Promise.all([
          axios.get('/api/auth/logout'),
          fetch('/api/auth/clear-cookie', {
            method: 'POST',
            credentials: 'include',
          }),
        ]);
      } catch (error) {
        console.error('Server logout failed:', error);
      }

      callbacks?.onLogoutSuccess?.();
    } catch (error) {
      handleError.toastAndLog(error);
      callbacks?.onLogoutError?.(error);
    }
  },
};