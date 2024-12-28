import { Modal } from '@/app/components/Modal/Modal';
import { IReceipt, IReceiptTax, ITax } from '@models/klm';
import React from 'react';
import toast from 'react-hot-toast';

interface TaxModalProps {
  taxList: ITax[];
  selectedTaxes: IReceiptTax[]; // Changed from ITax[] to IReceiptTax[]
  setReceipt: React.Dispatch<React.SetStateAction<IReceipt | undefined>>;
}

const TaxModal: React.FC<TaxModalProps> = ({ taxList, selectedTaxes = [], setReceipt }) => {
  const calculateTotalTax = (amount: number, taxes: IReceiptTax[]): number => {
    return Number(
      taxes
        .reduce((acc, t) => acc + (t.taxType === 'Percentage' ? (amount * t.taxPercentage) / 100 : t.taxPercentage), 0)
        .toFixed(2),
    );
  };

  const updateReceiptWithTaxes = (receipt: IReceipt | undefined, updatedTaxes: IReceiptTax[]): IReceipt | undefined => {
    if (!receipt) return receipt;
    const newTaxAmount = calculateTotalTax(receipt.amount || 0, updatedTaxes);
    // Create a new receipt with updated tax information while preserving the IReceipt type
    return {
      ...receipt,
      tax: updatedTaxes,
      taxAmount: newTaxAmount,
    } as IReceipt; // Cast to IReceipt to maintain type safety
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

      const isSelected = prev.tax?.some((t) => t._id.toString() === selectedTax._id.toString());
      const updatedTaxes = isSelected
        ? (prev.tax || []).filter((t) => t._id.toString() !== selectedTax._id.toString())
        : [...(prev.tax || []), receiptTax];

      return updateReceiptWithTaxes(prev, updatedTaxes);
    });
  };

  return (
    <Modal id="receipt_tax_modal">
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
