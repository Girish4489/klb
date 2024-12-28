'use client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FC, ReactNode } from 'react';

interface ModalProps {
  id: string;
  children: ReactNode;
  isBackdrop?: boolean;
}

export const Modal: FC<ModalProps> = ({ id, children, isBackdrop = false }) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box border-primary max-h-[90vh] w-11/12 max-w-5xl overflow-y-auto border md:w-3/4 lg:w-1/2">
        {children}
        <form method="dialog" className={`flex justify-end ${isBackdrop ? 'modal-backdrop' : ''}`}>
          <button className="btn btn-sm btn-circle btn-neutral/50 absolute right-2 top-2">
            <XMarkIcon className="h-5 w-5" />
          </button>
          <button className="btn w-fit">Close</button>
        </form>
      </div>
    </dialog>
  );
};
