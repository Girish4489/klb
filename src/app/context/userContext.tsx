// src/app/context/UserContext.tsx
'use client';
import { IUser, RoleType } from '@models/userModel';
import { logoutUtils } from '@util/auth/logoutUtils';
import handleError from '@util/error/handleError';
import { LocalIndexer } from '@util/indexing/indexingUtil';
import { ApiPut } from '@util/makeApiRequest/makeApiRequest';
import { fetchUserData } from '@util/user/userFetchUtil/userUtils';
import mongoose from 'mongoose';
import { usePathname, useRouter } from 'next/navigation';
import React, { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface UserContextProps {
  children: ReactNode;
}

interface UserContextType {
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  updateUser: (partialUpdate: Partial<IUser>) => void;
  fetchAndSetUser: () => void;
  updateUserAccess: (email: string, access: NonNullable<IUser['companyAccess']>['access']) => Promise<void>;
  updateUserRole: (email: string, role: RoleType) => Promise<void>;
  addUserAccessLevel: (email: string, accessLevels: RoleType[]) => Promise<void>;
  removeUserAccessLevel: (email: string, accessLevel: RoleType) => Promise<void>;
  updateUserSecondaryEmails: (email: string, secondaryEmails: string[]) => Promise<void>;
  updateUserMobile: (email: string, mobile: string[]) => Promise<void>;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: IUser | null;
  updateUser: (data: Partial<IUser>) => void;
  setAuthenticated: (status: boolean) => void;
}

// Separate Auth Context
export const AuthContext = createContext<AuthState | undefined>(undefined);

// Separate User Context
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
  const router = useRouter();
  const { isAuthenticated } = useAuth();

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
      localStorage.setItem('user', JSON.stringify(userData));

      if (userData.preferences) {
        document.documentElement.setAttribute('data-theme', userData.preferences.theme);
        if (userData.preferences.fonts) {
          document.body.style.fontFamily = userData.preferences.fonts.name ?? 'Roboto';
          document.body.style.fontWeight = userData.preferences.fonts.weight.toString() ?? '400';
        }
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      await logoutUtils.logout({
        onLogoutSuccess: () => {
          setUser(initialUserState);
        },
      });
    }
  }, []);

  const updateUser = useCallback((partialUpdate: Partial<IUser>) => {
    setUser((prevUser: IUser) => {
      const updatedUser: IUser = { ...prevUser, ...partialUpdate } as IUser;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const updateUserAccess = useCallback(async (email: string, access: NonNullable<IUser['companyAccess']>['access']) => {
    try {
      const response = await ApiPut.User.updateUserAccess(email, access);
      if (!response.success) throw new Error(response.message ?? 'Failed to update user access');

      setUser(
        (prevUser: IUser) =>
          ({
            ...prevUser,
            companyAccess: prevUser.companyAccess
              ? {
                  ...prevUser.companyAccess,
                  access: { ...prevUser.companyAccess.access, ...access },
                }
              : {
                  companyId: new mongoose.Types.ObjectId(),
                  role: 'guest',
                  access,
                  accessLevels: ['guest'],
                },
          }) as IUser,
      );
    } catch (error) {
      handleError.toastAndLog(error);
    }
  }, []);

  const updateUserRole = useCallback(async (email: string, role: RoleType) => {
    try {
      const response = await ApiPut.User.updateUserRole(email, role);
      if (!response.success) throw new Error(response.message ?? 'Failed to update user role');

      setUser(
        (prevUser: IUser) =>
          ({
            ...prevUser,
            companyAccess: prevUser.companyAccess
              ? {
                  ...prevUser.companyAccess,
                  role,
                }
              : {
                  companyId: new mongoose.Types.ObjectId(),
                  role,
                  access: initialUserState.companyAccess!.access,
                  accessLevels: ['guest'],
                },
          }) as IUser,
      );
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
    setIsClient(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (!pathname.startsWith('/auth/')) {
      fetchAndSetUser();
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (isAuthenticated) {
      // Only redirect if on auth pages or root
      if (pathname.startsWith('/auth/')) {
        router.push('/');
      }
    } else if (!pathname.startsWith('/auth/')) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, pathname, isClient, router]);

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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<IUser | null>(null);

  const updateUser = (data: Partial<IUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        ...data,
      } as IUser; // Use type assertion to handle mongoose Document methods
    });
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        // Check for existing user in localStorage first
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          setIsLoading(false);
          return; // Exit early if we have a stored user
        }

        // Only verify with server if no stored user
        const response = await fetch('/api/auth/verify', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Verification request failed');
        }

        const data = await response.json();

        if (data.success && data.user) {
          setIsAuthenticated(true);
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          throw new Error('Verification failed');
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      updateUser,
      setAuthenticated: setIsAuthenticated,
    }),
    [isAuthenticated, isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Make sure we export the interfaces and types that might be needed
export type { AuthState, UserContextType };
