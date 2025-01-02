import { ReactNode } from 'react';

interface ToastMessages<T = unknown> {
  loading: ReactNode;
  success: ReactNode | ((data: T) => ReactNode);
  error: ReactNode | ((error: Error) => ReactNode);
}

const getDefaultDuration = (): number => {
  const storedUser = localStorage.getItem('user');
  const userPrefs = storedUser ? JSON.parse(storedUser).preferences?.toast : null;
  return userPrefs?.duration || 4000; // fallback to 4000ms if not set
};

export const toast = {
  success: (message: ReactNode, duration?: number): void => {
    const event = new CustomEvent('toast', {
      detail: { message, type: 'success', duration: duration || getDefaultDuration() },
    });
    window.dispatchEvent(event);
  },

  error: (message: ReactNode, duration?: number): void => {
    const event = new CustomEvent('toast', {
      detail: { message, type: 'error', duration: duration || getDefaultDuration() },
    });
    window.dispatchEvent(event);
  },

  info: (message: ReactNode, duration?: number): void => {
    const event = new CustomEvent('toast', {
      detail: { message, type: 'info', duration: duration || getDefaultDuration() },
    });
    window.dispatchEvent(event);
  },

  warning: (message: ReactNode, duration?: number): void => {
    const event = new CustomEvent('toast', {
      detail: { message, type: 'warning', duration: duration || getDefaultDuration() },
    });
    window.dispatchEvent(event);
  },

  dismiss: (id: string): void => {
    const event = new CustomEvent('toast-dismiss', {
      detail: { id },
    });
    window.dispatchEvent(event);
  },

  promise: <T,>(promise: Promise<T>, messages: ToastMessages<T>): Promise<T> => {
    let loadingToastId: string | undefined;

    const loadingEvent = new CustomEvent('toast-promise', {
      detail: {
        message: messages.loading,
        type: 'loading',
        duration: null, // Make loading toast persist
        className: 'animate-pulse', // Add pulse animation
        onOpen: (id: string): void => {
          loadingToastId = id;
        },
      },
    });

    window.dispatchEvent(loadingEvent);

    return promise
      .then((data) => {
        const successMessage = typeof messages.success === 'function' ? messages.success(data) : messages.success;

        if (loadingToastId) {
          const dismissEvent = new CustomEvent('toast-dismiss', {
            detail: { id: loadingToastId },
          });
          window.dispatchEvent(dismissEvent);
        }

        const successEvent = new CustomEvent('toast-promise-success', {
          detail: {
            message: successMessage,
            type: 'success',
            duration: getDefaultDuration(),
          },
        });

        window.dispatchEvent(successEvent);
        return data;
      })
      .catch((error) => {
        const errorMessage = typeof messages.error === 'function' ? messages.error(error) : messages.error;

        if (loadingToastId) {
          const dismissEvent = new CustomEvent('toast-dismiss', {
            detail: { id: loadingToastId },
          });
          window.dispatchEvent(dismissEvent);
        }

        const errorEvent = new CustomEvent('toast-promise-error', {
          detail: {
            message: errorMessage,
            type: 'error',
            duration: getDefaultDuration(),
          },
        });

        window.dispatchEvent(errorEvent);
        throw error;
      });
  },
};
