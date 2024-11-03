'use client';
import { Modal } from '@/app/components/Modal/Modal';
import { useCompany } from '@/app/context/companyContext';
import handleError from '@/app/util/error/handleError';
import { formatDNT } from '@/app/util/format/dateUtils';
import { ApiPost } from '@/app/util/makeApiRequest/makeApiRequest';
import { ICompany } from '@/models/companyModel';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { CloudArrowUpIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import toast from 'react-hot-toast';

const CompanyPage = () => {
  const { company, updateCompany, saveCompany } = useCompany();
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newCompany, setNewCompany] = useState<ICompany>();

  const handleSave = async () => {
    try {
      if (company) {
        await saveCompany(company);
        setIsEditing(false);
      }
    } catch (error) {
      handleError.toast(error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handleAddCompany = async () => {
    try {
      if (!newCompany) throw new Error('Not valid');
      const res = await ApiPost.Company({
        ...newCompany,
        name: newCompany.name,
        contactDetails: { ...newCompany?.contactDetails, address: newCompany.contactDetails.address },
      } as ICompany);
      console.log('res', res);
      if (res.data.success) {
        toast.success(res.data.message ?? 'Company added successfuly');
        (document.getElementById('add_company_modal') as HTMLDialogElement)?.close();
        updateCompany(res.data.data || undefined);
        setNewCompany(undefined);
      }
    } catch (error) {
      handleError.toast(error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  if (!company) {
    return (
      <div>
        <button
          className="btn btn-info btn-sm"
          onClick={() => (document.getElementById('add_company_modal') as HTMLDialogElement)?.showModal()}
        >
          <PlusCircleIcon className="h-5 w-5 text-info-content" />
          Add New Company
        </button>
        <Modal id="add_company_modal">
          <h2 className="text-lg font-bold">Add New Company</h2>
          <form className="flex flex-wrap justify-center gap-2 p-4 max-sm:flex-col">
            <label className="input input-sm input-primary flex items-center gap-2">
              Name:
              <input
                type="text"
                className="grow"
                name="newCompanyName"
                placeholder="Enter Company Name"
                value={newCompany?.name || ''}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value } as ICompany)}
              />
            </label>
            <label className="input input-sm input-primary flex items-center gap-2">
              GST:
              <input
                type="text"
                className="grow"
                name="newGST"
                placeholder="Enter GST Name"
                value={newCompany?.gstNumber || ''}
                onChange={(e) => setNewCompany({ ...newCompany, gstNumber: e.target.value } as ICompany)}
              />
            </label>
            <label className="input input-sm input-primary flex min-w-32 max-w-sm grow items-center gap-2">
              Address:
              <input
                type="text"
                className="grow"
                name="newCompanyAddress"
                placeholder="Enter Company Address"
                value={newCompany?.contactDetails?.address || ''}
                onChange={(e) =>
                  setNewCompany({
                    ...newCompany,
                    contactDetails: { ...newCompany?.contactDetails, address: e.target.value },
                  } as ICompany)
                }
              />
            </label>
            <button type="submit" className="btn btn-primary btn-sm" onClick={handleAddCompany}>
              <CloudArrowUpIcon className="h-5 w-5 text-primary-content" />
              Save
            </button>
          </form>
        </Modal>
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col gap-2 p-2">
      <h1 className="grow text-center">Company Details</h1>
      <div className="flex flex-col rounded-box border border-base-content/60 p-2">
        <span className="badge badge-ghost flex h-full w-full items-center justify-between p-1 hover:badge-neutral">
          <p className="w-full text-center font-bold">{company.name.toUpperCase()}</p>
          <button
            className={`btn btn-sm ${isEditing ? 'btn-warning' : 'btn-info'}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </span>
        <form className="flex flex-col flex-wrap justify-center gap-2 p-4">
          <label className="input input-sm input-primary flex items-center gap-2">
            Name:
            <input
              type="text"
              className="grow"
              name="companyName"
              value={company.name}
              onChange={(e) => updateCompany({ name: e.target.value })}
              disabled={!isEditing}
            />
          </label>
          <label className="input input-sm input-primary flex items-center gap-2">
            Address:
            <input
              type="text"
              className="grow"
              name="companyAddress"
              value={company.contactDetails.address}
              onChange={(e) =>
                updateCompany({ contactDetails: { ...company.contactDetails, address: e.target.value } })
              }
              disabled={!isEditing}
            />
          </label>
          {company.contactDetails.phones && <></>}
          <p>Created At: {formatDNT(company.createdAt)}</p>
          <p>Updated At: {formatDNT(company.updatedAt)}</p>
          {/* Add more fields as necessary */}
          {isEditing && (
            <button type="button" className="btn btn-primary btn-sm" onClick={handleSave}>
              Save
            </button>
          )}
        </form>
      </div>
      <button
        className="btn btn-info btn-sm"
        onClick={() => (document.getElementById('add_company_modal') as HTMLDialogElement)?.showModal()}
      >
        <PlusCircleIcon className="h-5 w-5 text-info-content" />
        Add Company
      </button>
    </div>
  );
};

export default CompanyPage;
