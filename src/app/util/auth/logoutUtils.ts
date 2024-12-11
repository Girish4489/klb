import { authUtils } from '@util/auth/authUtils';
import handleError from '@util/error/handleError';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const logoutUtils = {
  async logout(callbacks?: { onLogoutSuccess?: () => void; onLogoutError?: (error: unknown) => void }) {
    try {
      // Clear local storage first to prevent any race conditions
      authUtils.clearAuth();

      // Attempt to logout from server
      try {
        await axios.get('/api/auth/logout');
        await fetch('/api/auth/clear-cookie', {
          method: 'POST',
          credentials: 'include',
        });
      } catch (error) {
        console.error('Server logout failed:', error);
        // Continue with client-side logout even if server logout fails
      }

      toast.success('Logged out successfully');
      callbacks?.onLogoutSuccess?.();

      // Ensure redirect happens after callback
      setTimeout(() => {
        window.location.replace('/auth/login');
      }, 100);
    } catch (error) {
      handleError.toastAndLog(error);
      callbacks?.onLogoutError?.(error);
    }
  },
};
