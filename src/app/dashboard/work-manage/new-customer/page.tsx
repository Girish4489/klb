'use client';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  FlagIcon,
  MapIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import { ICustomer } from '@models/klm';
import handleError from '@utils/error/handleError';
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface InputFieldProps {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  type: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  autoComplete: string;
}

const InputField: React.FC<InputFieldProps> = ({
  icon: Icon,
  type,
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
}) => (
  <div className="flex flex-col max-sm:w-full max-sm:flex-row max-sm:justify-between">
    <label htmlFor={name} className="input input-sm input-primary flex max-w-xs items-center gap-2">
      <Icon className="h-6 w-6 text-primary" />
      <input
        type={type}
        name={name}
        id={name}
        className="grow"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />
    </label>
  </div>
);

interface TextAreaFieldProps {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  autoComplete: string;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  icon: Icon,
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
}) => (
  <div className="flex max-sm:w-full max-sm:justify-between">
    <label htmlFor={name} className="label label-text">
      <Icon className="h-6 w-6 text-primary" />
    </label>
    <textarea
      name={name}
      id={name}
      className="textarea textarea-primary textarea-sm grow"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
    />
  </div>
);

export default function NewCustomerPage() {
  const [customer, setCustomer] = useState<ICustomer>();

  const handleCustomerSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customer) return;

    const updatedCustomer = {
      ...customer,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const res = await axios.post('/api/dashboard/work-manage/new-customer', updatedCustomer);
      if (res.data.success) {
        setCustomer(undefined);
        toast.success(res.data.message);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      handleError.toastAndLog(error);
    }
  };

  const handleChange = (field: keyof ICustomer) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomer(
      (prevCustomer) =>
        ({
          ...prevCustomer,
          [field]: e.target.value,
        }) as ICustomer,
    );
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-base-100">
      <form
        onSubmit={handleCustomerSave}
        className="w-full gap-2 rounded-box border-2 border-base-300 bg-base-200 p-4 md:w-fit"
      >
        <span className="flex w-full justify-around">
          <h2 className="w-fit self-center py-2 text-center align-middle text-2xl font-bold text-base-content">
            New Customer
          </h2>
        </span>
        <div className="md:divider md:my-0 md:divide-dashed"></div>
        <div className="mb-2 flex flex-col gap-2 md:flex-row md:justify-between md:gap-2">
          {/* First Column */}
          <div className="mb-2 flex flex-col items-center justify-around gap-2 max-sm:w-full">
            <InputField
              label="Name"
              icon={UserIcon}
              type="text"
              name="name"
              value={customer?.name || ''}
              onChange={handleChange('name')}
              placeholder="Name"
              autoComplete="name"
            />
            <InputField
              label="Email"
              icon={EnvelopeIcon}
              type="email"
              name="email"
              value={customer?.email || ''}
              onChange={handleChange('email')}
              placeholder="Email"
              autoComplete="email"
            />
            <InputField
              label="Phone"
              icon={PhoneIcon}
              type="number"
              name="phone"
              value={customer?.phone || ''}
              onChange={handleChange('phone')}
              placeholder="Phone"
              autoComplete="mobile"
            />
          </div>
          <div className="md:divider md:divider-horizontal md:my-4"></div>
          {/* Second Column */}
          <div className="mb-2 flex flex-col items-center justify-around gap-2 max-sm:w-full">
            <InputField
              label="Country"
              icon={FlagIcon}
              type="text"
              name="country"
              value={customer?.country || ''}
              onChange={handleChange('country')}
              placeholder="Country"
              autoComplete="country-name"
            />
            <InputField
              label="State"
              icon={FlagIcon}
              type="text"
              name="state"
              value={customer?.state || ''}
              onChange={handleChange('state')}
              placeholder="State"
              autoComplete="address-level1"
            />
            <InputField
              label="City"
              icon={FlagIcon}
              type="text"
              name="city"
              value={customer?.city || ''}
              onChange={handleChange('city')}
              placeholder="City"
              autoComplete="address-level2"
            />
            <InputField
              label="Pin Code"
              icon={MapPinIcon}
              type="text"
              name="pin"
              value={customer?.pin || ''}
              onChange={handleChange('pin')}
              placeholder="Pin Code"
              autoComplete="postal-code"
            />
          </div>
        </div>
        <div className="md:divider md:my-0"></div>
        {/* Shared Columns */}
        <div className="mb-2 flex flex-col gap-2 max-sm:w-full max-sm:gap-2">
          <TextAreaField
            label="Address"
            icon={MapIcon}
            name="address"
            value={customer?.address || ''}
            onChange={handleChange('address')}
            placeholder="Address"
            autoComplete="street-address"
          />
          <TextAreaField
            label="Notes"
            icon={DocumentTextIcon}
            name="notes"
            value={customer?.notes || ''}
            onChange={handleChange('notes')}
            placeholder="Notes"
            autoComplete="off"
          />
          <button className="btn btn-primary btn-sm mt-2 max-sm:w-full">
            <CloudArrowUpIcon className="h-5 w-5" />
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
