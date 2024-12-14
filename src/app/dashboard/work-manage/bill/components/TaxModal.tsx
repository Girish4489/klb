import { ITax } from '@models/klm';
import React from 'react';

interface TaxModalProps {
  taxList: ITax[];
  selectedTaxes: ITax[];
  onTaxToggle: (taxId: string) => void;
}

const TaxModal: React.FC<TaxModalProps> = ({ taxList, selectedTaxes, onTaxToggle }) => (
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
            {taxList.map((tax, taxIndex) => (
              <tr
                key={tax._id.toString()}
                className="hover text-center"
                onClick={() => onTaxToggle(tax._id.toString())}
              >
                <td>{taxIndex + 1}</td>
                <td>
                  <label htmlFor={tax.taxName} className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="checkbox-primary checkbox checkbox-sm"
                      name={tax.taxName}
                      id={tax.taxName}
                      checked={selectedTaxes?.some((t) => t._id === tax._id) ?? false}
                      onChange={() => onTaxToggle(tax._id.toString())}
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

export default TaxModal;
