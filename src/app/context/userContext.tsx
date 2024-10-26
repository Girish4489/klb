// src/app/context/UserContext.tsx
'use client';
import handleError from '@/app/util/error/handleError';
import { fetchUserData, UserState } from '@/app/util/user/userFetchUtil/userUtils';
import { usePathname } from 'next/navigation';
import React, { createContext, ReactNode, useCallback, useContext, useEffect } from 'react';

interface UserContextProps {
  children: ReactNode;
}

interface UserContextType {
  user: UserState;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
  updateUser: (partialUpdate: Partial<UserState>) => void;
  fetchAndSetUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserContextProps> = ({ children }) => {
  const [user, setUser] = React.useState<UserState>({
    username: '',
    email: '',
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
  } as unknown as UserState);

  const pathname = usePathname();

  // Function to fetch and set user data
  const fetchAndSetUser = useCallback(async () => {
    try {
      const userData: UserState =
        (await fetchUserData()) ??
        (() => {
          throw new Error('Failed to fetch user data');
        })();
      setUser(userData);

      document.documentElement.setAttribute('data-theme', userData.preferences.theme);
      if (userData.preferences.fonts) {
        document.body.style.fontFamily = userData.preferences?.fonts?.name ?? 'Roboto';
        document.body.style.fontWeight = userData.preferences?.fonts?.weight.toString() ?? '400';
      }
    } catch (error) {
      handleError.toast(error);
    }
  }, []);

  const updateUser = useCallback((partialUpdate: Partial<UserState>) => {
    setUser((prevUser) => ({ ...prevUser, ...partialUpdate }));
  }, []);

  // Fetch and set user data on initial mount, except for /auth/* routes
  useEffect(() => {
    if (!pathname.startsWith('/auth')) {
      fetchAndSetUser();
    }
  }, [fetchAndSetUser, pathname]);

  return <UserContext.Provider value={{ user, setUser, updateUser, fetchAndSetUser }}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};
