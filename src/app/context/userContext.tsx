// src/app/context/UserContext.tsx
import axios from 'axios';
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface UserContextProps {
  children: ReactNode;
}

interface UserData {
  username: string;
  email: string;
  theme: string;
  profileImage: string;
  isVerified: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

interface UserContextType {
  user: UserData;
  setUser: React.Dispatch<React.SetStateAction<UserData>>;
  updateUser: (partialUpdate: Partial<UserData>) => void;
  fetchAndSetUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserContextProps> = ({ children }) => {
  const [user, setUser] = useState<UserData>({
    username: 'User',
    email: 'sample@example.com',
    theme: 'default',
    profileImage: '/klm.webp',
    isVerified: false,
    isAdmin: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Function to update user details
  const updateUser = useCallback((partialUpdate: Partial<UserData>) => {
    setUser((prevUser) => ({ ...prevUser, ...partialUpdate }));
  }, []);

  // Function to fetch and set user data
  const fetchAndSetUser = useCallback(async () => {
    try {
      const theme = document.documentElement.getAttribute('data-theme');
      const {
        data: { data: userData },
      } = await axios.get('/api/auth/user');
      const base64Image = userData.profileImage?.data ? Buffer.from(userData.profileImage.data).toString('base64') : '';
      setUser({
        username: userData.username,
        email: userData.email,
        theme: userData.theme || theme || 'default',
        profileImage: base64Image ? `data:${userData.profileImage.contentType};base64,${base64Image}` : '',
        isVerified: userData.isVerified,
        isAdmin: userData.isAdmin,
        createdAt: userData.createdAt || new Date(),
        updatedAt: userData.updatedAt || new Date(),
      });

      document.documentElement.setAttribute('data-theme', userData.theme);
    } catch (error: any) {
      // Handle error
      // console.error(error);
      toast.error(error.response.data.message + '\n😢 Please try sometime later or Login again');
    }
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
