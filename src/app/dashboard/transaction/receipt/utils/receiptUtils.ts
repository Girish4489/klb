import { IReceipt, IReceiptTax, ITax } from '@models/klm';
import handleError from '@utils/error/handleError';
import { ApiGet, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import { Dispatch, SetStateAction } from 'react';

interface AmtTrack {
  total: number;
  grand: number;
  paid: number;
  due: number;
}

interface TaxResponse extends ApiResponse {
  taxes: ITax[];
}

interface RecentReceiptResponse extends ApiResponse {
  recentReceipt: IReceipt[];
}

export async function fetchAllInitialData(
  setTax: Dispatch<SetStateAction<ITax[]>>,
  setRecentReceipt: Dispatch<SetStateAction<IReceipt[] | undefined>>,
): Promise<void> {
  try {
    const [taxResponse, recentReceiptResponse] = await Promise.all([
      ApiGet.Tax<TaxResponse>(),
      ApiGet.Receipt.RecentReceipt<RecentReceiptResponse>(),
    ]);

    if (!taxResponse || !recentReceiptResponse) {
      throw new Error('Failed to fetch data');
    }

    if (taxResponse.success) {
      setTax(taxResponse.taxes);
    } else {
      throw new Error(taxResponse.message ?? 'Failed to fetch taxes');
    }

    if (recentReceiptResponse.success) {
      setRecentReceipt(recentReceiptResponse.recentReceipt);
    } else {
      throw new Error(recentReceiptResponse.message ?? 'Failed to fetch recent receipts');
    }
  } catch (error) {
    handleError.toastAndLog(error);
  }
}

export function calculateTotalTax(amount: number, taxes: IReceiptTax[] | undefined = []): number {
  if (!Array.isArray(taxes)) return 0;

  try {
    return Number(
      taxes
        .filter((t) => t && typeof t.taxPercentage === 'number')
        .reduce((acc, t) => acc + (t.taxType === 'Percentage' ? (amount * t.taxPercentage) / 100 : t.taxPercentage), 0)
        .toFixed(2),
    );
  } catch (error) {
    console.error('Tax calculation error:', error);
    return 0;
  }
}

export function validateReceipt(receipt: IReceipt, amtTrack: AmtTrack): void {
  const { amount, bill, paymentMethod, paymentDate, discount } = receipt;
  if (!amount || amount <= 0) throw new Error('Invalid amount');
  if (!bill?.billNumber) throw new Error('Bill number is required');
  if (!paymentMethod) throw new Error('Payment method is required');
  if (!paymentDate) throw new Error('Payment date is required');
  if (!bill?.name) throw new Error('Name is required');
  if (amtTrack.paid >= amtTrack.grand) throw new Error('Bill already paid');

  const netPayment = amount + (discount || 0);
  const overpaymentAmount = netPayment - amtTrack.due;

  if (overpaymentAmount > 5) {
    throw new Error(
      `Cannot proceed with overpayment exceeding ₹5. Current overpayment: ₹${overpaymentAmount.toFixed(2)}`,
    );
  }

  if (netPayment > amtTrack.due) throw new Error('Net payment exceeds due amount');
  if (discount < 0) throw new Error('Invalid discount');
  if (netPayment <= 0) throw new Error('Net payment must be greater than zero');

  const totalTaxAmount = calculateTotalTax(amount, receipt.tax);
  if (totalTaxAmount < 0) throw new Error('Invalid tax amount');

  const remainingDue = amtTrack.due - netPayment;
  receipt.paymentType = remainingDue <= 0 ? 'fullyPaid' : 'advance';
}
