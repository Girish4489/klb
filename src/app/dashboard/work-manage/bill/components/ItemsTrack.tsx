import { IBill, ITax } from '@/models/klm';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { InputField } from './InputField';
import TaxModal from './TaxModal';

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
            <thead>
              <tr className="text-center">
                <th>Sn</th>
                <th>Amt</th>
                <th>Tax</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              {bill?.order?.map((order, orderIndex) => {
                let runningTotal: number = 0;
                return (
                  <tr key={orderIndex} className="text-center">
                    <th>{orderIndex + 1}</th>
                    <td>{order.amount}</td>
                    <td>0</td>
                    <td>
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
      <div className="flex flex-col gap-y-2 overflow-auto rounded-box border-4 border-base-300 bg-base-200 px-1 py-2">
        <InputField
          label="Sub Total"
          id="totalNet"
          type="number"
          value={bill?.totalAmount || ''}
          labelClass="input-primary text-nowrap"
          inputClass="grow"
          onChange={() => {}}
          readOnly
        />
        <InputField
          label="Discount"
          id="discount"
          type="number"
          value={bill?.discount || ''}
          onChange={(e) =>
            setBill({
              ...bill,
              discount: parseInt(e.target.value) || '',
            } as IBill)
          }
          labelClass="input-primary text-nowrap"
          inputClass="grow"
        />
        <TaxModal taxList={tax} selectedTaxes={bill.tax as ITax[]} onTaxToggle={handleRowClick} />
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
        <InputField
          label="Grand Total"
          id="grandTotal"
          type="number"
          value={bill?.grandTotal || ''}
          labelClass="input-primary text-nowrap"
          inputClass="grow"
          readOnly
          onChange={() => {}}
        />
      </div>
    </div>
  );
};

export default ItemsTrack;
