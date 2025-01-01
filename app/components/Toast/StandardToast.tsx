import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { FC, ReactNode } from 'react';
import { StandardToastType } from './types';

interface StandardToastProps {
  message: ReactNode;
  type: StandardToastType;
  onClose?: () => void;
}

const StandardToast: FC<StandardToastProps> = ({ message, type, onClose }) => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    info: InformationCircleIcon,
    warning: ExclamationCircleIcon,
  } as const;

  const alertClasses = {
    success: 'alert-success',
    error: 'alert-error',
    info: 'alert-info',
    warning: 'alert-warning',
  } as const;

  // Ensure we always have a valid icon component
  const IconComponent = icons[type] || InformationCircleIcon;

  return (
    <div className={`alert ${alertClasses[type]} animate-fade-in w-fit max-w-xs shadow-lg`} role="alert">
      <IconComponent className="h-6 w-6" />
      <span className="text-sm">{message}</span>
      {onClose && (
        <button onClick={onClose} className="btn btn-circle btn-ghost btn-sm">
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default StandardToast;
