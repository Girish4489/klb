'use client';
import React, { ChangeEvent, FormEvent, useState } from 'react';
interface FormModalProps {
  id: string;
  title: string;
  onSubmit: (formData: any) => void;
  fields: Array<{ label: string; name: string; type?: string; placeholder?: string; required?: boolean }>;
  onClose: () => void;
}

export const FormModal: React.FC<FormModalProps> = ({ id, title, onSubmit, fields, onClose }) => {
  const [formState, setFormState] = useState<{ [key: string]: string }>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formState);
  };

  const handleClickClose = () => {
    onClose();
    closeModal(id);
  };

  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold">{title}</h3>
        <div className="flex flex-col items-center p-1 pt-4">
          <form onSubmit={handleSubmit} className="form flex w-max flex-col items-start gap-2">
            {fields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="label label-text">
                  {field.label}
                </label>
                <input
                  type={field.type || 'text'}
                  placeholder={field.placeholder}
                  className="input input-bordered input-primary w-full max-w-xs max-sm:w-full max-sm:max-w-full"
                  required={field.required}
                  spellCheck="true"
                  name={field.name}
                  id={field.name}
                  value={formState[field.name] || ''}
                  onChange={handleChange}
                  onFocus={(e) => e.currentTarget.select()}
                />
              </div>
            ))}
            <div className="form-control w-full items-center">
              <button className="btn btn-primary w-10/12" type="submit">
                Update
              </button>
            </div>
          </form>
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2" onClick={handleClickClose}>
              ✕
            </button>
            <button className="btn" onClick={handleClickClose}>
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export const openModal = (modalId: string): void => {
  const element = document.getElementById(modalId) as HTMLDialogElement | null;
  if (element) {
    element.showModal();
  }
};

export const closeModal = (modalId: string): void => {
  const element = document.getElementById(modalId) as HTMLDialogElement | null;
  if (element) {
    element.close();
  }
};
