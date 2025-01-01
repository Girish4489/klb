import { ReactNode } from 'react';

// Type for StandardToast component
export type StandardToastType = 'success' | 'error' | 'info' | 'warning';

// Type for all possible toast states including loading and custom
export type ToastType = StandardToastType | 'loading' | 'custom';

export type PromiseToastState = 'loading' | 'success' | 'error';

export interface ToastMessages<T = unknown> {
  loading?: ReactNode;
  success?: ReactNode | ((data: T) => ReactNode);
  error?: ReactNode | ((error: Error) => ReactNode);
}

// Base HotToast interface
export interface HotToast {
  id: string;
  visible: boolean;
  type: string;
  duration?: number;
}

// Extend HotToast with our custom properties
export interface CustomToast extends Omit<HotToast, 'type'> {
  message: ReactNode;
  type: ToastType;
  promise?: boolean;
}

// Toast options interface
export interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  style?: React.CSSProperties;
}
