import { CloudArrowUpIcon, PrinterIcon } from '@heroicons/react/24/solid';
import { IBill } from '@models/klm';
import { fetchAndCalculateBillDetails, initialBillDetails } from '@utils/calculateBillDetails';
import { Route } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface SaveUpdatePrintProps {
  newBill: boolean;
  bill: IBill;
  printType: string;
  setPrintType: React.Dispatch<React.SetStateAction<string>>;
  handleSaveBill: () => Promise<void>;
  handleUpdateBill: () => Promise<void>;
}

const PaymentStatus: React.FC<{ bill: IBill }> = ({ bill }) => {
  const [billDetails, setBillDetails] = useState(initialBillDetails);

  useEffect(() => {
    const fetchBillDetails = async (): Promise<void> => {
      if (bill) {
        const details = await fetchAndCalculateBillDetails(bill.billNumber, bill.totalAmount);
        setBillDetails(details);
      }
    };

    fetchBillDetails();
  }, [bill]);

  return (
    <div className="dropdown dropdown-end dropdown-top dropdown-hover">
      <div
        tabIndex={0}
        role="button"
        className="badge badge-info flex flex-row items-center justify-between gap-1 py-3"
      >
        <b>Status:</b>
        <p>{bill.paymentStatus}</p>
      </div>
      <div tabIndex={0} className="card dropdown-content compact z-20 w-72 min-w-52 max-w-96 pt-2 shadow">
        <div tabIndex={0} className="card-body rounded-box bg-base-300 ring-1 ring-primary">
          <h2 className="card-title select-none">Payment Details</h2>
          <table className="w-full table-auto rounded-box bg-base-100 shadow-inner shadow-base-300 ring-1 ring-secondary">
            <tbody className="">
              <tr className="text-primary">
                <td className="px-2 py-1">
                  <b>Base Total:</b>
                </td>
                <td className="px-2 py-1 text-right text-base font-bold">{bill.totalAmount}</td>
              </tr>
              {billDetails.discount > 0 && (
                <tr className="text-secondary">
                  <td className="px-2 py-1">
                    <b>Discount:</b>
                  </td>
                  <td className="px-2 py-1 text-right text-base font-bold">- {billDetails.discount}</td>
                </tr>
              )}
              <tr className="text-accent">
                <td className="px-2 py-1">
                  <b>Tax Amount:</b>
                </td>
                <td className="px-2 py-1 text-right text-base font-bold">+ {billDetails.taxAmount}</td>
              </tr>
              <tr className="text-info">
                <td className="px-2 py-1">
                  <b>Grand Total:</b>
                </td>
                <td className="px-2 py-1 text-right text-base font-bold">{billDetails.grandTotal}</td>
              </tr>
              <tr className="text-success">
                <td className="px-2 py-1">
                  <b>Paid Amount:</b>
                </td>
                <td className="px-2 py-1 text-right text-base font-bold">{billDetails.paidAmount}</td>
              </tr>
              {billDetails.dueAmount > 0 && (
                <tr className="text-error">
                  <td className="px-2 py-1">
                    <b>Due Amount:</b>
                  </td>
                  <td className="px-2 py-1 text-right text-base font-bold">{billDetails.dueAmount}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

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
                  href={`/print-preview/bill/${printType}?billNumber=${bill.billNumber}` as Route}
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
