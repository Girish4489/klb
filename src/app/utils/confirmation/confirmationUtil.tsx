import { ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FC, JSX } from 'react';
import { createRoot } from 'react-dom/client';

type confirmationType = 'warning' | 'error' | 'info';

interface ConfirmationParams {
  header: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: confirmationType;
}

const ConfirmationContent: FC<{
  header: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: confirmationType;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ header, message, confirmText, cancelText, type, onConfirm, onCancel }) => {
  const getTypeStyles = (): string => {
    switch (type) {
      case 'error':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-info';
    }
  };

  const getIcon = (): JSX.Element => {
    switch (type) {
      case 'error':
        return <XCircleIcon className={`h-16 w-16 ${getTypeStyles()}`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`h-16 w-16 ${getTypeStyles()}`} />;
      case 'info':
        return <InformationCircleIcon className={`h-16 w-16 ${getTypeStyles()}`} />;
      default:
        return <ExclamationTriangleIcon className={`h-16 w-16 ${getTypeStyles()}`} />;
    }
  };

  return (
    <div className="modal-box border-primary w-11/12 max-w-sm border">
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onCancel}>
        <XMarkIcon className="h-5 w-5" />
      </button>
      <div className="flex flex-col items-center gap-4">
        {getIcon()}
        <h2 className="font-bold text-lg">{header}</h2>
        <p className="py-2 text-center">{message}</p>
      </div>
      <div className="modal-action mt-8 flex justify-end gap-2">
        <button className="btn btn-soft btn-sm" onClick={onCancel}>
          {cancelText}
        </button>
        <button
          className={`btn btn-sm ${type === 'error' ? 'btn-error' : type === 'warning' ? 'btn-warning' : 'btn-info'}`}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export const userConfirmation = ({
  header,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
}: ConfirmationParams): Promise<boolean> => {
  return new Promise((resolve) => {
    const modalId = 'confirmation-modal';
    const container = document.createElement('dialog');
    container.id = modalId;
    container.className = 'modal modal-bottom sm:modal-middle';
    document.body.appendChild(container);

    const handleClose = (confirmed: boolean): void => {
      const modalElement = document.getElementById(modalId) as HTMLDialogElement;
      if (modalElement) {
        modalElement.close();
      }
      document.body.removeChild(container);
      resolve(confirmed);
    };

    const root = createRoot(container);
    root.render(
      <ConfirmationContent
        header={header}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
        type={type}
        onConfirm={() => handleClose(true)}
        onCancel={() => handleClose(false)}
      />,
    );

    const modalElement = document.getElementById(modalId) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
  });
};
