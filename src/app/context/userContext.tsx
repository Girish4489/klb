// src/app/context/UserContext.tsx
'use client';
import { IUser, RoleType } from '@/models/userModel';
import handleError from '@util/error/handleError';
import { LocalIndexer } from '@util/indexing/indexingUtil';
import { ApiPut } from '@util/makeApiRequest/makeApiRequest';
import { fetchUserData } from '@util/user/userFetchUtil/userUtils';
import mongoose from 'mongoose';
import { usePathname } from 'next/navigation';
import React, { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface UserContextProps {
  children: ReactNode;
}

interface UserContextType {
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  updateUser: (partialUpdate: Partial<IUser>) => void;
  fetchAndSetUser: () => void;
  updateUserAccess: (email: string, access: IUser['companyAccess']['access']) => Promise<void>;
  updateUserRole: (email: string, role: RoleType) => Promise<void>;
  addUserAccessLevel: (email: string, accessLevels: RoleType[]) => Promise<void>;
  removeUserAccessLevel: (email: string, accessLevel: RoleType) => Promise<void>;
  updateUserSecondaryEmails: (email: string, secondaryEmails: string[]) => Promise<void>;
  updateUserMobile: (email: string, mobile: string[]) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
const userIndexer = new LocalIndexer<IUser>((user) => user.username);

const initialUserState: IUser = {
  _id: new mongoose.Types.ObjectId(),
  username: '',
  email: '',
  password: '',
  mobile: '',
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
  companyAccess: {
    companyId: new mongoose.Types.ObjectId(),
    role: 'guest',
    access: {
      login: true,
      canEdit: false,
      canDelete: false,
      canView: true,
    },
    accessLevels: ['guest'],
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  forgotPasswordToken: '',
  forgotPasswordTokenExpiry: new Date(),
  verifyToken: '',
  verifyTokenExpiry: new Date(),
  lastLogin: new Date(),
  notifications: [],
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
      const updatedUser: IUser = { ...prevUser, ...partialUpdate } as IUser;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const updateUserAccess = useCallback(async (email: string, access: IUser['companyAccess']['access']) => {
    try {
      const response = await ApiPut.User.updateUserAccess(email, access);
      if (!response.success) throw new Error(response.message ?? 'Failed to update user access');
      setUser((prevUser: IUser) => {
        const updatedUser: IUser = { ...prevUser } as IUser;
        if (updatedUser.companyAccess) {
          updatedUser.companyAccess.access = { ...updatedUser.companyAccess.access, ...access };
        }
        return updatedUser;
      });
    } catch (error) {
      handleError.toastAndLog(error);
    }
  }, []);

  const updateUserRole = useCallback(async (email: string, role: RoleType) => {
    try {
      const response = await ApiPut.User.updateUserRole(email, role);
      if (!response.success) throw new Error(response.message ?? 'Failed to update user role');
      setUser((prevUser: IUser) => {
        const updatedUser: IUser = { ...prevUser } as IUser;
        if (updatedUser.companyAccess) {
          updatedUser.companyAccess.role = role;
        }
        return updatedUser;
      });
    } catch (error) {
      handleError.toastAndLog(error);
    }
  }, []);

  const addUserAccessLevel = useCallback(async (email: string, accessLevels: RoleType[]) => {
    try {
      const response = await ApiPut.User.updateUserAccessLevels(email, accessLevels);
      if (!response.success) throw new Error(response.message ?? 'Failed to add user access levels');
      setUser((prevUser: IUser) => {
        const updatedUser: IUser = { ...prevUser } as IUser;
        if (updatedUser.companyAccess) {
          updatedUser.companyAccess.accessLevels = Array.from(
            new Set([...updatedUser.companyAccess.accessLevels, ...accessLevels]),
          );
        }
        return updatedUser;
      });
    } catch (error) {
      handleError.toastAndLog(error);
    }
  }, []);

  const removeUserAccessLevel = useCallback(async (email: string, accessLevel: RoleType) => {
    try {
      const response = await ApiPut.User.removeUserAccessLevel(email, accessLevel);
      if (!response.success) throw new Error(response.message ?? 'Failed to remove user access level');
      setUser((prevUser: IUser) => {
        const updatedUser: IUser = { ...prevUser } as IUser;
        if (updatedUser.companyAccess) {
          updatedUser.companyAccess.accessLevels = updatedUser.companyAccess.accessLevels.filter(
            (level) => level !== accessLevel,
          );
        }
        return updatedUser;
      });
    } catch (error) {
      handleError.toastAndLog(error);
    }
  }, []);

  const updateUserSecondaryEmails = useCallback(async (email: string, secondaryEmails: string[]) => {
    try {
      const response = await ApiPut.User.updateUserSecondaryEmails(email, secondaryEmails);
      if (!response.success) throw new Error(response.message ?? 'Failed to update secondary emails');
      setUser((prevUser: IUser) => {
        const updatedUser: IUser = { ...prevUser } as IUser;
        updatedUser.secondaryEmails = secondaryEmails;
        return updatedUser;
      });
    } catch (error) {
      handleError.toastAndLog(error);
    }
  }, []);

  const updateUserMobile = useCallback(async (email: string, mobile: string[]) => {
    try {
      const response = await ApiPut.User.updateUserMobile(email, mobile);
      if (!response.success) throw new Error(response.message ?? 'Failed to update user mobile');
      setUser((prevUser: IUser) => {
        const updatedUser: IUser = { ...prevUser } as IUser;
        updatedUser.mobile = mobile;
        return updatedUser;
      });
    } catch (error) {
      handleError.toastAndLog(error);
    }
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
    () => ({
      user,
      setUser,
      updateUser,
      fetchAndSetUser,
      updateUserAccess,
      updateUserRole,
      addUserAccessLevel,
      removeUserAccessLevel,
      updateUserSecondaryEmails,
      updateUserMobile,
    }),
    [
      user,
      updateUser,
      fetchAndSetUser,
      updateUserAccess,
      updateUserRole,
      addUserAccessLevel,
      removeUserAccessLevel,
      updateUserSecondaryEmails,
      updateUserMobile,
    ],
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
