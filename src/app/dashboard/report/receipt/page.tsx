'use client';
import { formatDate } from '@/app/util/format/dateUtils';
import { ApiGet } from '@/app/util/makeApiRequest/makeApiRequest';
import { IReceipt } from '@/models/klm';
import { useState } from 'react';
import toast from 'react-hot-toast';

const PAGE_SIZE = 10; // Number of receipts per page

export default function Receipt() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [receipts, setReceipts] = useState<IReceipt[]>([]);

  const handleFilter = async () => {
    if (!fromDate || !toDate) {
      toast.error('Please provide both fromDate and toDate');
      return;
    }
    if (fromDate > toDate) {
      toast.error('Invalid date range. fromDate cannot be greater than toDate');
      return;
    }
    const filter = async () => {
      try {
        setReceipts([]);
        const data = await ApiGet.Receipt.ReceiptFromToDate(fromDate, toDate, 1);
        if (data.success === true) {
          setReceipts(data.receipt);
          setTotalPages(calculateTotalPages(data.totalReceipts));
          setCurrentPage(1);
          return data.message;
        } else {
          throw new Error('An error occurred');
        }
      } catch (error) {}
    };
    try {
      toast.promise(filter(), {
        loading: 'Filtering receipts...',
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });
    } catch (error) {}
  };

  const ReceiptTable = ({ caption, receipts }: { caption: string; receipts: any[] }) => {
    return (
      <div
        className={`table-row overflow-auto rounded-box border-2 border-base-300 bg-base-100 ${receipts.length === 0 && 'min-h-24'}`}
      >
        <table className="table table-zebra table-pin-rows h-fit">
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
                    <td>{formatDate(receipt.paymentDate)}</td>
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

  const fetchReceipts = async (fromDate: Date, toDate: Date, page: number) => {
    const data = await ApiGet.Receipt.ReceiptFromToDate(fromDate, toDate, page);
    return data;
  };

  const calculateTotalPages = (totalReceipts: number) => {
    return Math.ceil(totalReceipts / PAGE_SIZE);
  };

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    if (!fromDate || !toDate) {
      toast.error('Please provide both fromDate and toDate');
      return;
    }
    const data = await fetchReceipts(fromDate, toDate, page);
    if (data.success === true) {
      setReceipts(data.receipt);
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Receipts</h1>
      <div className="mt-4 flex flex-col gap-1">
        <div className="flex gap-4">
          <div>
            <label htmlFor="fromDate">From</label>
            <input
              type="date"
              id="fromDate"
              className="input input-bordered"
              onChange={(e) => setFromDate(new Date(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="toDate">To</label>
            <input
              type="date"
              id="toDate"
              className="input input-bordered"
              onChange={(e) => setToDate(new Date(e.target.value))}
            />
          </div>
          <div>
            <button className="btn btn-primary" onClick={handleFilter}>
              Filter
            </button>
          </div>
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
