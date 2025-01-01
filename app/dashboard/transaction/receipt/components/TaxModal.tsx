import { Modal } from '@components/Modal/Modal';
import { IReceipt, IReceiptTax, ITax } from '@models/klm';
import { toast } from '@utils/toast/toast';
import React from 'react';
import { calculateTotalTax } from '../utils/receiptUtils';

interface TaxModalProps {
  taxList: ITax[];
  selectedTaxes: IReceiptTax[]; // Changed from ITax[] to IReceiptTax[]
  setReceipt: React.Dispatch<React.SetStateAction<IReceipt | undefined>>;
}

const TaxModal: React.FC<TaxModalProps> = ({ taxList, selectedTaxes = [], setReceipt }) => {
  const updateReceiptWithTaxes = (receipt: IReceipt | undefined, updatedTaxes: IReceiptTax[]): IReceipt | undefined => {
    if (!receipt) return receipt;

    // Ensure we have valid arrays and values
    const safeUpdatedTaxes = Array.isArray(updatedTaxes) ? updatedTaxes : [];
    const amount = receipt.amount || 0;

    return {
      ...receipt,
      tax: safeUpdatedTaxes,
      taxAmount: calculateTotalTax(amount, safeUpdatedTaxes),
    } as IReceipt;
  };

  const handleRowClick = (taxId: string): void => {
    setReceipt((prev) => {
      if (!prev) return prev;

      const selectedTax = taxList.find((t) => t._id.toString() === taxId);
      if (!selectedTax) {
        toast.error('Selected tax not found');
        return prev;
      }

      const receiptTax: IReceiptTax = {
        _id: selectedTax._id,
        taxName: selectedTax.taxName,
        taxType: selectedTax.taxType as 'Percentage' | 'Fixed',
        taxPercentage: selectedTax.taxPercentage,
      };

      // Ensure prev.tax is an array
      const currentTaxes = Array.isArray(prev.tax) ? prev.tax : [];
      const isSelected = currentTaxes.some((t) => t._id.toString() === selectedTax._id.toString());

      const updatedTaxes = isSelected
        ? currentTaxes.filter((t) => t._id.toString() !== selectedTax._id.toString())
        : [...currentTaxes, receiptTax];

      return updateReceiptWithTaxes(prev, updatedTaxes);
    });
  };

  return (
    <Modal id="receipt_tax_modal" isBackdrop={true} title="Select Taxes">
      <div className="tax-table">
        <table className="table-zebra rounded-box table">
          <caption className="bg-neutral/5 table-caption">Tax</caption>
          <thead>
            <tr className="bg-neutral/20 text-center">
              <th>Sn</th>
              <th>Selected</th>
              <th>Tax Name</th>
              <th>Percentage/Amount</th>
            </tr>
          </thead>
          <tbody>
            {taxList.map((tax, taxIndex) => (
              <tr
                key={tax._id.toString()}
                className="hover hover:bg-neutral/10 cursor-pointer text-center"
                onClick={() => handleRowClick(tax._id.toString())}
              >
                <td>{taxIndex + 1}</td>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox-primary checkbox checkbox-sm"
                    checked={selectedTaxes.some((t) => t._id === tax._id)}
                    readOnly
                  />
                </td>
                <td>{tax.taxName}</td>
                <td>{tax.taxType === 'Percentage' ? `${tax.taxPercentage}%` : `${tax.taxPercentage}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default TaxModal;
