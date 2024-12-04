'use client';
import React, { ChangeEvent, FormEvent, useState, type JSX } from 'react';

// Represents a form field with various properties.
interface Field {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

// Props for the FormModal component.
interface FormModalProps {
  id: string;
  title: string;
  onSubmit: (formData: { [key: string]: string }) => void;
  buttonName: string;
  fields: Field[];
  onClose: () => void;
}

// FormModal component renders a modal dialog with a form.
export const FormModal: React.FC<FormModalProps> = ({
  id,
  title,
  onSubmit,
  buttonName,
  fields,
  onClose,
}: FormModalProps): JSX.Element => {
  const [formState, setFormState] = useState<{ [key: string]: string }>({});

  // Handles the change event for an input element and updates the form state.
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  // Handles the form submission event.
  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    onSubmit(formState);
  };

  // Handles the click event for closing the modal.
  const handleClickClose = () => {
    onClose();
    closeModal(id);
  };

  return (
    <dialog id={id} className="modal">
      <div className="modal-box w-fit">
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
                  className="input input-sm input-bordered input-primary w-full max-w-xs max-sm:w-full max-sm:max-w-full"
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
              <button className="btn btn-primary btn-sm w-full grow" type="submit">
                {buttonName || 'Submit'}
              </button>
            </div>
          </form>
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2" onClick={handleClickClose}>
              ✕
            </button>
            <button className="btn btn-info btn-sm" onClick={handleClickClose}>
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

// Opens a modal dialog with the specified ID.
export const openModal = (modalId: string): void => {
  const element = document.getElementById(modalId) as HTMLDialogElement | null;
  if (element) {
    element.showModal();
  }
};

// Closes a modal dialog with the specified ID.
export const closeModal = (modalId: string): void => {
  const element = document.getElementById(modalId) as HTMLDialogElement | null;
  if (element) {
    element.close();
  }
};
