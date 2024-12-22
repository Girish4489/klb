'use client';
import { FC, ReactNode } from 'react';

interface ModalProps {
  id: string;
  children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ id, children }) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box w-11/12 max-w-5xl border border-primary shadow-inner shadow-primary transition-shadow">
        {children}
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};
