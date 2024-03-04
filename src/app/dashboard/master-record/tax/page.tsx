'use client';
import { userConfirmaion } from '@/app/util/confirmation/confirmationUtil';
import { ApiDelete, ApiGet, ApiPost, ApiPut } from '@/app/util/makeApiRequest/makeApiRequest';
import { ITax } from '@/models/klm';
import React from 'react';
import toast from 'react-hot-toast';

export default function TaxPage() {
  const [taxes, setTaxes] = React.useState<ITax[]>([]);

  React.useEffect(() => {
    (async () => {
      const taxes = await ApiGet.Tax();
      setTaxes(taxes);
    })();
  }, []);

  const configureToastPromise = async (promise: Promise<any>, loadingMessage: string) => {
    try {
      await toast.promise(promise, {
        loading: loadingMessage,
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });
    } catch (error) {}
  };

  const saveTax = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const taxName = (e.currentTarget.querySelector('#taxName') as HTMLInputElement).value;
    const taxType = (e.currentTarget.querySelector('#taxType') as HTMLSelectElement).value;
    const taxPercentage = parseFloat((e.currentTarget.querySelector('#taxPercentage') as HTMLInputElement).value);

    const save = async (name: string, type: string, percentage: number) => {
      try {
        const tax = await ApiPost.Tax({
          taxName: name,
          taxType: type,
          taxPercentage: percentage,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as ITax);
        if (tax.success === true) {
          setTaxes([...taxes, tax.data]);

          // Clear the input fields
          (document.getElementById('taxName') as HTMLInputElement).value = '';
          (document.getElementById('taxType') as HTMLSelectElement).value = 'Percentage';
          (document.getElementById('taxPercentage') as HTMLInputElement).value = '';

          return tax.message;
        } else {
          throw new Error(tax.message);
        }
      } catch (error: any) {
        throw new Error(error.message);
      }
    };

    await configureToastPromise(save(taxName, taxType, taxPercentage), 'Saving tax...');
  };

  function handleDelete(_id: any): React.MouseEventHandler<HTMLButtonElement> | undefined {
    return async () => {
      const Confirmed = await userConfirmaion({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this tax?',
      });
      if (!Confirmed) return;
      const deleteTax = async () => {
        try {
          const res = await ApiDelete.Tax(_id);
          if (res.success === true) {
            setTaxes(taxes.filter((tax) => tax._id !== _id));
            return res.message;
          } else {
            throw new Error(res.message);
          }
        } catch (error) {}
      };
      await configureToastPromise(deleteTax(), 'Deleting tax...');
    };
  }

  function openEditDialog(tax: ITax, id: string) {
    const taxNameInput = document.getElementById('taxEditName') as HTMLInputElement;
    const taxTypeSelect = document.getElementById('taxEditType') as HTMLSelectElement;
    const taxPercentageInput = document.getElementById('taxEditPercentage') as HTMLInputElement;

    if (taxNameInput && taxTypeSelect && taxPercentageInput) {
      taxNameInput.value = tax.taxName;
      taxTypeSelect.value = tax.taxType;
      taxPercentageInput.value = tax.taxPercentage.toString();
    }

    const editModal = document.getElementById('taxEdit_modal') as HTMLDialogElement;
    if (editModal) {
      editModal.dataset.taxId = id;
      editModal.showModal();
    }
  }

  function handleEdit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const taxName = event.currentTarget.taxEditName.value;
    const taxType = event.currentTarget.taxEditType.value;
    const taxPercentage = event.currentTarget.taxEditPercentage.value;
    const id = (event.currentTarget.closest('#taxEdit_modal') as HTMLElement).dataset.taxId || '';

    const editTax = async () => {
      try {
        const res = await ApiPut.Tax(id, {
          taxName,
          taxType,
          taxPercentage,
          updatedAt: new Date(),
        });

        if (res.success === true) {
          setTaxes(
            taxes.map((tax) => {
              if (tax._id === id) {
                return {
                  ...res.data,
                } as ITax;
              }
              return tax;
            }),
          );
          const editModal = document.getElementById('taxEdit_modal') as HTMLDialogElement;
          if (editModal) {
            editModal.dataset.taxId = id;
            editModal.close();
          }
          return res.message;
        } else {
          throw new Error(res.message);
        }
      } catch (error: any) {
        throw new Error(error.message);
      }
    };
    configureToastPromise(editTax(), 'Updating tax...');
  }
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-center font-bold">Tax</h1>
      {/* adding tax */}
      <div className="flex flex-col flex-wrap gap-1 rounded-box bg-base-200 p-2">
        <h3 className="text-center font-medium">Add Tax</h3>
        <form onSubmit={saveTax} className="flex flex-wrap gap-2">
          <div className="flex flex-wrap items-center gap-1 pr-3 max-sm:w-full max-sm:justify-between">
            <label htmlFor="taxName">Tax Name</label>
            <input
              type="text"
              id="taxName"
              name="taxName"
              placeholder="Tax Name"
              className="input input-bordered input-primary input-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1 pr-3 max-sm:w-full max-sm:justify-between">
            <label htmlFor="taxType">Tax Type</label>
            <select id="taxType" name="taxType" className="select select-bordered select-primary select-sm">
              <option value={'Percentage'}>Percentage</option>
              <option value={'Fixed'}>Fixed</option>
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-1 pr-3 max-sm:w-full max-sm:justify-between">
            <label htmlFor="taxPercentage">Tax Percentage</label>
            <input
              type="number"
              id="taxPercentage"
              name="taxPercentage"
              placeholder="Tax Value"
              className="input input-bordered input-primary input-sm"
              step="0.01"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1 pr-3 max-sm:w-full max-sm:justify-end">
            <button className="btn btn-primary btn-sm">Add</button>
          </div>
        </form>
      </div>
      {/* show taxes details */}
      <dialog id="taxEdit_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-center text-lg font-bold">Edit Tax</h3>
          <form onSubmit={handleEdit} className="form-control m-2 flex-wrap gap-2 p-2">
            <div className="flex w-full flex-wrap items-center justify-between gap-1 pr-3">
              <label htmlFor="taxEditName">Tax Name</label>
              <input
                type="text"
                id="taxEditName"
                name="taxEditName"
                placeholder="Tax Name"
                className="input input-bordered input-primary input-sm"
              />
            </div>
            <div className="flex w-full flex-wrap items-center justify-between gap-1 pr-3">
              <label htmlFor="taxEditType">Tax Type</label>
              <select id="taxEditType" name="taxEditType" className="select select-bordered select-primary select-sm">
                <option value={'Percentage'}>Percentage</option>
                <option value={'Fixed'}>Fixed</option>
              </select>
            </div>
            <div className="flex w-full flex-wrap items-center justify-between gap-1 pr-3">
              <label htmlFor="taxEditPercentage">Tax Percentage</label>
              <input
                type="number"
                id="taxEditPercentage"
                name="taxEditPercentage"
                placeholder="Tax Value"
                className="input input-bordered input-primary input-sm"
                step="0.01"
              />
            </div>
            <div className="flex w-full flex-wrap items-center justify-center gap-1 pr-3">
              <button type="submit" className="btn btn-primary btn-sm">
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
                    <tr key={tax._id} className="hover text-center">
                      <td>{taxIndex + 1}</td>
                      <td>{tax.taxName}</td>
                      <td>{tax.taxType}</td>
                      <td>{tax.taxPercentage}</td>
                      <td className="flex items-center justify-center gap-1 max-sm:flex-col">
                        <button className="btn btn-warning btn-sm" onClick={() => openEditDialog(tax, tax._id)}>
                          Edit
                        </button>
                        <button className="btn btn-error btn-sm" onClick={handleDelete(tax._id)}>
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
