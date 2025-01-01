'use client';
import { Modal } from '@components/Modal/Modal';
import { useCompany } from '@context/companyContext';
import { CloudArrowUpIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import { ICompany } from '@models/companyModel';
import handleError from '@utils/error/handleError';
import { ApiPost, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import { toast } from '@utils/toast/toast';
import Form from 'next/form';
import { JSX, useState } from 'react';

interface CompanyResponse extends ApiResponse {
  success: boolean;
  data?: ICompany;
}

const AddCompanyButton = (): JSX.Element => {
  const { updateCompany } = useCompany();
  const [newCompany, setNewCompany] = useState<ICompany>();

  const handleAddCompany = async (): Promise<void> => {
    try {
      if (!newCompany) throw new Error('Not valid');
      const res = await ApiPost.Company.AddNewCompany<CompanyResponse>({
        ...newCompany,
        name: newCompany.name,
        contactDetails: { ...newCompany?.contactDetails, address: newCompany.contactDetails.address },
      } as ICompany);

      if (!res) {
        throw new Error('No response from server');
      }

      if (res.success) {
        toast.success(res.message ?? 'Company added successfully');
        (document.getElementById('add_new_company_modal') as HTMLDialogElement)?.close();
        if (res.data) updateCompany(res.data);
        setNewCompany(undefined);
      } else {
        throw new Error(res.message ?? res.error ?? 'Failed to add company');
      }
    } catch (error) {
      handleError.toast(error);
    }
  };

  return (
    <div className="p-2">
      <button
        className="btn btn-info btn-sm"
        onClick={() => (document.getElementById('add_new_company_modal') as HTMLDialogElement)?.showModal()}
      >
        <PlusCircleIcon className="text-info-content h-5 w-5" />
        Add New Company
      </button>
      <Modal id="add_new_company_modal">
        <h2 className="font-bold text-lg">Add New Company</h2>
        <Form action="#" className="flex flex-wrap justify-center gap-2 p-4 max-sm:flex-col">
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
              placeholder="Enter GST Number"
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
          <button className="btn btn-primary btn-sm" onClick={handleAddCompany}>
            <CloudArrowUpIcon className="text-primary-content h-5 w-5" />
            Save
          </button>
        </Form>
      </Modal>
    </div>
  );
};

export default AddCompanyButton;
