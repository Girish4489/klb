'use client';
import { Modal } from '@components/Modal/Modal';
import constants from '@constants/constants';
import { useCompany } from '@context/companyContext';
import { FormField } from '@dashboard/staff-manage/company/components/FormField';
import { ImagePreview } from '@dashboard/staff-manage/company/components/ImagePreview';
import { PencilSquareIcon, PhotoIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { ICompany } from '@models/companyModel';
import { userConfirmation } from '@utils/confirmation/confirmationUtil';
import handleError from '@utils/error/handleError';
import { FileUtil } from '@utils/file/FileUtil';
import { formatDNT } from '@utils/format/dateUtils';
import { FormValidationUtil } from '@utils/validation/FormValidationUtil';
import { JSX, useState } from 'react';

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

  const handleSaveContactDetail = (type: 'phones' | 'emails', value: string, index: number | null): void => {
    if (!value || !company) return;

    const isValid = type === 'phones' ? FormValidationUtil.isValidPhone(value) : FormValidationUtil.isValidEmail(value);

    if (!isValid) {
      handleError.toast(new Error(`Invalid ${type === 'phones' ? 'phone number' : 'email address'}`));
      return;
    }

    const updatedDetails = [...company.contactDetails[type]];
    if (index !== null) {
      updatedDetails[index] = value;
    } else {
      updatedDetails.push(value);
    }
    updateCompany({
      contactDetails: { ...company.contactDetails, [type]: updatedDetails },
    });
    if (type === 'phones') {
      setNewPhone('');
      setEditingPhoneIndex(null);
    } else {
      setNewEmail('');
      setEditingEmailIndex(null);
    }
    (document.getElementById(`${type}_modal`) as HTMLDialogElement)?.close();
  };

  const handleDeleteContactDetail = async (type: 'phones' | 'emails', index: number): Promise<void> => {
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

  const handleSaveField = (): void => {
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

  const handleLogoChange = async (size: 'small' | 'medium' | 'large', logoUrl: string): Promise<void> => {
    if (company) {
      const updatedLogos = {
        ...company.logos,
        [size]: logoUrl,
      };
      updateCompany({
        logos: updatedLogos,
      });
      setEditingField(null);
      setFieldValue('');
      (document.getElementById('logo_modal') as HTMLDialogElement)?.close();
    }
  };

  const handleDeleteLogo = async (size: 'small' | 'medium' | 'large'): Promise<void> => {
    const confirmed = await userConfirmation({
      header: 'Delete Logo',
      message: `Are you sure you want to delete the ${size} logo?`,
    });

    if (confirmed && company) {
      const updatedLogos = {
        ...company.logos,
        [size]: '',
      };
      updateCompany({
        logos: updatedLogos,
      });
      setEditingField(null);
      setFieldValue('');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (!FileUtil.validateFileSize(file, constants.MAX_COMPANY_LOGO_FILE_SIZE_MB)) {
        throw new Error('File size should be less than 5MB');
      }
      const base64 = await FileUtil.toBase64(file);
      setFieldValue(base64);
    } catch (error) {
      handleError.toast(error);
    }
  };

  const renderContactDetails = (
    type: 'phones' | 'emails',
    label: string,
    value: string,
    setValue: (val: string) => void,
    editingIndex: number | null,
    setEditingIndex: (index: number | null) => void,
  ): JSX.Element => (
    <div className="rounded-box border-primary/40 flex flex-col gap-2 border p-2">
      {company && company.contactDetails && company.contactDetails[type].length === 0 && (
        <span>
          {label}: No {label} Added Yet!
        </span>
      )}
      {company && company.contactDetails && company.contactDetails[type].length > 0 && (
        <div className="flex flex-col gap-2">
          {label}:
          <hr className="border-primary h-1" />
          <div className="flex flex-row flex-wrap gap-2">
            {company.contactDetails[type].map((item, index) => (
              <span key={index} className="badge bg-primary/30 flex h-full grow items-center gap-2 py-1.5">
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
                      <TrashIcon className="text-error-content h-4 w-4" />
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
    <div className="rounded-box border-base-content/60 bg-base-300 flex flex-col border p-2">
      <span className="badge badge-ghost hover:badge-neutral flex h-full w-full items-center justify-between p-1">
        <p className="w-full text-center font-bold">{company.name ? company.name.toUpperCase() : ''}</p>
        <button
          className={`btn btn-sm ${isEditing ? 'btn-warning' : 'btn-info'}`}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <XCircleIcon className="text-warning-content h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <PencilSquareIcon className="text-info-content h-4 w-4" />
              Edit
            </>
          )}
        </button>
      </span>
      <div className="flex flex-col flex-wrap justify-center gap-2 p-4">
        <div className="rounded-box border-primary/40 flex items-center gap-2 border p-2 shadow-2xl drop-shadow-2xl">
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
              <PencilSquareIcon className="text-warning-content h-4 w-4" />
              Edit
            </button>
          )}
        </div>
        <div className="rounded-box border-primary/40 flex items-center gap-2 border p-2">
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
              <PencilSquareIcon className="text-warning-content h-4 w-4" />
              Edit
            </button>
          )}
        </div>
        <div className="rounded-box border-primary/40 flex items-center gap-2 border p-2">
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
              <PencilSquareIcon className="text-warning-content h-4 w-4" />
              Edit
            </button>
          )}
        </div>
        {renderContactDetails('phones', 'Phones', newPhone, setNewPhone, editingPhoneIndex, setEditingPhoneIndex)}
        {renderContactDetails('emails', 'Emails', newEmail, setNewEmail, editingEmailIndex, setEditingEmailIndex)}
        {(company.logos?.small || company.logos?.medium || company.logos?.large || isEditing) && (
          <div className="rounded-box border-primary/40 flex flex-col gap-2 border p-2">
            <h3 className="text-base font-semibold">Company Logos</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {(['small', 'medium', 'large'] as const)
                .filter((size) => company.logos?.[size] || isEditing)
                .map((size) => (
                  <div
                    key={size}
                    className="rounded-box border-primary/20 bg-neutral/60 flex flex-col items-center gap-2 border p-2"
                  >
                    <span className="text-sm font-semibold capitalize">{size} Logo</span>
                    {company.logos?.[size] ? (
                      <div className="relative">
                        <ImagePreview src={company.logos[size]} alt={`${size} logo`} />
                        {isEditing && (
                          <div className="bg-base-300/90 absolute bottom-0 left-0 right-0 flex w-full justify-center gap-2 p-1">
                            <button
                              className="btn btn-info btn-xs"
                              onClick={() => {
                                setEditingField(`logos.${size}`);
                                setFieldValue(company.logos[size]);
                                (document.getElementById('logo_modal') as HTMLDialogElement)?.showModal();
                              }}
                            >
                              <PhotoIcon className="h-4 w-4" />
                              Change
                            </button>
                            <button className="btn btn-error btn-xs" onClick={() => handleDeleteLogo(size)}>
                              <TrashIcon className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      isEditing && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setEditingField(`logos.${size}`);
                            setFieldValue('');
                            (document.getElementById('logo_modal') as HTMLDialogElement)?.showModal();
                          }}
                        >
                          <PhotoIcon className="h-5 w-5" />
                          Add {size} Logo
                        </button>
                      )
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
        <div className="rounded-box border-primary/40 flex flex-col items-center gap-2 border p-2">
          <p className="w-full grow">Created At: {formatDNT(company.createdAt)}</p>
          <p className="w-full grow">Updated At: {formatDNT(company.updatedAt)}</p>
        </div>
      </div>

      <Modal id="phones_modal">
        <h2 className="font-bold text-lg">{editingPhoneIndex !== null ? 'Edit Phone' : 'Add Phone'}</h2>
        <form className="flex flex-col gap-2 p-4">
          <FormField
            label="Phone"
            type="tel"
            value={newPhone}
            onChange={setNewPhone}
            placeholder="Enter phone number"
            id="phone-input"
            name="phone-input"
            required
          />
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
        <h2 className="font-bold text-lg">{editingEmailIndex !== null ? 'Edit Email' : 'Add Email'}</h2>
        <form className="flex flex-col gap-2 p-4">
          <FormField
            label="Email"
            type="email"
            value={newEmail}
            onChange={setNewEmail}
            placeholder="Enter email address"
            id="email-input"
            name="email-input"
            required
          />
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
        <h2 className="font-bold text-lg">Edit {editingField?.replace('contactDetails.', '').toUpperCase()}</h2>
        <form className="flex flex-col gap-2 p-4">
          <FormField
            label={editingField?.replace('contactDetails.', '').toUpperCase() || ''}
            type="text"
            value={fieldValue}
            onChange={setFieldValue}
            placeholder={`Enter ${editingField?.replace('contactDetails.', '').toUpperCase()}`}
            id="field-input"
            name="field-input"
            required
          />
          <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveField}>
            Save
          </button>
        </form>
      </Modal>

      <Modal id="logo_modal">
        <h2 className="font-bold text-lg">
          {editingField?.startsWith('logos.') ? `Update ${editingField.split('.')[1]} Logo` : 'Add Logo'}
        </h2>
        <form className="flex flex-col gap-2 p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                id="logo-file-upload"
                name="logo-file-upload"
                type="file"
                accept="image/*"
                className="file-input file-input-bordered file-input-primary file-input-sm w-full"
                onChange={handleFileUpload}
              />
            </div>
            {fieldValue && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm">Preview:</p>
                <ImagePreview src={fieldValue} alt="Preview" />
              </div>
            )}
            <div className="divider">OR</div>
            <FormField
              label="Logo URL"
              type="url"
              value={fieldValue}
              onChange={setFieldValue}
              placeholder="Enter logo URL"
              id="logo-url-input"
              name="logo-url-input"
              required
            />
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={!fieldValue}
            onClick={() => {
              if (editingField?.startsWith('logos.')) {
                const size = editingField.split('.')[1] as 'small' | 'medium' | 'large';
                handleLogoChange(size, fieldValue);
              }
            }}
          >
            Save Logo
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default CompanyDetails;
