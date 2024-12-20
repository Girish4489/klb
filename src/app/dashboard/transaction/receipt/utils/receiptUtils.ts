import { IReceipt, ITax } from '@models/klm';
import handleError from '@utils/error/handleError';
import { ApiGet } from '@utils/makeApiRequest/makeApiRequest';

interface AmtTrack {
  total: number;
  grand: number;
  paid: number;
  due: number;
}

export async function fetchAllInitialData(
  setTax: React.Dispatch<React.SetStateAction<ITax[]>>,
  setRecentReceipt: React.Dispatch<React.SetStateAction<IReceipt[] | undefined>>,
) {
  try {
    const [taxResponse, recentReceiptResponse] = await Promise.all([ApiGet.Tax(), ApiGet.Receipt.RecentReceipt()]);

    if (taxResponse.success) {
      setTax(taxResponse.taxes);
    } else {
      throw new Error(taxResponse.message);
    }

    if (recentReceiptResponse.success) {
      setRecentReceipt(recentReceiptResponse.recentReceipt);
    } else {
      throw new Error(recentReceiptResponse.message);
    }
  } catch (error) {
    handleError.toastAndLog(error);
  }
}

export function validateReceipt(receipt: IReceipt, amtTrack: AmtTrack) {
  const { amount, bill, paymentMethod, paymentDate, discount, tax } = receipt;
  if (!amount || amount <= 0) throw new Error('Invalid amount');
  if (!bill?.billNumber) throw new Error('Bill number is required');
  if (!paymentMethod) throw new Error('Payment method is required');
  if (!paymentDate) throw new Error('Payment date is required');
  if (!bill?.name) throw new Error('Name is required');
  if (amtTrack.paid >= amtTrack.grand) throw new Error('Bill already paid');

  const netPayment = amount + (discount || 0);
  const overpaymentAmount = netPayment - amtTrack.due;
  
  if (overpaymentAmount > 5) {
    throw new Error(`Cannot proceed with overpayment exceeding ₹5. Current overpayment: ₹${overpaymentAmount.toFixed(2)}`);
  }
  
  if (netPayment > amtTrack.due) throw new Error('Net payment exceeds due amount');
  if (discount < 0) throw new Error('Invalid discount');
  if (netPayment <= 0) throw new Error('Net payment must be greater than zero');

  const totalTaxAmount =
    tax?.reduce(
      (acc, t) => acc + (t.taxType === 'Percentage' ? (amount * t.taxPercentage) / 100 : t.taxPercentage),
      0,
    ) ?? 0;
  if (totalTaxAmount < 0) throw new Error('Invalid tax amount');

  const remainingDue = amtTrack.due - netPayment;
  receipt.paymentType = remainingDue <= 0 ? 'fullyPaid' : 'advance';
}
