'use client';
import { IUser } from '@models/userModel';

export const AUTH_STORAGE_KEY = 'user';
export const INTENDED_URL_KEY = 'intendedUrl';

export const authUtils = {
  storeUser: (user: Partial<IUser>): void => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  },

  clearAuth: (): void => {
    localStorage.clear();
    sessionStorage.clear();
  },

  getIntendedUrl: (): string => {
    const url = new URLSearchParams(window.location.search).get('redirect');
    return url || '/dashboard';
  },
};
