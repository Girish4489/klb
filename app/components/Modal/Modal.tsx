'use client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FC, ReactNode } from 'react';

interface ModalProps {
  id: string;
  children: ReactNode;
  title?: string;
  isBackdrop?: boolean;
}

export function showModel(id: string): void {
  const element = document.getElementById(id) as HTMLDialogElement | null;
  if (element) {
    element.showModal();
  }
}

export const Modal: FC<ModalProps> = ({ id, children, title = '', isBackdrop = false }) => {
  if (isBackdrop) {
    return (
      <dialog id={id} className="modal">
        <div className="modal-box border-primary max-h-[90vh] w-11/12 max-w-5xl overflow-y-auto border md:w-3/4 lg:w-1/2">
          {title && <h3 className="font-bold text-lg">{title}</h3>}
          {children}
          <form method="dialog" className="flex justify-end">
            <button className="btn btn-sm btn-circle btn-neutral/50 absolute right-2 top-2">
              <XMarkIcon className="h-5 w-5" />
            </button>
            <button className="btn w-fit">close</button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  }
  return (
    <dialog id={id} className="modal">
      <div className="modal-box border-primary max-h-[90vh] w-11/12 max-w-5xl overflow-y-auto border md:w-3/4 lg:w-1/2">
        {children}
        <form method="dialog" className="flex justify-end">
          <button className="btn btn-sm btn-circle btn-neutral/50 absolute right-2 top-2">
            <XMarkIcon className="h-5 w-5" />
          </button>
          <button className="btn w-fit">Close</button>
        </form>
      </div>
    </dialog>
  );
};
