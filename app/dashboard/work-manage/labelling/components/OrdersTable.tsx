import QrGenerator from '@components/Barcode/BarcodeGenerator';
import { IBill } from '@models/klm';
import React from 'react';

const OrdersTable: React.FC<{ bill: IBill; selectedOrders: number[]; handleOrderSelect: (index: number) => void }> = ({
  bill,
  selectedOrders,
  handleOrderSelect,
}) => (
  <div className="rounded-box border-neutral grow overflow-auto border">
    <table className="table-zebra table-pin-rows table w-full table-auto">
      <caption className="px-1 py-2 font-bold">Orders</caption>
      <thead>
        <tr className="text-center">
          <th>Select</th>
          <th>Order Number</th>
          <th>Category</th>
          <th>QR Code</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {bill.order.map((order, index) => (
          <tr
            key={index}
            id={`order_${index}`}
            className="hover cursor-pointer text-center"
            onClick={() => handleOrderSelect(index)}
          >
            <td>
              <label htmlFor={order._id?.toString()} onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  id={order._id?.toString()}
                  name="order"
                  className="checkbox-primary checkbox checkbox-md"
                  checked={selectedOrders.includes(index)}
                  onChange={() => handleOrderSelect(index)}
                />
              </label>
            </td>
            <td>{index + 1}</td>
            <td>{order?.category?.categoryName ?? ''}</td>
            <td className="flex justify-center text-center">
              <QrGenerator
                content={`billNumber=${bill.billNumber}&orderNumber=${index + 1}`}
                size={96}
                className="rounded-box bg-white ring-4"
              />
            </td>
            <td>{order.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default OrdersTable;
