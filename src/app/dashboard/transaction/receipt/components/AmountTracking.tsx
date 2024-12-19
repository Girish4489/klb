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
  const currentPayment = currentAmount + currentTax - currentDiscount;
  const remainingDue = amtTrack.due - currentPayment;
  const isFullyPaid = remainingDue <= 0;

  return (
    <div className="grid grid-cols-2 gap-4 rounded-lg bg-base-200 p-4">
      {/* Original Bill Section */}
      <div className="space-y-2 rounded-lg bg-base-100 p-3 ring-1 ring-primary/20">
        <h3 className="text-sm font-bold text-primary">Original Bill</h3>
        <div className="grid grid-cols-2 gap-1 text-sm">
          <span className="text-neutral">Bill Amount:</span>
          <span className="text-right font-semibold">{amtTrack.total.toFixed(2)}</span>
          <span className="text-neutral">Previous Tax:</span>
          <span className="text-right font-semibold text-accent">+ {amtTrack.taxAmount.toFixed(2)}</span>
          <span className="text-neutral">Previous Discount:</span>
          <span className="text-right font-semibold text-secondary">- {amtTrack.discount.toFixed(2)}</span>
          <span className="text-neutral">Grand Total:</span>
          <span className="text-right font-bold text-primary">{amtTrack.grand.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Status Section */}
      <div className="space-y-2 rounded-lg bg-base-100 p-3 ring-1 ring-secondary/20">
        <h3 className="text-sm font-bold text-secondary">Payment Status</h3>
        <div className="grid grid-cols-2 gap-1 text-sm">
          <span className="text-neutral">Already Paid:</span>
          <span className="text-right font-semibold text-success">{amtTrack.paid.toFixed(2)}</span>
          <span className="text-neutral">Current Due:</span>
          <span className="text-right font-semibold text-warning">{amtTrack.due.toFixed(2)}</span>
        </div>

        {/* Current Payment Details */}
        {(currentAmount > 0 || currentTax > 0 || currentDiscount > 0) && (
          <>
            <div className="divider my-1" />
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span className="text-neutral">Current Amount:</span>
              <span className="text-right">{currentAmount.toFixed(2)}</span>
              <span className="text-neutral">Current Tax:</span>
              <span className="text-right text-accent">+ {currentTax.toFixed(2)}</span>
              <span className="text-neutral">Current Discount:</span>
              <span className="text-right text-secondary">- {currentDiscount.toFixed(2)}</span>
              <span className="text-neutral">Total Payment:</span>
              <span className="text-right font-bold">{currentPayment.toFixed(2)}</span>
              <span className="text-neutral">Remaining Due:</span>
              <span className={`text-right font-bold ${isFullyPaid ? 'text-success' : 'text-error'}`}>
                {isFullyPaid ? 'FULLY PAID' : remainingDue.toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AmountTracking;
