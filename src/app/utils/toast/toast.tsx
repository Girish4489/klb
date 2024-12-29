import PromiseToast from '@components/Toast/PromiseToast';
import StandardToast from '@components/Toast/StandardToast';
import { StandardToastType, ToastMessages } from '@components/Toast/types';
import { type ReactNode } from 'react';
import { toast as hotToast, type ToastOptions } from 'react-hot-toast';

const DEFAULT_OPTIONS: ToastOptions = {
  duration: 4000,
  style: {
    background: 'transparent',
    boxShadow: 'none',
    padding: 0,
    minWidth: 'auto',
  },
};

const createToast = (message: ReactNode, type: StandardToastType, options?: ToastOptions): string => {
  return hotToast.custom(<StandardToast message={message} type={type} />, {
    ...DEFAULT_OPTIONS,
    ...options,
  });
};

export const toast = {
  success: (message: ReactNode, options?: ToastOptions): string => createToast(message, 'success', options),

  error: (message: ReactNode, options?: ToastOptions): string => createToast(message, 'error', options),

  info: (message: ReactNode, options?: ToastOptions): string => createToast(message, 'info', options),

  warning: (message: ReactNode, options?: ToastOptions): string => createToast(message, 'warning', options),

  promise: <T,>(promise: Promise<T>, messages: ToastMessages<T> = {}, options?: ToastOptions): Promise<T> => {
    const toastId = 'promise-toast';

    // Show loading toast
    hotToast.custom(<PromiseToast message={messages.loading ?? 'Loading...'} state="loading" />, {
      ...DEFAULT_OPTIONS,
      ...options,
      id: toastId,
    });

    promise
      .then((data) => {
        const successMessage =
          typeof messages.success === 'function' ? messages.success(data) : (messages.success ?? 'Success!');

        hotToast.custom(<PromiseToast message={successMessage} state="success" />, {
          ...DEFAULT_OPTIONS,
          ...options,
          id: toastId,
        });
      })
      .catch((error) => {
        const errorMessage =
          typeof messages.error === 'function' ? messages.error(error) : (messages.error ?? 'Error!');

        hotToast.custom(<PromiseToast message={errorMessage} state="error" />, {
          ...DEFAULT_OPTIONS,
          ...options,
          id: toastId,
        });
      });

    return promise;
  },

  dismiss: hotToast.dismiss,
};
