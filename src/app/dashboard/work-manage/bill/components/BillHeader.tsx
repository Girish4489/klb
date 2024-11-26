import { IBill } from '@/models/klm';
import React from 'react';

export interface BillHeaderProps {
  bill: IBill;
  setBill: (bill: IBill) => void;
}

interface InputFieldProps {
  label: string;
  id: string;
  type: string;
  value: string | number | boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  autoComplete?: string;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type,
  value,
  onChange,
  placeholder = '',
  readOnly = false,
  autoComplete = '',
  className = 'grow',
}) => (
  <div className="flex flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
    <label
      className={`input input-sm label-text input-bordered input-primary flex grow items-center gap-2 ${className}`}
      htmlFor={id}
    >
      {label}:
      <input
        name={id}
        id={id}
        type={type}
        value={typeof value === 'boolean' ? value.toString() : value}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={onChange}
        autoComplete={autoComplete}
        className="grow"
      />
    </label>
  </div>
);

const BillHeader: React.FC<BillHeaderProps> = ({ bill, setBill }) => {
  return (
    <div className="flex w-full flex-none justify-between gap-1 rounded-box border border-base-300 p-1 max-sm:max-h-48 max-sm:flex-col max-sm:overflow-auto">
      <div className="flex flex-row flex-wrap items-center gap-1">
        <InputField
          label="Bill No"
          id="billNo"
          type="number"
          value={bill?.billNumber ?? ''}
          readOnly
          onChange={(e) => {
            const limitedValue = e.target.value.slice(0, 7);
            const parsedValue = limitedValue === '' ? '' : parseInt(limitedValue);
            setBill({ ...bill, billNumber: parsedValue } as IBill);
          }}
          autoComplete="off"
        />
        <InputField
          label="Date"
          id="date"
          type="date"
          value={bill?.date ? new Date(bill.date).toISOString().split('T')[0] : ''}
          onChange={(e) => setBill({ ...bill, date: new Date(e.target.value) } as IBill)}
        />
        <InputField
          label="Due Date"
          id="dueDate"
          type="date"
          value={bill.dueDate ? new Date(bill.dueDate).toISOString().split('T')[0] : ''}
          onChange={(e) => setBill({ ...bill, dueDate: new Date(e.target.value) } as IBill)}
        />
        <InputField
          label="Mobile"
          id="mobile"
          type="tel"
          value={bill?.mobile ?? ''}
          placeholder="Mobile No"
          onChange={(e) => {
            const limitedValue = e.target.value.slice(0, 10);
            const parsedValue = limitedValue === '' ? '' : parseInt(limitedValue);
            setBill({ ...bill, mobile: parsedValue } as IBill);
          }}
          autoComplete="off"
        />
        <InputField
          label="Name"
          id="name"
          type="text"
          value={bill?.name ?? ''}
          placeholder="Customer Name"
          autoComplete="name"
          onChange={(e) => setBill({ ...bill, name: e.target.value } as IBill)}
        />
        <InputField
          label="Email"
          id="email"
          type="email"
          value={bill?.email ?? ''}
          placeholder="Customer Email"
          autoComplete="email"
          onChange={(e) => setBill({ ...bill, email: e.target.value } as IBill)}
        />
        <div className="flex flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
          <label className="btn btn-neutral btn-sm flex h-full grow items-center gap-2" htmlFor="urgent">
            Urgent:
            <input
              name="urgent"
              id="urgent"
              type="checkbox"
              className="checkbox-primary checkbox checkbox-sm"
              checked={bill?.urgent || false}
              onChange={(e) => setBill({ ...bill, urgent: e.target.checked } as IBill)}
            />
          </label>
        </div>
        <div className="flex flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
          <label className="btn btn-neutral btn-sm flex h-full grow items-center gap-2" htmlFor="trail">
            Trail:
            <input
              name="trail"
              id="trail"
              type="checkbox"
              className="checkbox-primary checkbox checkbox-sm"
              checked={bill?.trail || false}
              onChange={(e) => setBill({ ...bill, trail: e.target.checked } as IBill)}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default BillHeader;
