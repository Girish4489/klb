'use client';
import React from 'react';

interface ModalProps {
  id: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ id, children }) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
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
