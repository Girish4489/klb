// /src/app/util/confirmation/confirmationUtil.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';

interface ConfirmationParams {
  header: string;
  message: string;
}

const ConfirmationModal: React.FC<{
  header: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ header, message, onConfirm, onCancel }) => {
  const handleConfirm = (): void => {
    onConfirm();
  };

  const handleCancel = (): void => {
    onCancel();
  };

  return (
    <div className="modal-box">
      <h2 className="text-lg font-bold">{header}</h2>
      <p className="py-4">{message}</p>
      <div className="modal-action">
        <button className="btn btn-primary" onClick={handleConfirm}>
          Confirm
        </button>
        <button className="btn btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
        <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2" onClick={handleCancel}>
          ✕
        </button>
      </div>
    </div>
  );
};

export const userConfirmation = ({ header, message }: ConfirmationParams): Promise<boolean> => {
  return new Promise((resolve) => {
    const container = document.createElement('dialog');
    container.id = 'confirm';
    container.className = 'modal z-50';

    const root = createRoot(container);

    document.body.appendChild(container);
    const element = document.getElementById('confirm') as HTMLDialogElement | null;
    if (element) {
      element.showModal();
    }

    const handleClose = (confirmed: boolean): void => {
      root.unmount();
      document.body.removeChild(container);
      resolve(confirmed);
    };

    const handleConfirm = (): void => {
      handleClose(true);
    };

    const handleCancel = (): void => {
      handleClose(false);
    };

    root.render(
      <ConfirmationModal header={header} message={message} onConfirm={handleConfirm} onCancel={handleCancel} />,
    );
  });
};
