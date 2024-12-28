import { UserIcon } from '@heroicons/react/20/solid';
import { IBill } from '@models/klm';
import { formatD } from '@utils/format/dateUtils';
import React from 'react';

interface BillTableProps {
  caption: string;
  bills: IBill[];
}

const BillTable: React.FC<BillTableProps> = ({ caption, bills }) => {
  return (
    <div
      className={`rounded-box bg-base-100 ring-neutral/40 max-h-96 overflow-x-auto ring-2 ${bills.length === 0 && 'min-h-24'}`}
    >
      <table className="table-zebra table-pin-rows table">
        <caption className="text-base-content px-1 py-2 font-bold">{caption}</caption>
        {bills.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={5} className="text-warning">
                No bills for {caption}
              </td>
            </tr>
          </tbody>
        ) : (
          <>
            <thead className="">
              <tr className="bg-base-300 text-base-content z-0 text-center">
                <th>Slno</th>
                <th>Bill No</th>
                <th>Mobile</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>U/T</th>
                <th>Bill by</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill: IBill, index) => (
                <tr key={index} className="hover text-center">
                  <td>{index + 1}</td>
                  <td>{bill?.billNumber ?? ''}</td>
                  <td>{bill?.mobile ?? ''}</td>
                  <td>{bill?.date ? formatD(bill?.date) : ''}</td>
                  <td>{bill?.dueDate ? formatD(bill?.dueDate) : ''}</td>
                  <td className="font-bold">
                    {bill?.urgent && <span className={'badge badge-error'}>U</span>}
                    {bill?.urgent && bill.trail && <span className="max-sm:divider max-sm:my-0 lg:p-1" />}
                    {bill?.trail && <span className={'badge badge-success'}>T</span>}
                  </td>
                  <td>
                    {bill?.billBy?.name && (
                      <span className="badge badge-accent badge-outline items-center justify-around gap-2 py-3 font-bold">
                        <UserIcon className="text-accent h-4 w-4" />
                        <span>{bill.billBy?.name}</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </>
        )}
      </table>
    </div>
  );
};

export default BillTable;
