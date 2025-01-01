import { ReactNode } from 'react';
import { Toast as HotToast } from 'react-hot-toast';

// Type for StandardToast component
export type StandardToastType = 'success' | 'error' | 'info' | 'warning';

// Type for all possible toast states including loading and custom
export type ToastType = StandardToastType | 'loading' | 'custom';

export interface ToastMessages<T> {
  loading?: ReactNode;
  success?: ReactNode | ((data: T) => ReactNode);
  error?: ReactNode | ((error: Error) => ReactNode);
}

// Extend HotToast with our custom properties while keeping its original type property
export interface CustomToast extends Omit<HotToast, 'type'> {
  message: ReactNode;
  type: ToastType;
  promise?: boolean;
}
