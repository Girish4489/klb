'use client';
import { exportToCSV, exportToPDF } from '@/app/utils/exportUtils/common';
import { prepareReceiptExportData } from '@/app/utils/exportUtils/receipts';
import { FunnelIcon } from '@heroicons/react/24/solid';
import { IReceipt } from '@models/klm';
import handleError from '@utils/error/handleError';
import { fetchAllData } from '@utils/fetchAllData/fetchAllData';
import { formatD } from '@utils/format/dateUtils';
import { ApiGet, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import React, { JSX, useState } from 'react';
import toast from 'react-hot-toast';

const PAGE_SIZE = 10; // Number of receipts per page

interface ReceiptDateResponse extends ApiResponse {
  success: boolean;
  message: string;
  receipt: IReceipt[];
  totalReceipts: number;
}

export default function Receipt(): JSX.Element {
  const [fromDate, setFromDate] = React.useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [receipts, setReceipts] = useState<IReceipt[]>([]);

  const handleFilter = async (): Promise<void> => {
    if (!fromDate || !toDate) {
      toast.error('Please provide both fromDate and toDate');
      return;
    }
    if (fromDate > toDate) {
      toast.error('Invalid date range. fromDate cannot be greater than toDate');
      return;
    }
    const filter = async (): Promise<string | undefined> => {
      try {
        setReceipts([]);
        const data = await ApiGet.Receipt.ReceiptFromToDate<ReceiptDateResponse>(fromDate, toDate, 1);
        if (!data) {
          throw new Error('No response from server');
        }
        if (data.success) {
          setReceipts(data.receipt);
          setTotalPages(calculateTotalPages(data.totalReceipts));
          setCurrentPage(1);
          return data.message;
        } else {
          throw new Error('An error occurred');
        }
      } catch (error) {
        handleError.log(error);
      }
    };
    try {
      toast.promise(filter(), {
        loading: 'Filtering receipts...',
        success: (message: string) => <b>{message}</b>,
        error: (error: Error) => <b>{error.message}</b>,
      });
    } catch (error) {
      handleError.log(error);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf'): Promise<void> => {
    if (!fromDate || !toDate) {
      toast.error('Please select date range first');
      return;
    }

    toast.promise(
      (async (): Promise<string> => {
        const allReceipts = await fetchAllData.receipts(fromDate, toDate);
        const exportData = prepareReceiptExportData(allReceipts);
        if (format === 'csv') {
          exportToCSV(exportData, 'receipt-details.csv');
        } else if (format === 'pdf') {
          exportToPDF(exportData, 'receipt-details.pdf');
        }
        return 'Export completed';
      })(),
      {
        loading: 'Preparing export...',
        success: 'Export completed successfully',
        error: 'Failed to export data',
      },
    );
  };

  const ReceiptTable = ({ caption, receipts }: { caption: string; receipts: IReceipt[] }): JSX.Element => {
    return (
      <div
        className={`rounded-box border-base-300 bg-base-100 table-row overflow-auto border-2 ${receipts.length === 0 && 'min-h-24'}`}
      >
        <table className="table-zebra table-pin-rows table h-fit">
          <caption className="table-caption px-1 py-2 font-bold">{caption}</caption>
          {receipts.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={13} className="text-warning">
                  No receipts
                </td>
              </tr>
            </tbody>
          ) : (
            <>
              <thead>
                <tr className="text-center">
                  <th>Slno</th>
                  <th>Receipt No</th>
                  <th>Bill No</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Payment Date</th>
                  <th>Created By</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt: IReceipt, index) => (
                  <tr key={index} className="text-center">
                    <td>{index + 1}</td>
                    <td>{receipt.receiptNumber}</td>
                    <td>{receipt.bill?.billNumber}</td>
                    <td>{receipt.amount}</td>
                    <td>{receipt.paymentMethod}</td>
                    <td>{formatD(receipt.paymentDate)}</td>
                    <td>{receipt.bill?.name}</td>
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </table>
      </div>
    );
  };

  const fetchReceipts = async (
    fromDate: Date,
    toDate: Date,
    page: number,
  ): Promise<ReceiptDateResponse | undefined> => {
    const data = await ApiGet.Receipt.ReceiptFromToDate<ReceiptDateResponse>(fromDate, toDate, page);
    return data;
  };

  const calculateTotalPages = (totalReceipts: number): number => {
    return Math.ceil(totalReceipts / PAGE_SIZE);
  };

  const handlePageChange = async (page: number): Promise<void> => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    if (!fromDate || !toDate) {
      toast.error('Please provide both fromDate and toDate');
      return;
    }
    const data = await fetchReceipts(fromDate, toDate, page);
    if (data?.success) {
      setReceipts(data.receipt);
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      <h1 className="text-center text-3xl font-bold">Receipts</h1>
      <div className="flex flex-col gap-1">
        <div className="rounded-box bg-base-300 flex gap-4 px-2 py-2">
          <label
            className="input input-sm label-text input-bordered input-primary flex grow items-center gap-2"
            htmlFor="fromDate"
          >
            From:
            <input type="date" id="fromDate" className="grow" onChange={(e) => setFromDate(new Date(e.target.value))} />
          </label>
          <label
            className="input input-sm label-text input-bordered input-primary flex grow items-center gap-2"
            htmlFor="toDate"
          >
            To:
            <input type="date" id="toDate" className="grow" onChange={(e) => setToDate(new Date(e.target.value))} />
          </label>
          <div className="grow">
            <button className="btn btn-primary btn-sm" onClick={handleFilter}>
              <FunnelIcon className="h-6 w-6" />
              Filter
            </button>
          </div>
          {receipts.length > 0 && (
            <span className="grow space-x-2">
              <button onClick={() => handleExport('csv')} className="btn btn-secondary btn-sm">
                Export CSV
              </button>
              <button onClick={() => handleExport('pdf')} className="btn btn-secondary btn-sm">
                Export PDF
              </button>
            </span>
          )}
        </div>
        <ReceiptTable caption="Receipts" receipts={receipts} />
        {/* Pagination 1 */}
        {receipts.length > 0 && (
          <div className="join mt-4 table-row space-y-1 text-center">
            {Array.from({ length: totalPages }, (_, index) => (
              <input
                key={index}
                name="options"
                type="radio"
                aria-label={String(index + 1)}
                onClick={() => handlePageChange(index + 1)}
                value={index + 1}
                defaultChecked={currentPage === index + 1}
                className={`btn btn-square join-item ${currentPage === index + 1 ? 'checked' : ''}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
