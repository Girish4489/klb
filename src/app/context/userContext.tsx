// src/app/context/UserContext.tsx
'use client';
import handleError from '@/app/util/error/handleError';
import { LocalIndexer } from '@/app/util/indexing/indexingUtil';
import { fetchUserData } from '@/app/util/user/userFetchUtil/userUtils';
import { IUser } from '@/models/userModel';
import mongoose from 'mongoose';
import { usePathname } from 'next/navigation';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface UserContextProps {
  children: ReactNode;
}

interface UserContextType {
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  updateUser: (partialUpdate: Partial<IUser>) => void;
  fetchAndSetUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
const userIndexer = new LocalIndexer<IUser>((user) => user.username);

const initialUserState: IUser = {
  _id: new mongoose.Types.ObjectId(),
  username: '',
  email: '',
  password: '',
  profileImage: {
    data: '',
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
  companyId: new mongoose.Types.ObjectId(),
  createdAt: new Date(),
  updatedAt: new Date(),
  forgotPasswordToken: '',
  forgotPasswordTokenExpiry: new Date(),
  verifyToken: '',
  verifyTokenExpiry: new Date(),
  lastLogin: new Date(),
  notifications: [],
  role: 'guest',
  accessLevels: [],
} as unknown as IUser;

export const UserProvider: React.FC<UserContextProps> = ({ children }) => {
  const [user, setUser] = React.useState<IUser>(initialUserState);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchAndSetUser = useCallback(async () => {
    try {
      const userData = await fetchUserData();
      if (!userData) {
        throw new Error('User data is undefined');
      }
      setUser(userData);
      userIndexer.add(userData);

      if (userData.preferences) {
        document.documentElement.setAttribute('data-theme', userData.preferences.theme);
        if (userData.preferences.fonts) {
          document.body.style.fontFamily = userData.preferences.fonts.name ?? 'Roboto';
          document.body.style.fontWeight = userData.preferences.fonts.weight.toString() ?? '400';
        }
      }

      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      handleError.toast(error);
    }
  }, []);

  const updateUser = useCallback((partialUpdate: Partial<IUser>) => {
    setUser((prevUser: IUser) => {
      const updatedUser = { ...prevUser, ...partialUpdate } as IUser;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (pathname.startsWith('/auth')) {
      setUser(initialUserState);
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      fetchAndSetUser();
    }
  }, [fetchAndSetUser, pathname, isClient]);

  const contextValue = useMemo(
    () => ({ user, setUser, updateUser, fetchAndSetUser }),
    [user, updateUser, fetchAndSetUser],
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};
