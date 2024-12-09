'use client';
import { Modal } from '@components/Modal/Modal';
import { useCompany } from '@context/companyContext';
import { CloudArrowUpIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import { ICompany } from '@models/companyModel';
import handleError from '@util/error/handleError';
import { ApiPost } from '@util/makeApiRequest/makeApiRequest';
import Form from 'next/form';
import { useState } from 'react';
import toast from 'react-hot-toast';

const AddCompanyButton = () => {
  const { updateCompany } = useCompany();
  const [newCompany, setNewCompany] = useState<ICompany>();

  const handleAddCompany = async () => {
    try {
      if (!newCompany) throw new Error('Not valid');
      const res = await ApiPost.Company.AddNewCompany({
        ...newCompany,
        name: newCompany.name,
        contactDetails: { ...newCompany?.contactDetails, address: newCompany.contactDetails.address },
      } as ICompany);
      if (res.success) {
        toast.success(res.message ?? 'Company added successfully');
        (document.getElementById('add_new_company_modal') as HTMLDialogElement)?.close();
        updateCompany(res.data || undefined);
        setNewCompany(undefined);
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
        <PlusCircleIcon className="h-5 w-5 text-info-content" />
        Add New Company
      </button>
      <Modal id="add_new_company_modal">
        <h2 className="text-lg font-bold">Add New Company</h2>
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
            <CloudArrowUpIcon className="h-5 w-5 text-primary-content" />
            Save
          </button>
        </Form>
      </Modal>
    </div>
  );
};

export default AddCompanyButton;
