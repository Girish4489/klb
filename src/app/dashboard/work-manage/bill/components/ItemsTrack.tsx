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
    <div className="flex h-full flex-col rounded-box bg-base-300 shadow-lg ring-2 ring-primary">
      <div className="border-b border-base-300 p-2">
        <h2 className="text-center font-bold">Items Track</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="table-compact table w-full">
          <thead className="sticky top-0 z-10 bg-base-200">
            <tr>
              <th className="w-12 text-center">No</th>
              <th className="text-center">Amount</th>
              <th className="text-center">Running</th>
            </tr>
          </thead>
          <tbody>
            {bill?.order?.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center text-base-content/60">
                  No items to track
                </td>
              </tr>
            ) : (
              bill?.order?.map((order, orderIndex) => (
                <tr key={orderIndex} className="text-center">
                  <th>{orderIndex + 1}</th>
                  <td>{order.amount}</td>
                  <td>{calculateRunningTotal(bill.order, orderIndex)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {bill.order?.length > 0 && (
        <div className="border-t border-base-300 p-2">
          <div className="rounded-lg bg-primary px-2 py-1 text-primary-content">
            <div className="flex items-center justify-between">
              <span>Total:</span>
              <span className="font-bold">{calculateTotalAmount(bill.order)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsTrack;
