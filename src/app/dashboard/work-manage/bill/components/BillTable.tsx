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
      className={`ring-300 max-h-96 overflow-x-auto rounded-box bg-base-100 ring-2 ${bills.length === 0 && 'min-h-24'}`}
    >
      <table className="table table-zebra table-pin-rows">
        <caption className="bg-gradient-to-b from-base-300 to-base-100 px-1 py-2 font-bold text-base-content">
          {caption}
        </caption>
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
            <thead>
              <tr className="bg-base-300 text-center text-base-content">
                <th>Slno</th>
                <th>BillNumber</th>
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
                    {bill?.urgent && bill.trail && <span> | </span>}
                    {bill?.trail && <span className={'badge badge-success'}>T</span>}
                  </td>
                  <td>
                    {bill?.billBy?.name && (
                      <span className="badge badge-accent badge-outline items-center justify-around gap-2 py-3 font-bold">
                        <UserIcon className="h-4 w-4 text-accent" />
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
