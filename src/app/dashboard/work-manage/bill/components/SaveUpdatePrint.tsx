import { CloudArrowUpIcon, PrinterIcon } from '@heroicons/react/24/solid';
import { IBill } from '@models/klm';
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

const PaymentStatus: React.FC<{ bill: IBill }> = ({ bill }) => (
  <div className="flex flex-row items-center justify-between gap-1 max-sm:flex-col">
    <div className="badge badge-primary flex flex-row items-center justify-between gap-1 py-3">
      <b>Total:</b>
      <p>{bill.totalAmount}</p>
    </div>
    {bill.discount > 0 && (
      <div className="badge badge-secondary flex flex-row items-center justify-between gap-1 py-3">
        <b>Discount:</b>
        <p>{bill.discount}</p>
      </div>
    )}
    <div className="badge badge-accent flex flex-row items-center justify-between gap-1 py-3">
      <b>Grand:</b>
      <p>{bill.grandTotal}</p>
    </div>
    <div className="badge badge-success flex flex-row items-center justify-between gap-1 py-3">
      <b>Paid:</b>
      <p>{bill.paidAmount}</p>
    </div>
    {bill.dueAmount > 0 && (
      <div className="badge badge-warning flex flex-row items-center justify-between gap-1 py-3">
        <b>Due:</b>
        <p>{bill.dueAmount}</p>
      </div>
    )}
    <div
      className={`badge ${bill.paymentStatus === 'Paid' ? 'badge-success' : bill.paymentStatus === 'Partially Paid' ? 'badge-warning' : 'badge-error'} flex flex-row items-center justify-between gap-1 py-3`}
    >
      <b>Status:</b>
      <p>{bill.paymentStatus}</p>
    </div>
  </div>
);

const SaveUpdatePrint: React.FC<SaveUpdatePrintProps> = ({
  newBill,
  bill,
  printType,
  setPrintType,
  handleSaveBill,
  handleUpdateBill,
}) => {
  return (
    <div className="rounded-box bg-neutral p-2 shadow-inner ring-2 ring-info">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="flex gap-2">
          {newBill ? (
            <button className="btn btn-primary btn-sm" onClick={handleSaveBill}>
              <CloudArrowUpIcon className="h-5 w-5" />
              Save
            </button>
          ) : (
            <>
              <button className="btn btn-primary btn-sm" onClick={handleUpdateBill}>
                <CloudArrowUpIcon className="h-5 w-5" />
                Update
              </button>
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
            </>
          )}
        </span>
        <PaymentStatus bill={bill} />
      </div>
    </div>
  );
};

export default SaveUpdatePrint;
