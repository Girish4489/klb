import { IBill, ITax } from '@/models/klm';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface ItemsTrackProps {
  bill: IBill;
  tax: ITax[];
  handleRowClick: (taxId: string) => void;
  setBill: React.Dispatch<React.SetStateAction<IBill | undefined>>;
}

const ItemsTrack: React.FC<ItemsTrackProps> = ({ bill, tax, handleRowClick, setBill }) => {
  return (
    <div className="flex h-full flex-col justify-between gap-1 overflow-hidden rounded-box border-2 border-base-100 bg-base-200 max-sm:w-[90%]">
      <div className="grow overflow-auto rounded-box border-4 border-base-300 bg-base-100">
        <div className="m-0 flex h-full max-h-96 w-full flex-col p-0">
          <table className="z-5 table table-zebra table-pin-rows table-pin-cols">
            <caption className="w-full caption-top text-center">
              <h2 className="underline underline-offset-4">Items Track</h2>
            </caption>
            {/* head */}
            <thead>
              <tr className="text-center">
                <th>Sn</th>
                <th>Amt</th>
                <th>Tax</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {/* Initialize the running total variable */}
              {bill?.order?.map((order, orderIndex) => {
                let runningTotal: number = 0;
                return (
                  <tr key={orderIndex} className="text-center">
                    <th>{orderIndex + 1}</th>
                    <td>{order.amount}</td>
                    <td>0</td>
                    <td>
                      {/* Calculate the running total */}
                      {bill.order.slice(0, orderIndex + 1).map((o) => {
                        runningTotal += o.amount ?? 0;
                        return null;
                      })}
                      {runningTotal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-col gap-1 overflow-auto rounded-box border-4 border-base-300 bg-base-200 p-2">
        <div className="flex flex-row items-center justify-between">
          <label
            className="input input-sm label-text input-bordered input-primary flex grow items-center gap-2"
            htmlFor="totalNet"
          >
            Sub Total:
            <input
              name="totalNet"
              placeholder="Total Net"
              id="totalNet"
              type="number"
              className="grow"
              value={bill?.totalAmount || ''}
              readOnly
              aria-readonly
            />
          </label>
        </div>
        <div className="flex flex-row items-center justify-between">
          <label
            className="input input-sm label-text input-bordered input-primary flex grow items-center gap-2"
            htmlFor="discount"
          >
            Discount:
            <input
              name="discount"
              placeholder="Enter Discount Here"
              id="discount"
              type="number"
              className={'grow'}
              value={bill?.discount || ''}
              onChange={(e) =>
                setBill({
                  ...bill,
                  discount: parseInt(e.target.value) || '',
                } as IBill)
              }
            />
          </label>
        </div>
        <dialog id="tax_modal" className="modal">
          <div className="modal-box">
            <h3 className="text-center text-lg font-bold">Tax</h3>
            <div className="tax-table">
              <table className="table table-zebra">
                <thead>
                  <tr className="text-center">
                    <th>Sn</th>
                    <th>Checkbox</th>
                    <th>Tax Name</th>
                    <th>Percentage/Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {tax.map((tax, taxIndex) => (
                    <tr
                      key={tax._id.toString()}
                      className="hover text-center"
                      onClick={() => handleRowClick(tax._id.toString())}
                    >
                      <td>{taxIndex + 1}</td>
                      <td>
                        <label htmlFor={tax.taxName} className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="checkbox-primary checkbox checkbox-sm"
                            name={tax.taxName}
                            id={tax.taxName}
                            // defaultChecked={bill?.tax?.some((t) => t._id === tax._id)}
                            checked={bill?.tax?.some((t) => t._id === tax._id) ?? false}
                            onChange={() => handleRowClick(tax._id.toString())}
                          />
                        </label>
                      </td>
                      <td>{tax.taxName}</td>
                      <td>{tax.taxType === 'Percentage' ? `${tax.taxPercentage}%` : `${tax.taxPercentage}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
                <button className="btn btn-sm">Close</button>
              </form>
            </div>
          </div>
        </dialog>
        {/* Tax options select */}
        <div className="flex flex-row items-center justify-between gap-1">
          <label className="label-text" htmlFor="taxOptions">
            Tax
          </label>
          <button
            className="btn btn-primary btn-sm"
            name="taxOptions"
            id="taxOptions"
            onClick={() => (document.getElementById('tax_modal') as HTMLDialogElement)?.showModal()}
          >
            <PlusCircleIcon className="h-5 w-5 text-primary-content" />
            Add
          </button>
        </div>
        <div className="flex flex-row items-center justify-between">
          <label
            className="input input-sm label-text input-bordered input-primary flex items-center gap-2"
            htmlFor="grandTotal"
          >
            Grand Total:
            <input
              name="grandTotal"
              placeholder="Grand Total"
              id="grandTotal"
              type="number"
              className="grow"
              value={bill?.grandTotal || ''}
              readOnly
              aria-readonly
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ItemsTrack;
