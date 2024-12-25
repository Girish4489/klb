import { PrinterIcon, UserIcon } from '@heroicons/react/24/solid';
import { IReceipt } from '@models/klm';
import { formatD } from '@utils/format/dateUtils';
import { useRouter } from 'next/navigation';
import React from 'react';

interface ReceiptTableProps {
  receipts: IReceipt[];
  caption: string;
}

const ReceiptTable: React.FC<ReceiptTableProps> = ({ receipts, caption }) => {
  const router = useRouter();

  return (
    <div className="rounded-box overflow-x-auto">
      <table className="table-zebra table w-full">
        <caption className="text-lg font-bold">{caption}</caption>
        <thead>
          <tr className="text-center">
            <th>Slno</th>
            <th>Receipt Number</th>
            <th>Bill Number</th>
            <th>Mobile</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Receipt By</th>
            <th>Tax Amount</th>
            <th>Discount</th>
            <th>Print</th>
          </tr>
        </thead>
        <tbody>
          {receipts.length === 0 ? (
            <tr>
              <td colSpan={11} className="text-warning">
                No receipts found for the selected criteria.
              </td>
            </tr>
          ) : (
            receipts.map((receipt, index) => (
              <tr key={index} className="hover text-center">
                <td>{index + 1}</td>
                <td>{receipt.receiptNumber}</td>
                <td>{receipt.bill?.billNumber}</td>
                <td>{receipt.bill?.mobile}</td>
                <td>{receipt.paymentDate ? formatD(receipt.paymentDate) : ''}</td>
                <td>{receipt.amount}</td>
                <td>{receipt.paymentMethod}</td>
                <td>
                  {receipt.receiptBy?.name && (
                    <span className="badge badge-accent badge-outline items-center justify-around gap-2 py-3 font-bold">
                      <UserIcon className="text-accent h-4 w-4" />
                      <span>{receipt.receiptBy?.name}</span>
                    </span>
                  )}
                </td>
                <td>{receipt.taxAmount}</td>
                <td>{receipt.discount}</td>
                <td>
                  <button
                    className="btn btn-secondary btn-xs flex-nowrap text-nowrap"
                    onClick={() =>
                      router.push(
                        `/print-preview/receipt?receiptNumber=${receipt.receiptNumber}&billNumber=${receipt.bill?.billNumber}`,
                      )
                    }
                  >
                    <PrinterIcon className="h-4 w-4" />
                    Print
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReceiptTable;
