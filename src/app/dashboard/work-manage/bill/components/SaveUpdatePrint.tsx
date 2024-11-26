import { IBill } from '@/models/klm';
import { CloudArrowUpIcon, PrinterIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import React from 'react';

interface SaveUpdatePrintProps {
  newBill: boolean;
  bill: IBill;
  printType: string;
  setPrintType: React.Dispatch<React.SetStateAction<string>>;
  handleSaveBill: () => Promise<void>;
  handleUpdateBill: () => Promise<void>;
}

const SaveUpdatePrint: React.FC<SaveUpdatePrintProps> = ({
  newBill,
  bill,
  printType,
  setPrintType,
  handleSaveBill,
  handleUpdateBill,
}) => {
  return (
    <div className="z-10 mx-1 flex items-center justify-between gap-1 rounded-box border-t-2 border-base-300 bg-base-200 p-2">
      <span className="flex gap-2 pl-2">
        {newBill ? (
          <button className="btn btn-primary btn-sm" onClick={handleSaveBill}>
            <CloudArrowUpIcon className="h-5 w-5" />
            Save
          </button>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={handleUpdateBill}>
            <CloudArrowUpIcon className="h-5 w-5" />
            Update
          </button>
        )}
        <span className="join">
          <select
            name="printType"
            aria-label="Print Type"
            className="join-item select select-bordered select-accent select-sm"
            value={printType}
            onChange={(e) => setPrintType(e.target.value)}
          >
            <option tabIndex={1} value="customer">
              Customer Bill
            </option>
            <option tabIndex={2} value="worker">
              Worker Bill
            </option>
          </select>
          <Link
            className="btn btn-accent join-item btn-sm"
            href={`/print-preview/bill/${printType}?billNumber=${bill.billNumber}`}
            prefetch={false}
          >
            <PrinterIcon className="h-5 w-5" />
            Print
          </Link>
        </span>
      </span>
      <div className="flex flex-row justify-between gap-1 max-sm:flex-col">
        <div className="flex flex-row items-center justify-between">
          <b className="label-text">Paid:</b>
          <p className="label label-text">{bill.paidAmount}</p>
        </div>
        <div className="flex flex-row items-center justify-between">
          <b className="label-text">Due:</b>
          <p className="label label-text">{bill.dueAmount}</p>
        </div>
        <div className="flex flex-row items-center justify-between">
          <b className="label-text">Status:</b>
          <p className="label label-text">{bill.paymentStatus}</p>
        </div>
      </div>
    </div>
  );
};

export default SaveUpdatePrint;
