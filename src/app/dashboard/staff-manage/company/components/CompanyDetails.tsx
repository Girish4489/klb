'use client';
import { Modal } from '@/app/components/Modal/Modal';
import { useCompany } from '@/app/context/companyContext';
import { userConfirmation } from '@/app/util/confirmation/confirmationUtil';
import { formatDNT } from '@/app/util/format/dateUtils';
import { ICompany } from '@/models/companyModel';
import { PencilSquareIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface CompanyDetailsProps {
  company: ICompany;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ company, isEditing, setIsEditing }) => {
  const { updateCompany } = useCompany();
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [editingPhoneIndex, setEditingPhoneIndex] = useState<number | null>(null);
  const [editingEmailIndex, setEditingEmailIndex] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState<string>('');

  const handleSaveContactDetail = (type: 'phones' | 'emails', value: string, index: number | null) => {
    if (value && company) {
      const updatedDetails = [...company.contactDetails[type]];
      if (index !== null) {
        updatedDetails[index] = value;
      } else {
        updatedDetails.push(value);
      }
      updateCompany({
        contactDetails: { ...company.contactDetails, [type]: updatedDetails },
      });
      type === 'phones' ? setNewPhone('') : setNewEmail('');
      type === 'phones' ? setEditingPhoneIndex(null) : setEditingEmailIndex(null);
      (document.getElementById(`${type}_modal`) as HTMLDialogElement)?.close();
    }
  };

  const handleDeleteContactDetail = async (type: 'phones' | 'emails', index: number) => {
    const confirmed = await userConfirmation({
      header: `Delete ${type === 'phones' ? 'Phone' : 'Email'}`,
      message: `Are you sure you want to delete this ${type === 'phones' ? 'phone number' : 'email address'}?`,
    });

    if (confirmed && company) {
      const updatedDetails = company.contactDetails[type].filter((_, i) => i !== index);
      updateCompany({
        contactDetails: { ...company.contactDetails, [type]: updatedDetails },
      });
    }
  };

  const handleSaveField = () => {
    if (company && editingField) {
      const updatedCompany = { ...company };
      if (editingField.startsWith('contactDetails.')) {
        const field = editingField.split('.')[1];
        updatedCompany.contactDetails = {
          ...company.contactDetails,
          [field]: fieldValue,
        };
      } else {
        (updatedCompany as unknown as { [key: string]: string | ICompany['contactDetails'] })[editingField] =
          fieldValue;
      }
      updateCompany(updatedCompany);
      setEditingField(null);
      setFieldValue('');
      (document.getElementById('field_modal') as HTMLDialogElement)?.close();
    }
  };

  const renderContactDetails = (
    type: 'phones' | 'emails',
    label: string,
    value: string,
    setValue: (val: string) => void,
    editingIndex: number | null,
    setEditingIndex: (index: number | null) => void,
  ) => (
    <div className="flex flex-col gap-2 rounded-box border border-primary/40 p-2">
      {company && company.contactDetails && company.contactDetails[type].length === 0 && (
        <span>
          {label}: No {label} Added Yet!
        </span>
      )}
      {company && company.contactDetails && company.contactDetails[type].length > 0 && (
        <div className="flex flex-col gap-2">
          {label}:
          <hr className="h-1 border-primary" />
          <div className="flex flex-row flex-wrap gap-2">
            {company.contactDetails[type].map((item, index) => (
              <span key={index} className="badge flex h-full grow items-center gap-2 bg-primary/30 py-1.5">
                <span>{`${index + 1}).`}</span>
                <span className="grow">{item}</span>
                {isEditing && (
                  <>
                    <button
                      type="button"
                      className="btn btn-info btn-sm"
                      onClick={() => {
                        setValue(item);
                        setEditingIndex(index);
                        (document.getElementById(`${type}_modal`) as HTMLDialogElement)?.showModal();
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-error btn-sm"
                      onClick={() => handleDeleteContactDetail(type, index)}
                    >
                      <TrashIcon className="h-4 w-4 text-error-content" />
                    </button>
                  </>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
      {isEditing && (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            setValue('');
            setEditingIndex(null);
            (document.getElementById(`${type}_modal`) as HTMLDialogElement)?.showModal();
          }}
        >
          Add {label}
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col rounded-box border border-base-content/60 bg-base-300 p-2">
      <span className="badge badge-ghost flex h-full w-full items-center justify-between p-1 hover:badge-neutral">
        <p className="w-full text-center font-bold">{company.name ? company.name.toUpperCase() : ''}</p>
        <button
          className={`btn btn-sm ${isEditing ? 'btn-warning' : 'btn-info'}`}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <XCircleIcon className="h-4 w-4 text-warning-content" />
              Cancel
            </>
          ) : (
            <>
              <PencilSquareIcon className="h-4 w-4 text-info-content" />
              Edit
            </>
          )}
        </button>
      </span>
      <div className="flex flex-col flex-wrap justify-center gap-2 p-4">
        <div className="flex items-center gap-2 rounded-box border border-primary/40 p-2 shadow-2xl drop-shadow-2xl">
          Name:
          <span className="grow">{company.name}</span>
          {isEditing && (
            <button
              type="button"
              className="btn btn-info btn-sm"
              onClick={() => {
                setEditingField('name');
                setFieldValue(company.name);
                (document.getElementById('field_modal') as HTMLDialogElement)?.showModal();
              }}
            >
              <PencilSquareIcon className="h-4 w-4 text-warning-content" />
              Edit
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 rounded-box border border-primary/40 p-2">
          GST:
          <span className="grow">{company.gstNumber}</span>
          {isEditing && (
            <button
              type="button"
              className="btn btn-info btn-sm"
              onClick={() => {
                setEditingField('gstNumber');
                setFieldValue(company.gstNumber);
                (document.getElementById('field_modal') as HTMLDialogElement)?.showModal();
              }}
            >
              <PencilSquareIcon className="h-4 w-4 text-warning-content" />
              Edit
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 rounded-box border border-primary/40 p-2">
          Address:
          <span className="grow">{company.contactDetails?.address || 'No address available'}</span>
          {isEditing && (
            <button
              type="button"
              className="btn btn-info btn-sm"
              onClick={() => {
                setEditingField('contactDetails.address');
                setFieldValue(company.contactDetails.address);
                (document.getElementById('field_modal') as HTMLDialogElement)?.showModal();
              }}
            >
              <PencilSquareIcon className="h-4 w-4 text-warning-content" />
              Edit
            </button>
          )}
        </div>
        {renderContactDetails('phones', 'Phones', newPhone, setNewPhone, editingPhoneIndex, setEditingPhoneIndex)}
        {renderContactDetails('emails', 'Emails', newEmail, setNewEmail, editingEmailIndex, setEditingEmailIndex)}
        <div className="flex flex-col items-center gap-2 rounded-box border border-primary/40 p-2">
          <p className="w-full grow">Created At: {formatDNT(company.createdAt)}</p>
          <p className="w-full grow">Updated At: {formatDNT(company.updatedAt)}</p>
        </div>
      </div>

      <Modal id="phones_modal">
        <h2 className="text-lg font-bold">{editingPhoneIndex !== null ? 'Edit Phone' : 'Add Phone'}</h2>
        <form className="flex flex-col gap-2 p-4">
          <label className="input input-sm input-primary flex items-center gap-2">
            Phone:
            <input
              type="text"
              className="grow"
              placeholder="Enter phone number"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => handleSaveContactDetail('phones', newPhone, editingPhoneIndex)}
          >
            {editingPhoneIndex !== null ? 'Save' : 'Add'}
          </button>
        </form>
      </Modal>

      <Modal id="emails_modal">
        <h2 className="text-lg font-bold">{editingEmailIndex !== null ? 'Edit Email' : 'Add Email'}</h2>
        <form className="flex flex-col gap-2 p-4">
          <label className="input input-sm input-primary flex items-center gap-2">
            Email:
            <input
              type="text"
              className="grow"
              placeholder="Enter email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => handleSaveContactDetail('emails', newEmail, editingEmailIndex)}
          >
            {editingEmailIndex !== null ? 'Save' : 'Add'}
          </button>
        </form>
      </Modal>

      <Modal id="field_modal">
        <h2 className="text-lg font-bold">Edit {editingField?.replace('contactDetails.', '').toUpperCase()}</h2>
        <form className="flex flex-col gap-2 p-4">
          <label className="input input-sm input-primary flex items-center gap-2">
            {editingField?.replace('contactDetails.', '').toUpperCase()}:
            <input
              type="text"
              className="grow"
              placeholder={`Enter ${editingField?.replace('contactDetails.', '').toUpperCase()}`}
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
            />
          </label>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveField}>
            Save
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default CompanyDetails;
