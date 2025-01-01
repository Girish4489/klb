import { IBill } from '@models/klm';
import React from 'react';
import { calculateTotalAmount } from '../utils/billUtils';

interface ItemsTrackProps {
  bill: IBill;
}

const calculateRunningTotal = (orders: IBill['order'], upToIndex: number): number => {
  return orders.slice(0, upToIndex + 1).reduce((total, order) => total + (order.amount ?? 0), 0);
};

const ItemsTrack: React.FC<ItemsTrackProps> = ({ bill }) => {
  return (
    <div className="rounded-box ring-primary flex h-full flex-col shadow-lg ring-2">
      <div className="flex-1 overflow-y-auto">
        <table className="table-compact table-zebra table w-full">
          <caption className="table-caption text-center font-bold">Items Track</caption>
          <thead className="bg-base-200 sticky top-0 z-10">
            <tr>
              <th className="w-12 text-center">No</th>
              <th className="text-center">Amount</th>
              <th className="text-center">Running</th>
            </tr>
          </thead>
          <tbody>
            {bill?.order?.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-base-content/60 text-center">
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
        <div className="border-base-300 rounded-box bg-base-100 sticky bottom-0 mx-0.5 border-t p-2">
          <div className="bg-primary text-primary-content rounded-lg px-2 py-1">
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
