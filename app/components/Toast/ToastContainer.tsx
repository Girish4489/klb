import { JSX } from 'react';
import { toast as hotToast, useToaster } from 'react-hot-toast';
import PromiseToast from './PromiseToast';
import StandardToast from './StandardToast';
import { CustomToast, ToastType } from './types';

export const ToastContainer = (): JSX.Element => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  const renderToast = (toast: CustomToast): JSX.Element => {
    // Handle promise toasts
    if (toast.promise) {
      if (toast.type === 'loading') {
        return <PromiseToast message={toast.message} state="loading" />;
      }
      return <PromiseToast message={toast.message} state={toast.type as 'success' | 'error'} />;
    }

    // Handle custom toasts
    if (toast.type === 'custom') {
      return toast.message as JSX.Element;
    }

    // Handle standard toasts
    return (
      <StandardToast
        message={toast.message}
        type={toast.type as Exclude<ToastType, 'loading' | 'custom'>}
        onClose={() => hotToast.dismiss(toast.id)}
      />
    );
  };

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[5000] flex flex-col items-center justify-start p-4"
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        {toasts
          .filter((toast) => toast.visible)
          .map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              {renderToast(toast as CustomToast)}
            </div>
          ))}
      </div>
    </div>
  );
};
