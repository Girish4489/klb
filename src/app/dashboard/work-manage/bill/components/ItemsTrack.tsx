import { calculateTotalAmount } from '@dashboard/work-manage/bill/utils/billUtils';
import { IBill } from '@models/klm';
import React from 'react';

interface ItemsTrackProps {
  bill: IBill;
}

const calculateRunningTotal = (orders: IBill['order'], upToIndex: number): number => {
  return orders.slice(0, upToIndex + 1).reduce((total, order) => total + (order.amount ?? 0), 0);
};

const ItemsTrack: React.FC<ItemsTrackProps> = ({ bill }) => {
  return (
    <div className="flex h-full flex-col justify-between gap-1 overflow-hidden rounded-box border-2 border-base-100 bg-base-200 max-sm:w-[90%]">
      <div className="grow overflow-auto rounded-box border-4 border-base-300 bg-base-100">
        <div className="m-0 flex h-full max-h-96 w-full flex-col p-0">
          <table className="z-5 table table-zebra table-pin-rows table-pin-cols">
            <caption className="w-full caption-top text-center">
              <h2 className="underline underline-offset-4">Items Track</h2>
            </caption>
            <thead>
              <tr className="text-center">
                <th>Sn</th>
                <th>Amt</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              {bill?.order?.map((order, orderIndex) => (
                <tr key={orderIndex} className="text-center">
                  <th>{orderIndex + 1}</th>
                  <td>{order.amount}</td>
                  <td>{calculateRunningTotal(bill.order, orderIndex)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {bill.order?.length > 0 && calculateTotalAmount(bill.order) > 0 && (
        <div className="flex w-full items-center px-2 py-1">
          <span className="btn btn-outline btn-primary btn-sm grow">
            <span className="text-nowrap">Total Amount:</span>
            <p className="badge badge-secondary">{calculateTotalAmount(bill.order)}</p>
          </span>
        </div>
      )}
    </div>
  );
};

export default ItemsTrack;
