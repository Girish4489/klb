'use client';
import InputField from '@dashboard/transaction/receipt/components/InputField';
import TaxModal from '@dashboard/transaction/receipt/components/TaxModal';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { IReceipt, IReceiptTax, ITax } from '@models/klm';
import React from 'react';

interface ReceiptHeaderProps {
  receipt: IReceipt | undefined;
  setReceipt: React.Dispatch<React.SetStateAction<IReceipt | undefined>>;
  amtTrack: { total: number; grand: number; discount: number; paid: number; due: number };
  setAmtTrack: React.Dispatch<
    React.SetStateAction<{ total: number; grand: number; discount: number; paid: number; due: number }>
  >;
  tax: ITax[];
}

const ReceiptHeader: React.FC<ReceiptHeaderProps> = ({ receipt, setReceipt, amtTrack, tax }) => {
  const calculateTotalTax = (amount: number, taxes: IReceiptTax[]): number => {
    return taxes.reduce(
      (acc, t) => acc + (t.taxType === 'Percentage' ? (amount * t.taxPercentage) / 100 : t.taxPercentage),
      0,
    );
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row flex-wrap items-center gap-1 p-1">
        <InputField
          label="Receipt No"
          id="receiptNo"
          type="number"
          inputClassName="disabled"
          value={receipt?.receiptNumber?.toString() ?? ''}
          onChange={(e) => {
            const limitedValue = e.target.value.slice(0, 7);
            const parsedValue = limitedValue === '' ? '' : parseInt(limitedValue);
            setReceipt({ ...receipt, receiptNumber: parsedValue } as IReceipt);
          }}
          placeholder="Receipt No"
          readOnly
        />
        <InputField
          label="Bill No"
          id="billNo"
          type="number"
          inputClassName="disabled"
          value={receipt?.bill?.billNumber?.toString() ?? ''}
          onChange={(e) => {
            const limitedValue = e.target.value.slice(0, 7);
            const parsedValue = limitedValue === '' ? '' : parseInt(limitedValue);
            setReceipt({ ...receipt, bill: { ...receipt?.bill, billNumber: parsedValue } } as IReceipt);
          }}
          placeholder="Bill No"
          readOnly
        />
        <InputField
          label="Name"
          id="name"
          value={receipt?.bill?.name ?? ''}
          onChange={(e) => {
            setReceipt({ ...receipt, bill: { ...receipt?.bill, name: e.target.value } } as IReceipt);
          }}
          placeholder="Name"
        />
        <InputField
          label="Mobile"
          id="mobile"
          type="tel"
          value={receipt?.bill?.mobile?.toString() ?? ''}
          onChange={(e) => {
            setReceipt({
              ...receipt,
              bill: { ...receipt?.bill, mobile: parseInt(e.target.value) },
            } as IReceipt);
          }}
          placeholder="Mobile"
        />
        <InputField
          label="Date"
          id="receiptDate"
          type="date"
          value={receipt?.paymentDate ? new Date(receipt.paymentDate).toISOString().split('T')[0] : ''}
          onChange={(e) => {
            setReceipt({ ...receipt, paymentDate: new Date(e.target.value) } as IReceipt);
          }}
        />
        <InputField
          label="Amount"
          id="receiptAmount"
          type="number"
          value={receipt?.amount?.toString() ?? ''}
          onChange={(e) => {
            const limitedValue = e.target.value.slice(0, 7);
            const parsedValue = limitedValue === '' ? 0 : parseInt(limitedValue);
            const totalTax = calculateTotalTax(parsedValue, receipt?.tax ?? []);
            setReceipt({ ...receipt, amount: parsedValue, taxAmount: totalTax } as IReceipt);
          }}
          placeholder="Amount"
          required
        />
        <InputField
          label="Discount"
          id="discount"
          type="number"
          value={receipt?.discount?.toString() ?? ''}
          onChange={(e) => {
            const limitedValue = e.target.value.slice(0, 7);
            const parsedValue = limitedValue === '' ? 0 : parseInt(limitedValue);
            setReceipt({ ...receipt, discount: parsedValue } as IReceipt);
          }}
          placeholder="Discount"
        />
        <TaxModal taxList={tax ?? []} selectedTaxes={receipt?.tax ?? []} setReceipt={setReceipt} />
        <div className="flex flex-row items-center justify-between gap-4 px-2">
          <label htmlFor="taxOptions">
            <button
              className="btn btn-primary btn-sm text-nowrap"
              name="taxOptions"
              id="taxOptions"
              onClick={() => (document.getElementById('receipt_tax_modal') as HTMLDialogElement)?.showModal()}
            >
              <PlusCircleIcon className="h-5 w-5 text-primary-content" />
              Add Tax
            </button>
          </label>
        </div>
        <div className="flex grow flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
          <label className="label label-text" htmlFor="paymentMethod">
            Payment Method
          </label>
          <select
            name="paymentMethod"
            id="paymentMethod"
            value={receipt?.paymentMethod ?? ''}
            onChange={(e) => {
              setReceipt({ ...receipt, paymentMethod: e.target.value } as IReceipt);
            }}
            className="select select-bordered select-primary select-sm grow"
          >
            <option value="" disabled>
              Select
            </option>
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>
        </div>
      </div>
      <div className="rounded bg-warning/15">
        <div className="flex flex-row flex-wrap items-center justify-center gap-2 p-1">
          {Object.entries(amtTrack).map(([key, value]) => (
            <div key={key} className="flex flex-row flex-wrap items-center gap-1 max-sm:w-full max-sm:justify-between">
              <h3 className="label-text font-bold">{key.charAt(0).toUpperCase() + key.slice(1)}:</h3>
              <h3
                className={`label-text ${key === 'due' && amtTrack.due <= 0 ? 'text-warning' : ''} ${key === 'paid' && amtTrack.paid === amtTrack.grand ? 'text-success' : ''}`}
              >
                {key === 'due'
                  ? (value - (receipt?.amount ?? 0) - (receipt?.taxAmount ?? 0) + (receipt?.discount ?? 0)).toString()
                  : value.toString()}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReceiptHeader;
