'use client';
import { StandardToastType } from '@components/Toast/types';
import { createContext, JSX, ReactNode, useCallback, useContext, useState } from 'react';

interface Toast {
  id: string;
  message: ReactNode;
  type: StandardToastType | 'loading';
  duration?: number;
  timeoutId?: ReturnType<typeof setTimeout>;
  remainingTime?: number;
  pauseTime?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: ReactNode, type: StandardToastType | 'loading', duration?: number) => string;
  updateToast: (id: string, message: ReactNode, type: StandardToastType) => void;
  removeToast: (id: string) => void;
  pauseToast: (id: string) => void;
  resumeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      // Clear existing timeout if any
      if (toast?.timeoutId) {
        clearTimeout(toast.timeoutId);
      }
      return prev.filter((toast) => toast.id !== id);
    });
  }, []);

  const startRemovalTimeout = useCallback(
    (id: string, duration: number) => {
      const timeoutId = setTimeout(() => removeToast(id), duration) as ReturnType<typeof setTimeout>;
      setToasts((prev) =>
        prev.map((toast) => (toast.id === id ? { ...toast, timeoutId, duration, remainingTime: duration } : toast)),
      );
    },
    [removeToast],
  );

  const addToast = useCallback(
    (message: ReactNode, type: StandardToastType | 'loading', duration?: number) => {
      const id = Math.random().toString(36).substr(2, 9);

      setToasts((prev) => [...prev, { id, message, type, duration }]);

      // Only set timeout for non-loading toasts
      if (duration && type !== 'loading') {
        startRemovalTimeout(id, duration);
      }

      return id;
    },
    [startRemovalTimeout],
  );

  const updateToast = useCallback(
    (id: string, message: ReactNode, type: StandardToastType) => {
      setToasts((prev) => {
        const toast = prev.find((t) => t.id === id);
        // Clear existing timeout if any
        if (toast?.timeoutId) {
          clearTimeout(toast.timeoutId);
        }
        return prev.map((toast) => (toast.id === id ? { ...toast, message, type, duration: 4000 } : toast));
      });

      // Start new timeout for updated toast
      startRemovalTimeout(id, 4000);
    },
    [startRemovalTimeout],
  );

  const pauseToast = useCallback((id: string) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      if (toast?.timeoutId) {
        clearTimeout(toast.timeoutId);
        const pauseTime = Date.now();
        const elapsedTime = pauseTime - (toast.pauseTime || pauseTime);
        const remainingTime = (toast.remainingTime || 0) - elapsedTime;

        return prev.map((t) => (t.id === id ? { ...t, timeoutId: undefined, remainingTime, pauseTime } : t));
      }
      return prev;
    });
  }, []);

  const resumeToast = useCallback(
    (id: string) => {
      setToasts((prev) => {
        const toast = prev.find((t) => t.id === id);
        if (toast?.remainingTime && toast?.remainingTime > 0) {
          const timeoutId = setTimeout(() => removeToast(id), toast.remainingTime);
          return prev.map((t) => (t.id === id ? { ...t, timeoutId, pauseTime: undefined } : t));
        }
        return prev;
      });
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, updateToast, removeToast, pauseToast, resumeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
