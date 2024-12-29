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
import { toast } from '@utils/toast/toast';
import axios from 'axios';
import { ChangeEvent, ComponentType, FC, FormEvent, JSX, SVGProps, useState } from 'react';

interface InputFieldProps {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  type: string;
  name: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  autoComplete: string;
}

const InputField: FC<InputFieldProps> = ({ icon: Icon, type, name, value, onChange, placeholder, autoComplete }) => (
  <div className="flex flex-col max-sm:w-full max-sm:flex-row max-sm:justify-between">
    <label htmlFor={name} className="input input-sm input-primary flex max-w-xs items-center gap-2">
      <Icon className="text-primary h-6 w-6" />
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
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  autoComplete: string;
}

const TextAreaField: FC<TextAreaFieldProps> = ({ icon: Icon, name, value, onChange, placeholder, autoComplete }) => (
  <div className="flex max-sm:w-full max-sm:justify-between">
    <label htmlFor={name} className="label label-text">
      <Icon className="text-primary h-6 w-6" />
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

export default function NewCustomerPage(): JSX.Element {
  const [customer, setCustomer] = useState<ICustomer>();

  const handleCustomerSave = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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

  const handleChange =
    (field: keyof ICustomer) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setCustomer(
        (prevCustomer) =>
          ({
            ...prevCustomer,
            [field]: e.target.value,
          }) as ICustomer,
      );
    };

  return (
    <div className="bg-base-100 flex h-full w-full flex-col items-center justify-center">
      <form
        onSubmit={handleCustomerSave}
        className="rounded-box border-base-300 bg-base-200 w-full gap-2 border-2 p-4 md:w-fit"
      >
        <span className="flex w-full justify-around">
          <h2 className="text-base-content w-fit self-center py-2 text-center align-middle font-bold text-2xl">
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
