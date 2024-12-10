'use client';
import { useCompany } from '@context/companyContext';
import { useAuth } from '@context/userContext';
import { authUtils } from '@util/auth/authUtils';
import handleError from '@util/error/handleError';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function LogoutPage() {
  const router = useRouter();
  const { setAuthenticated } = useAuth();
  const { setCompany } = useCompany();

  const handleLogout = async () => {
    try {
      const res = await axios.get('/api/auth/logout');
      if (res.data.success) {
        setAuthenticated(false);
        setCompany(undefined);
        authUtils.clearAuth();
        // Call server API to clear cookie
        await fetch('/api/auth/clear-cookie', {
          method: 'POST',
          credentials: 'include',
        });
        toast.success('Logged out successfully');
        router.replace('/auth/login');
      }
    } catch (error) {
      handleError.toastAndLog(error);
    }
  };

  return (
    <button onClick={handleLogout} className="btn btn-error">
      Logout
    </button>
  );
}
