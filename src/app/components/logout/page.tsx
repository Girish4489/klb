'use client';
import { useCompany } from '@/app/context/companyContext';
import { useUser } from '@/app/context/userContext';
import { IUser } from '@/models/userModel';
import handleError from '@util/error/handleError';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'react-hot-toast';

export default function LogoutPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const { setCompany } = useCompany();

  const logout = async () => {
    try {
      const res = await axios.get('/api/auth/logout');
      if (res.data.success) {
        setUser({
          username: 'User',
          email: 'sample@example.com',
          profileImage: {
            data: new Uint8Array(),
            __filename: '',
            contentType: '',
            uploadAt: new Date(),
          },
          preferences: {
            theme: 'default',
            fonts: {
              name: 'Roboto',
              weight: 400,
            },
          },
          isVerified: false,
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as unknown as IUser);

        // Remove company details
        setCompany(undefined);
        localStorage.removeItem('company');

        toast.success(res.data.message ?? 'Logout successful');
        setTimeout(() => {
          router.push('/auth/login');
        }, 1000);
      } else {
        throw new Error(res.data.message ?? 'Failed to logout');
      }
    } catch (error) {
      handleError.toastAndLog(error);
    }
  };

  return (
    <React.Fragment>
      <span onClick={logout}>
        <button>Logout</button>
      </span>
    </React.Fragment>
  );
}
