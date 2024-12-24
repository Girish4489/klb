'use client';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { CloudArrowUpIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { ITax } from '@models/klm';
import { userConfirmation } from '@utils/confirmation/confirmationUtil';
import handleError from '@utils/error/handleError';
import { ApiDelete, ApiGet, ApiPost, ApiPut, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import React, { JSX, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface TaxResponse extends ApiResponse {
  taxes?: ITax[];
  data?: ITax;
}

interface InputFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, type = 'text', value, placeholder, onChange }) => (
  <div className="flex grow flex-wrap items-center gap-1 max-sm:justify-between">
    <label htmlFor={id} className="input input-sm input-primary flex grow items-center gap-2 max-sm:text-nowrap">
      {label}:
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="grow"
        autoComplete="off"
      />
    </label>
  </div>
);

interface SelectFieldProps {
  label: string;
  id: string;
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, id, options, value, onChange }) => (
  <div className="flex grow flex-wrap items-center gap-1 max-sm:justify-between max-sm:text-nowrap">
    <label htmlFor={id} className="max-sm:text-nowrap">
      {label}
    </label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="select select-bordered select-primary select-sm grow"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default function TaxPage(): JSX.Element {
  const [taxes, setTaxes] = useState<ITax[]>([]);
  const [formData, setFormData] = useState({ taxName: '', taxType: 'Percentage', taxPercentage: '' });
  const [editFormData, setEditFormData] = useState({ taxName: '', taxType: 'Percentage', taxPercentage: '', id: '' });

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const taxResponse = await ApiGet.Tax<TaxResponse>();
        if (taxResponse?.success && taxResponse.taxes) {
          setTaxes(taxResponse.taxes);
        } else {
          throw new Error(taxResponse?.message ?? 'Failed to fetch taxes');
        }
      } catch (error) {
        handleError.toastAndLog(error);
      }
    })();
  }, []);

  const configureToastPromise = useCallback(async (promise: Promise<string>, loadingMessage: string) => {
    try {
      await toast.promise(promise, {
        loading: loadingMessage,
        success: (message: string) => <b>{message}</b>,
        error: (error: Error) => <b>{error.message}</b>,
      });
    } catch (error) {
      handleError.toastAndLog(error);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveTax = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { taxName, taxType, taxPercentage } = formData;

    const save = async (): Promise<string> => {
      const tax = await ApiPost.Tax<TaxResponse>({
        taxName,
        taxType,
        taxPercentage: parseFloat(taxPercentage),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as ITax);

      if (tax?.success && tax.data) {
        setTaxes([...taxes, tax.data]);
        setFormData({ taxName: '', taxType: 'Percentage', taxPercentage: '' });
        return tax.message ?? 'Tax saved successfully';
      }
      throw new Error(tax?.message ?? 'Failed to save tax');
    };

    await configureToastPromise(save(), 'Saving tax...');
  };

  const handleDelete = useCallback(
    (_id: string) => async (): Promise<void> => {
      const confirmed = await userConfirmation({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this tax?',
      });
      if (!confirmed) return;

      const deleteTax = async (): Promise<string> => {
        const res = await ApiDelete.Tax<TaxResponse>(_id);
        if (res?.success) {
          setTaxes(taxes.filter((tax) => tax._id.toString() !== _id));
          return res.message ?? 'Tax deleted successfully';
        }
        throw new Error(res?.message ?? 'Failed to delete tax');
      };

      await configureToastPromise(deleteTax(), 'Deleting tax...');
    },
    [taxes, configureToastPromise],
  );

  const openEditDialog = (tax: ITax, id: string): void => {
    setEditFormData({
      taxName: tax.taxName,
      taxType: tax.taxType,
      taxPercentage: tax.taxPercentage.toString(),
      id,
    });

    const editModal = document.getElementById('taxEdit_modal') as HTMLDialogElement;
    if (editModal) {
      editModal.showModal();
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { taxName, taxType, taxPercentage, id } = editFormData;

    const editTax = async (): Promise<string> => {
      const res = await ApiPut.Tax<TaxResponse>(id, {
        taxName,
        taxType,
        taxPercentage: parseFloat(taxPercentage),
        updatedAt: new Date(),
      });

      if (res && res?.success && res.data) {
        setTaxes(taxes.map((tax) => (tax._id.toString() === id ? res.data! : tax)));
        const editModal = document.getElementById('taxEdit_modal') as HTMLDialogElement;
        if (editModal) {
          editModal.close();
        }
        return res.message ?? 'Tax updated successfully';
      }
      throw new Error(res?.message ?? 'Failed to update tax');
    };

    await configureToastPromise(editTax(), 'Updating tax...');
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-center font-bold">Tax</h1>
      <div className="flex flex-col flex-wrap gap-1 rounded-box bg-base-200 p-2">
        <h3 className="text-center font-medium">Add Tax</h3>
        <form onSubmit={saveTax} className="flex flex-wrap gap-2">
          <InputField
            label="Tax Name"
            id="taxName"
            value={formData.taxName}
            placeholder="Enter tax name"
            onChange={handleInputChange}
          />
          <SelectField
            label="Tax Type"
            id="taxType"
            options={['Percentage', 'Fixed']}
            value={formData.taxType}
            onChange={handleInputChange}
          />
          <InputField
            label={formData.taxType === 'Percentage' ? 'Tax Percentage' : 'Tax Fixed'}
            id="taxPercentage"
            type="number"
            value={formData.taxPercentage}
            placeholder={formData.taxType === 'Percentage' ? 'Enter tax percentage' : 'Enter tax fixed amount'}
            onChange={handleInputChange}
          />
          <div className="flex grow flex-wrap items-center gap-1 pr-3 max-sm:justify-end">
            <button className="btn btn-primary btn-sm grow">
              <PlusCircleIcon className="h-5 w-5" />
              Add
            </button>
          </div>
        </form>
      </div>
      <dialog id="taxEdit_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-center text-lg font-bold">Edit Tax</h3>
          <form onSubmit={handleEdit} className="form-control m-2 flex-wrap gap-2 p-2">
            <InputField
              label="Tax Name"
              id="taxName"
              value={editFormData.taxName}
              placeholder="Enter tax name"
              onChange={handleEditInputChange}
            />
            <SelectField
              label="Tax Type"
              id="taxType"
              options={['Percentage', 'Fixed']}
              value={editFormData.taxType}
              onChange={handleEditInputChange}
            />
            <InputField
              label={editFormData.taxType === 'Percentage' ? 'Tax Percentage' : 'Tax Fixed'}
              id="taxPercentage"
              type="number"
              value={editFormData.taxPercentage}
              placeholder={editFormData.taxType === 'Percentage' ? 'Enter tax percentage' : 'Enter tax fixed amount'}
              onChange={handleEditInputChange}
            />
            <div className="flex w-full flex-wrap items-center justify-center gap-1">
              <button type="submit" className="btn btn-primary btn-sm grow">
                <CloudArrowUpIcon className="h-5 w-5" />
                Update
              </button>
            </div>
          </form>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
              <button className="btn btn-sm">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <div className="table flex w-full shrink flex-col">
        <div className="table-row overflow-auto rounded-box border border-base-300 max-sm:max-w-sm">
          <table className="table table-zebra table-pin-rows">
            <caption className="table-caption text-center font-bold">Taxes</caption>
            {taxes.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={5} className="text-warning">
                    No taxes found
                  </td>
                </tr>
              </tbody>
            ) : (
              <>
                <thead>
                  <tr className="text-center">
                    <th>Sn</th>
                    <th>Tax Name</th>
                    <th>Tax Type</th>
                    <th>Tax Percentage</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {taxes.map((tax, taxIndex) => (
                    <tr key={tax._id.toString()} className="hover text-center">
                      <td>{taxIndex + 1}</td>
                      <td>{tax.taxName}</td>
                      <td>{tax.taxType}</td>
                      <td>{tax.taxPercentage}</td>
                      <td className="flex items-center justify-center gap-1 max-sm:flex-col">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => openEditDialog(tax, tax._id.toString())}
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                          Edit
                        </button>
                        <button className="btn btn-error btn-sm" onClick={handleDelete(tax._id.toString())}>
                          <TrashIcon className="h-4 w-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
