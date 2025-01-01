'use client';
import { useToast } from '@context/ToastContext';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { JSX, useEffect, useRef, useState } from 'react';

export const DaisyToast = (): JSX.Element => {
  const { toasts, removeToast, addToast, updateToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const loadingToastId = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleToast = (event: CustomEvent): void => {
      const { message, type, duration } = event.detail;
      addToast(message, type, duration);
    };

    const handleToastDismiss = (event: CustomEvent): void => {
      const { id } = event.detail;
      removeToast(id);
    };

    const handlePromise = (event: CustomEvent): void => {
      const { message, type } = event.detail;
      loadingToastId.current = addToast(message, type);
    };

    const handlePromiseSuccess = (event: CustomEvent): void => {
      if (loadingToastId.current) {
        const { message, type } = event.detail;
        updateToast(loadingToastId.current, message, type);
        loadingToastId.current = null;
      }
    };

    const handlePromiseError = (event: CustomEvent): void => {
      if (loadingToastId.current) {
        const { message, type } = event.detail;
        updateToast(loadingToastId.current, message, type);
        loadingToastId.current = null;
      }
    };

    window.addEventListener('toast', handleToast as EventListener);
    window.addEventListener('toast-dismiss', handleToastDismiss as EventListener);
    window.addEventListener('toast-promise', handlePromise as EventListener);
    window.addEventListener('toast-promise-success', handlePromiseSuccess as EventListener);
    window.addEventListener('toast-promise-error', handlePromiseError as EventListener);

    return (): void => {
      window.removeEventListener('toast', handleToast as EventListener);
      window.removeEventListener('toast-dismiss', handleToastDismiss as EventListener);
      window.removeEventListener('toast-promise', handlePromise as EventListener);
      window.removeEventListener('toast-promise-success', handlePromiseSuccess as EventListener);
      window.removeEventListener('toast-promise-error', handlePromiseError as EventListener);
    };
  }, [addToast, removeToast, updateToast]);

  if (!mounted) return <></>;

  // Get user preferences for position from localStorage
  const storedUser = localStorage.getItem('user');
  const userPrefs = storedUser ? JSON.parse(storedUser).preferences?.toast : null;

  const position = {
    vertical: userPrefs?.position?.vertical || 'top',
    horizontal: userPrefs?.position?.horizontal || 'center',
  };

  const toastPositionClasses = `toast-${position.vertical} toast-${position.horizontal}`;

  const getIcon = (type: string): JSX.Element | null => {
    switch (type) {
      case 'loading':
        return <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />;
      case 'success':
        return <CheckCircleIcon className="h-6 w-6" />;
      case 'error':
        return <XCircleIcon className="h-6 w-6" />;
      case 'info':
        return <InformationCircleIcon className="h-6 w-6" />;
      case 'warning':
        return <ExclamationCircleIcon className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const getAlertClasses = (type: string): string => {
    if (type === 'loading') {
      return 'bg-base-300 ring-2 ring-info ring-opacity-50';
    }
    return `alert-${type}`;
  };

  return (
    <div className={`toast ${toastPositionClasses} z-[100] space-y-1`}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`alert ${getAlertClasses(toast.type)} alert-soft w-[calc(100vw-2rem)]
            max-w-[90vw] shadow-lg
            sm:w-auto sm:min-w-[300px] sm:max-w-[400px]
            md:max-w-[500px]
          `}
          role="alert"
        >
          {getIcon(toast.type)}
          <span className="flex-1 break-words">{toast.message}</span>
          {toast.type !== 'loading' && (
            <button
              onClick={() => removeToast(toast.id)}
              className={`btn btn-sm btn-circle btn-${toast.type} btn-soft shrink-0`}
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
