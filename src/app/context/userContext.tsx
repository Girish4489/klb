// src/app/context/UserContext.tsx
'use client';
import { fetchUserData } from '@/app/util/user/userFetchUtil/userUtils';
import { IUser } from '@/models/userModel';
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface UserContextProps {
  children: ReactNode;
}

type UserState = Omit<IUser, 'password'>;

interface UserContextType {
  user: UserState;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
  updateUser: (partialUpdate: Partial<UserState>) => void;
  fetchAndSetUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserContextProps> = ({ children }) => {
  const [user, setUser] = useState<UserState>({
    username: '',
    email: '',
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
  } as UserState);

  // Function to fetch and set user data
  const fetchAndSetUser = useCallback(async () => {
    try {
      const userData = await fetchUserData();
      setUser(userData);

      document.documentElement.setAttribute('data-theme', userData.theme);
    } catch (error: any) {
      // console.error(error);
      toast.error(error.response.data.message + '\n😢 Please try sometime later or Login again');
    }
  }, []);

  const updateUser = useCallback((partialUpdate: Partial<UserState>) => {
    setUser((prevUser) => ({ ...prevUser, ...partialUpdate }));
  }, []);

  // Fetch and set user data on initial mount
  useEffect(() => {
    fetchAndSetUser();
  }, [fetchAndSetUser]);

  return <UserContext.Provider value={{ user, setUser, updateUser, fetchAndSetUser }}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};
