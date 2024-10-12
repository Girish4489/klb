'use client';
import React, { ChangeEvent, FormEvent, useState } from 'react';

/**
 * Represents a form field with various properties.
 *
 * @interface Field
 *
 * @property {string} label - The label of the field.
 * @property {string} name - The name of the field.
 * @property {string} [type] - The type of the field (optional).
 * @property {string} [placeholder] - The placeholder text for the field (optional).
 * @property {boolean} [required] - Indicates whether the field is required (optional).
 */
interface Field {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

/**
 * Props for the FormModal component.
 *
 * @interface FormModalProps
 * @property {string} id - The unique identifier for the modal.
 * @property {string} title - The title of the modal.
 * @property {(formData: { [key: string]: string }) => void} onSubmit - Callback function to handle form submission.
 * @property {Field[]} fields - Array of fields to be displayed in the form.
 * @property {() => void} onClose - Callback function to handle modal close action.
 */
interface FormModalProps {
  id: string;
  title: string;
  onSubmit: (formData: { [key: string]: string }) => void;
  fields: Field[];
  onClose: () => void;
}

/**
 * FormModal component renders a modal dialog with a form.
 *
 * @component
 * @param {FormModalProps} props - The properties for the FormModal component.
 * @param {string} props.id - The unique identifier for the modal.
 * @param {string} props.title - The title of the modal.
 * @param {function} props.onSubmit - The function to call when the form is submitted.
 * @param {Array<{name: string, label: string, type?: string, placeholder?: string, required?: boolean}>} props.fields - The fields to render in the form.
 * @param {function} props.onClose - The function to call when the modal is closed.
 *
 * @returns {JSX.Element} The rendered FormModal component.
 *
 * @example
 * <FormModal
 *   id="exampleModal"
 *   title="Example Form"
 *   onSubmit={(data) => console.log(data)}
 *   fields={[
 *     { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter your username', required: true },
 *     { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password', required: true }
 *   ]}
 *   onClose={() => console.log('Modal closed')}
 * />
 */
export const FormModal: React.FC<FormModalProps> = ({
  id,
  title,
  onSubmit,
  fields,
  onClose,
}: FormModalProps): JSX.Element => {
  const [formState, setFormState] = useState<{ [key: string]: string }>({});

  /**
   * Handles the change event for an input element and updates the form state.
   *
   * @param e - The change event triggered by the input element.
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  /**
   * Handles the form submission event.
   *
   * @param {FormEvent} e - The form event object.
   * @returns {void}
   */
  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    onSubmit(formState);
  };

  /**
   * Handles the click event for closing the modal.
   * Calls the `onClose` function and then closes the modal with the given `id`.
   *
   * @function
   */
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

/**
 * Opens a modal dialog with the specified ID.
 *
 * @param modalId - The ID of the modal dialog to open.
 * @remarks
 * This function uses `document.getElementById` to find the modal element and calls `showModal` on it.
 * If the element is not found, the function does nothing.
 */
export const openModal = (modalId: string): void => {
  const element = document.getElementById(modalId) as HTMLDialogElement | null;
  if (element) {
    element.showModal();
  }
};

/**
 * Closes a modal dialog with the specified ID.
 *
 * @param modalId - The ID of the modal dialog to close.
 * @remarks
 * This function attempts to find an HTMLDialogElement by its ID and calls its `close` method if found.
 */
export const closeModal = (modalId: string): void => {
  const element = document.getElementById(modalId) as HTMLDialogElement | null;
  if (element) {
    element.close();
  }
};
