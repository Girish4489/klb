import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { IBill } from '@models/klm';
import { formatDS } from '@utils/format/dateUtils';
import { Route } from 'next';
import Link from 'next/link';
import React from 'react';

const BillDetailsDropdownClear: React.FC<{
  bill: IBill;
  clearBill: () => void;
  link: string;
  linkDisabled: boolean;
}> = ({ bill, clearBill, link, linkDisabled }) => (
  <span className="flex gap-x-2">
    <button className="btn btn-info btn-sm" onClick={clearBill}>
      <CheckCircleIcon className="text-info-content h-5 w-5" />
      Clear
    </button>
    <div className="dropdown dropdown-end dropdown-hover">
      <div tabIndex={0} role="button" className="btn btn-info btn-sm text-nowrap">
        Bill Details
      </div>
      <div tabIndex={0} className="card dropdown-content compact z-20 w-64 pt-2 shadow-sm">
        <div tabIndex={0} className="card-body rounded-box bg-base-300 ring-primary ring-1">
          <h2 className="card-title select-none">Bill Details</h2>
          <div className="flex flex-wrap gap-2">
            <div className="rounded-box bg-neutral ring-primary flex grow flex-wrap items-center gap-2 px-2 py-0.5 ring-1">
              <span className="label-text">Bill No:</span>
              <span className="label-text">{bill.billNumber}</span>
            </div>
            {bill.name && (
              <div className="rounded-box bg-neutral ring-primary flex grow flex-wrap items-center gap-2 px-2 py-0.5 ring-1">
                <span className="label-text">Name:</span>
                <span className="label-text">{bill.name}</span>
              </div>
            )}
            {bill.mobile && (
              <div className="rounded-box bg-neutral ring-primary flex grow flex-wrap items-center gap-2 px-2 py-0.5 ring-1">
                <span className="label-text">Mobile:</span>
                <span className="label-text">{bill.mobile}</span>
              </div>
            )}
            {bill.billBy?.name && (
              <div className="rounded-box bg-neutral ring-primary flex grow flex-wrap items-center gap-2 px-2 py-0.5 ring-1">
                <span className="label-text">Bill By:</span>
                <span className="label-text">{bill.billBy?.name}</span>
              </div>
            )}
            <div className="rounded-box bg-neutral ring-primary flex grow flex-wrap items-center gap-2 px-2 py-0.5 ring-1">
              <span className="label-text">Date:</span>
              <span className="label-text">{bill.date ? formatDS(bill.date) : 'N/A'}</span>
            </div>
            <div className="rounded-box bg-neutral ring-primary flex grow flex-wrap items-center gap-2 px-2 py-0.5 ring-1">
              <span className="label-text">Due Date:</span>
              <span className="label-text">{bill.dueDate ? formatDS(bill.dueDate) : 'N/A'}</span>
            </div>
          </div>
          {linkDisabled && (
            <Link href={link as Route} className="btn btn-success btn-sm">
              Show Bill Details
            </Link>
          )}
        </div>
      </div>
    </div>
  </span>
);

export default BillDetailsDropdownClear;
