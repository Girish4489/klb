import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { FC, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: ReactNode;
  type?: ToastType;
  onClose?: () => void;
}

const Toast: FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    info: InformationCircleIcon,
    warning: ExclamationCircleIcon,
  };

  const alertClasses = {
    success: 'alert-success',
    error: 'alert-error',
    info: 'alert-info',
    warning: 'alert-warning',
  };

  const Icon = icons[type];

  return (
    <div className={`alert ${alertClasses[type]} animate-fade-in w-fit max-w-xs shadow-lg`} role="alert">
      <Icon className="h-6 w-6" />
      <span className="text-sm">{message}</span>
      {onClose && (
        <button onClick={onClose} className="btn btn-circle btn-ghost btn-sm">
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Toast;
