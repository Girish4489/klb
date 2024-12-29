'use client';
import AmountTracking from '@dashboard/transaction/receipt/components/AmountTracking';
import InputField from '@dashboard/transaction/receipt/components/InputField';
import TaxModal from '@dashboard/transaction/receipt/components/TaxModal';
import { calculateTotalTax } from '@dashboard/transaction/receipt/utils/receiptUtils';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { IReceipt, ITax } from '@models/klm';
import React from 'react';
import toast from 'react-hot-toast';

interface ReceiptHeaderProps {
  receipt: IReceipt | undefined;
  setReceipt: React.Dispatch<React.SetStateAction<IReceipt | undefined>>;
  amtTrack: { total: number; grand: number; discount: number; paid: number; due: number; taxAmount: number };
  setAmtTrack: React.Dispatch<
    React.SetStateAction<{
      total: number;
      grand: number;
      discount: number;
      paid: number;
      due: number;
      taxAmount: number;
    }>
  >;
  tax: ITax[];
}

const ReceiptHeader: React.FC<ReceiptHeaderProps> = ({ receipt, setReceipt, amtTrack, tax = [] }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row flex-wrap items-center gap-2 p-1 max-sm:flex-col max-sm:*:w-full">
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
          label="Date"
          id="receiptDate"
          type="date"
          value={receipt?.paymentDate ? new Date(receipt.paymentDate).toISOString().split('T')[0] : ''}
          onChange={(e) => {
            setReceipt({ ...receipt, paymentDate: new Date(e.target.value) } as IReceipt);
          }}
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
          label="Amount"
          id="receiptAmount"
          type="number"
          value={receipt?.amount?.toString() ?? ''}
          onChange={(e) => {
            const limitedValue = e.target.value.slice(0, 7);
            const parsedValue = limitedValue === '' ? 0 : parseInt(limitedValue);
            setReceipt((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                amount: parsedValue,
                tax: prev.tax || [], // Ensure tax array exists
                taxAmount: calculateTotalTax(parsedValue, prev.tax),
              } as IReceipt;
            });
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
        <label className="select select-bordered select-primary select-sm grow" htmlFor="paymentMethod">
          <span className="label text-nowrap">Payment Method</span>
          <select
            name="paymentMethod"
            id="paymentMethod"
            value={receipt?.paymentMethod ?? ''}
            onChange={(e) => {
              setReceipt({ ...receipt, paymentMethod: e.target.value } as IReceipt);
            }}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>
        </label>
        <TaxModal taxList={tax ?? []} selectedTaxes={receipt?.tax ?? []} setReceipt={setReceipt} />
        <button
          className="btn btn-primary btn-sm text-nowrap"
          onClick={() => {
            if (!tax?.length) {
              toast.error('Please configure taxes before adding them to the receipt');
              return;
            }
            (document.getElementById('receipt_tax_modal') as HTMLDialogElement)?.showModal();
          }}
        >
          <PlusCircleIcon className="text-primary-content h-5 w-5" />
          Add Tax
        </button>
      </div>

      <AmountTracking
        amtTrack={amtTrack}
        currentAmount={receipt?.amount}
        currentTax={receipt?.taxAmount}
        currentDiscount={receipt?.discount}
      />
    </div>
  );
};

export default ReceiptHeader;
