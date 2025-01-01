'use client';
import { ChangeEvent, FC, FormEvent, useState, type JSX } from 'react';

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
  onSubmitAction: (formData: Record<string, string>) => Promise<void | string> | void;
  buttonName: string;
  fields: Field[];
  onCloseAction: () => void;
}

// FormModal component renders a modal dialog with a form.
export const FormModal: FC<FormModalProps> = ({
  id,
  title,
  onSubmitAction,
  buttonName,
  fields,
  onCloseAction,
}: FormModalProps): JSX.Element => {
  const [formState, setFormState] = useState<Record<string, string>>({});

  // Handles the change event for an input element and updates the form state.
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  // Handles the form submission event.
  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    onSubmitAction(formState);
  };

  // Handles the click event for closing the modal.
  const handleClickClose = (): void => {
    onCloseAction();
    closeModal(id);
  };

  return (
    <dialog id={id} className="modal">
      <div className="modal-box w-fit">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="flex flex-col items-center p-1 pt-4">
          <form onSubmit={handleSubmit} className="form flex w-max flex-col items-start gap-2">
            {fields.map((field) => (
              <label key={field.name} htmlFor={field.name} className="input-sm input-bordered input-primary input">
                {field.label}
                <input
                  type={field.type || 'text'}
                  placeholder={field.placeholder}
                  className="grow"
                  required={field.required}
                  spellCheck="true"
                  name={field.name}
                  id={field.name}
                  value={formState[field.name] || ''}
                  onChange={handleChange}
                  onFocus={(e) => e.currentTarget.select()}
                />
              </label>
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
            <button className="btn btn-ghost btn-soft btn-sm" onClick={handleClickClose}>
              Close
            </button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
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
