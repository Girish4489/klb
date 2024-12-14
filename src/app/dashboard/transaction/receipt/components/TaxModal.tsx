import { IReceipt, IReceiptTax, ITax } from '@models/klm';
import React from 'react';
import toast from 'react-hot-toast';

interface TaxModalProps {
  taxList: ITax[];
  selectedTaxes: IReceiptTax[]; // Changed from ITax[] to IReceiptTax[]
  setReceipt: React.Dispatch<React.SetStateAction<IReceipt | undefined>>;
}

const TaxModal: React.FC<TaxModalProps> = ({ taxList, selectedTaxes = [], setReceipt }) => {
  const handleRowClick = (taxId: string) => {
    setReceipt((prevReceipt) => {
      if (!prevReceipt) return prevReceipt;

      const selectedTax = taxList.find((t) => t._id.toString() === taxId);
      if (!selectedTax) {
        toast.error('Selected tax not found');
        return prevReceipt;
      }

      const receiptTax: IReceiptTax = {
        _id: selectedTax._id,
        taxName: selectedTax.taxName,
        taxType: selectedTax.taxType as 'Percentage' | 'Fixed',
        taxPercentage: selectedTax.taxPercentage,
      };

      const isSelected = prevReceipt.tax?.some((t) => t._id.toString() === selectedTax._id.toString());
      const updatedTaxes = isSelected
        ? prevReceipt.tax.filter((t) => t._id.toString() !== selectedTax._id.toString())
        : [...(prevReceipt.tax || []), receiptTax];

      // Create a new receipt object maintaining the Document interface
      return {
        ...prevReceipt,
        tax: updatedTaxes,
      } as IReceipt;
    });
  };

  return (
    <dialog id="receipt_tax_modal" className="modal">
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
              {taxList.map((tax, taxIndex) => (
                <tr
                  key={tax._id.toString()}
                  className="hover cursor-pointer text-center"
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
                        checked={selectedTaxes.some((t) => t._id === tax._id)}
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
  );
};

export default TaxModal;
