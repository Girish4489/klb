'use client';
import { useUser } from '@/app/context/userContext';
import handleError from '@/app/util/error/handleError';
import { IUser } from '@/models/userModel';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'react-hot-toast';

export default function LogoutPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const logout = async () => {
    try {
      await axios.get('/api/auth/logout');
      toast.success('Logout successful');
      setUser({
        username: 'User',
        email: 'sample@example.com',
        theme: 'default',
        profileImage: {
          data: new Uint8Array(),
          __filename: '',
          contentType: '',
          uploadAt: new Date(),
        },
        isVerified: false,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as IUser);
      setTimeout(() => {
        router.push('/auth/login');
      }, 1000);
    } catch (error) {
      // toast.error(error.message);
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
