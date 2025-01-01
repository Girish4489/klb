import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { FC, ReactNode } from 'react';

interface PromiseToastProps {
  message: ReactNode;
  state: 'loading' | 'success' | 'error';
}

const PromiseToast: FC<PromiseToastProps> = ({ message, state }) => {
  const alertClasses = {
    loading: 'alert-info',
    success: 'alert-success',
    error: 'alert-error',
  };

  return (
    <div
      className={`alert ${alertClasses[state]} animate-fade-in w-fit max-w-xs gap-2 shadow-lg`}
      role="alert"
      style={{ margin: 0 }}
    >
      {state === 'loading' ? (
        <span className="loading loading-spinner loading-sm" />
      ) : state === 'success' ? (
        <CheckCircleIcon className="h-6 w-6" />
      ) : (
        <ExclamationCircleIcon className="h-6 w-6" />
      )}
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};

export default PromiseToast;
