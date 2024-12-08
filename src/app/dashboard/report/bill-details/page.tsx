'use client';
import { IBill } from '@/models/klm';
import { FunnelIcon } from '@heroicons/react/24/solid';
import handleError from '@util/error/handleError';
import { formatD } from '@util/format/dateUtils';
import { ApiGet } from '@util/makeApiRequest/makeApiRequest';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const PAGE_SIZE = 10; // Number of bills per page

export default function BillDetails() {
  const [fromDate, setFromDate] = React.useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bills, setBills] = useState<IBill[]>([]);

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
        const data = await fetchBills(fromDate, toDate, 1);
        if (data.success === true) {
          setBills(data.bill);
          setTotalPages(calculateTotalPages(data.totalBills));
          setCurrentPage(1);
          return data.message;
        } else {
          throw new Error('An error occurred');
        }
      } catch (error) {
        handleError.throw(error);
      }
    };
    try {
      toast.promise(filter(), {
        loading: 'Filtering bills...',
        success: (message: string) => <b>{message}</b>,
        error: (error: Error) => <b>{error.message}</b>,
      });
    } catch (error) {
      handleError.log(error);
    }
  };

  const BillTable = ({ caption, bills }: { caption: string; bills: IBill[] }) => {
    return (
      <div
        className={`table-row overflow-auto rounded-box border-2 border-base-300 bg-base-100 ${bills.length === 0 && 'min-h-24'}`}
      >
        <table className="table table-zebra table-pin-rows h-fit">
          <caption className="table-caption px-1 py-2 font-bold">{caption}</caption>
          {bills.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={13} className="text-warning">
                  No bills
                </td>
              </tr>
            </tbody>
          ) : (
            <>
              <thead>
                <tr className="text-center">
                  <th>Slno</th>
                  <th>BillNumber</th>
                  <th>Mobile</th>
                  <th>Date</th>
                  <th>Due Date</th>
                  <th>U/T</th>
                  <th>Total</th>
                  <th>Discount</th>
                  <th>Grand</th>
                  <th>Paid</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Bill by</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill: IBill, index) => (
                  <tr key={index} className="text-center">
                    <td>{index + 1}</td>
                    <td>{bill.billNumber}</td>
                    <td>{bill.mobile}</td>
                    <td>{bill?.date ? formatD(bill?.date) : ''}</td>
                    <td>{bill?.dueDate ? formatD(bill?.dueDate) : ''}</td>
                    <td className="font-bold">
                      {bill?.urgent && <span className={'text-error'}>U</span>}
                      {bill?.urgent && bill.trail && <span> | </span>}
                      {bill?.trail && <span className={'text-success'}>T</span>}
                    </td>
                    <td>{bill?.totalAmount}</td>
                    <td>{bill?.discount}</td>
                    <td>{bill?.grandTotal}</td>
                    <td>{bill?.paidAmount}</td>
                    <td>{bill?.dueAmount}</td>
                    <td>{bill?.paymentStatus}</td>
                    <td>{bill?.billBy?.name}</td>
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </table>
      </div>
    );
  };

  const fetchBills = async (fromDate: Date, toDate: Date, page: number) => {
    const data = await ApiGet.Bill.BillFromToDate(fromDate, toDate, page);
    return { message: data.message, success: data.success, bill: data.bill, totalBills: data.totalBills };
  };

  const calculateTotalPages = (totalBills: number) => {
    return Math.ceil(totalBills / PAGE_SIZE);
  };

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > totalPages) return;
    if (page === currentPage) return;
    if (!fromDate || !toDate) return;
    const data = await fetchBills(fromDate, toDate, page);
    setBills(data.bill);
    setCurrentPage(page);
  };

  return (
    <div className="flex grow flex-col">
      <h1 className="text-center font-semibold">Bill Details</h1>
      <span className="backdrop-blur-sm-lg flex flex-wrap items-center gap-2 rounded-box bg-base-300 p-2 shadow">
        <label
          className="input input-sm label-text input-bordered input-primary flex grow items-center gap-2"
          htmlFor="fromDate"
        >
          From Date:
          <input
            type="date"
            id="fromDate"
            className="grow"
            value={fromDate ? new Date(fromDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setFromDate(new Date(e.target.value))}
          />
        </label>
        <label
          className="input input-sm label-text input-bordered input-primary flex grow items-center gap-2"
          htmlFor="toDate"
        >
          To Date:
          <input
            type="date"
            id="toDate"
            className="grow"
            value={toDate ? new Date(toDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setToDate(new Date(e.target.value))}
          />
        </label>
        <span className="grow">
          <button onClick={handleFilter} className="btn btn-primary btn-sm">
            <FunnelIcon className="h-6 w-6" />
            Filter
          </button>
        </span>
      </span>

      {/* Render bills */}
      <span className="table">
        {/* Implement your logic to render bills based on currentPage */}
        <BillTable caption="Bills" bills={bills} />
        {/* Pagination */}
        {bills.length > 0 && (
          <div className="join mt-4 table-row space-y-1 text-center">
            {Array.from({ length: totalPages }, (_, index) => (
              <input
                key={index}
                name="options"
                type="radio"
                aria-label={String(index + 1)}
                onClick={() => handlePageChange(index + 1)}
                value={index + 1}
                className={`btn btn-square join-item ${currentPage === index + 1 ? 'checked' : ''}`}
              />
            ))}
          </div>
        )}
      </span>
    </div>
  );
}
