'use client';

import { IBill } from '@models/klm';
import { fetchAndCalculateBillDetails, initialBillDetails } from '@utils/calculateBillDetails';
import React, { useEffect, useState } from 'react';

interface PaymentDetailsProps {
  baseTotal: number;
  bill?: IBill;
  currentAmount?: number;
  currentDiscount?: number;
  currentTaxAmount?: number;
}

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  baseTotal,
  bill,
  currentAmount = 0,
  currentDiscount = 0,
  currentTaxAmount = 0,
}) => {
  const [billDetails, setBillDetails] = useState(initialBillDetails);

  useEffect(() => {
    const fetchDetails = async () => {
      if (bill?.billNumber) {
        const details = await fetchAndCalculateBillDetails(bill.billNumber, baseTotal);
        setBillDetails(details);
      }
    };

    fetchDetails();
  }, [bill?.billNumber, baseTotal]);

  if (!bill) return null;

  const safeNumber = (value: number | undefined): number => Number(value || 0);

  const details = {
    baseTotal: safeNumber(billDetails.baseTotal), // Updated from totalAmount
    discount: safeNumber(billDetails.discount),
    taxAmount: safeNumber(billDetails.taxAmount),
    grandTotal: safeNumber(billDetails.grandTotal),
    paidAmount: safeNumber(billDetails.paidAmount),
    currentAmount: safeNumber(currentAmount),
    currentTax: safeNumber(currentTaxAmount),
    currentDiscount: safeNumber(currentDiscount),
  };

  // Calculate previous amounts
  const previousGrandTotal = Number((details.baseTotal + details.taxAmount - details.discount).toFixed(2));
  const currentDue = Number((previousGrandTotal - details.paidAmount).toFixed(2));

  // Calculate current payment details
  const currentGrandTotal = Number((details.currentAmount + details.currentTax - details.currentDiscount).toFixed(2));
  const currentPayment = currentGrandTotal; // Same as currentGrandTotal for clarity

  // Calculate final due amount
  const newDueAmount = Number((currentDue - currentPayment).toFixed(2));

  return (
    <div className="dropdown dropdown-hover">
      <div
        tabIndex={0}
        role="button"
        className="badge badge-info flex flex-row items-center justify-between gap-1 py-3"
      >
        <b>Payment Details:</b>
      </div>
      <div tabIndex={0} className="card dropdown-content card-compact z-[1] w-52 bg-base-300 shadow">
        <div className="card-body">
          <h2 className="card-title text-sm">Payment Details</h2>
          <table className="table table-xs">
            <tbody>
              {/* Previous Payment Details */}
              <tr>
                <td>Base Total:</td>
                <td className="text-right">{details.baseTotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Previous Discount:</td>
                <td className="text-right">{details.discount.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Previous Tax:</td>
                <td className="text-right">{details.taxAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Previous Grand:</td>
                <td className="text-right">{previousGrandTotal}</td>
              </tr>
              <tr>
                <td>Previous Paid:</td>
                <td className="text-right">{details.paidAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div className="divider my-0"></div>
                </td>
              </tr>
              <tr className="font-bold text-primary">
                <td>Current Due:</td>
                <td className="text-right">{currentDue}</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div className="divider my-0"></div>
                </td>
              </tr>
              {/* Current Payment Details */}
              <tr>
                <td>Current Amount:</td>
                <td className="text-right">{details.currentAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Current Tax:</td>
                <td className="text-right">{details.currentTax.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Current Discount:</td>
                <td className="text-right">{details.currentDiscount.toFixed(2)}</td>
              </tr>
              <tr className="font-bold text-accent">
                <td>Current Grand:</td>
                <td className="text-right">{currentGrandTotal}</td>
              </tr>
              <tr>
                <td>Current Payment:</td>
                <td className="text-right">{currentPayment}</td>
              </tr>
              <tr className="font-bold text-secondary">
                <td>Due After:</td>
                <td className="text-right">{newDueAmount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
