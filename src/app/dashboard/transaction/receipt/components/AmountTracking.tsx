import { AmtTrack } from '@dashboard/transaction/receipt/types/index';
import React from 'react';

interface AmountTrackingProps {
  amtTrack: AmtTrack;
  currentAmount?: number;
  currentTax?: number;
  currentDiscount?: number;
}

const AmountTracking: React.FC<AmountTrackingProps> = ({
  amtTrack,
  currentAmount = 0,
  currentTax = 0,
  currentDiscount = 0,
}) => {
  // Calculate remaining due by subtracting both payment and discount
  const netPayment = currentAmount + currentDiscount;
  const remainingDue = amtTrack.due - netPayment;
  const isFullyPaid = remainingDue <= 0;
  const isOverPaid = netPayment > amtTrack.due;
  const overpaymentAmount = Math.abs(remainingDue);
  const isOverPaymentCritical = overpaymentAmount > 5;

  return (
    <div className="bg-base-200 grid grid-cols-2 gap-4 rounded-lg p-4">
      {/* Original Bill Section */}
      <div className="bg-base-100 ring-primary/20 space-y-2 rounded-lg p-3 ring-1">
        <h3 className="text-primary text-sm font-bold">Original Bill</h3>
        <div className="grid grid-cols-2 gap-1 text-sm">
          <span className="text-base-content">Bill Amount:</span>
          <span className="text-right font-semibold">{amtTrack.total.toFixed(2)}</span>
          <span className="text-base-content">Previous Tax:</span>
          <span className="text-accent text-right font-semibold">+ {amtTrack.taxAmount.toFixed(2)}</span>
          <span className="text-base-content">Previous Discount:</span>
          <span className="text-secondary text-right font-semibold">- {amtTrack.discount.toFixed(2)}</span>
          <span className="text-base-content">Grand Total:</span>
          <span className="text-primary text-right font-bold">{amtTrack.grand.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Status Section */}
      <div className="bg-base-100 ring-secondary/20 space-y-2 rounded-lg p-3 ring-1">
        <h3 className="text-secondary text-sm font-bold">Payment Status</h3>
        <div className="grid grid-cols-2 gap-1 text-sm">
          <span className="text-base-content">Already Paid:</span>
          <span className="text-success text-right font-semibold">{amtTrack.paid.toFixed(2)}</span>
          <span className="text-base-content">Current Due:</span>
          <span className="text-warning text-right font-semibold">{amtTrack.due.toFixed(2)}</span>
        </div>

        {/* Current Payment Details */}
        {(currentAmount > 0 || currentTax > 0 || currentDiscount > 0) && (
          <>
            <div className="divider my-1" />
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span className="text-base-content">Current Amount:</span>
              <span className="text-right">{currentAmount.toFixed(2)}</span>
              <span className="text-base-content">Current Discount:</span>
              <span className="text-secondary text-right">- {currentDiscount.toFixed(2)}</span>
              <span className="text-base-content">Net Payment:</span>
              <span className={`text-right font-bold ${isOverPaid ? 'text-error' : ''}`}>
                {netPayment.toFixed(2)}
                {isOverPaid && <div className="badge badge-error badge-sm ml-2 gap-1">Overpaid</div>}
              </span>
              <span className="text-base-content">Current Tax:</span>
              <span className="text-accent text-right">+ {currentTax.toFixed(2)}</span>
              <span className="text-base-content">Total with Tax:</span>
              <span className="text-right font-bold">{(netPayment + currentTax).toFixed(2)}</span>
              <span className="text-base-content">Remaining Due:</span>
              <span className={`text-right font-bold ${isFullyPaid ? 'text-success' : 'text-error'}`}>
                {isFullyPaid ? 'FULLY PAID' : remainingDue.toFixed(2)}
              </span>
              {isOverPaid && (
                <div className="col-span-2 mt-2">
                  <div className={`alert ${isOverPaymentCritical ? 'alert-error' : 'alert-warning'} alert-sm py-2`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      {isOverPaymentCritical
                        ? `Cannot save: Overpayment exceeds ₹5 limit (Current: ₹${overpaymentAmount.toFixed(2)})`
                        : `Warning: Payment exceeds due amount by ₹${overpaymentAmount.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AmountTracking;
