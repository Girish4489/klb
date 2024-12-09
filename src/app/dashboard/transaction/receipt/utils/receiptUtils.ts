import { IReceipt, ITax } from '@models/klm';
import handleError from '@util/error/handleError';
import { ApiGet } from '@util/makeApiRequest/makeApiRequest';

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
  if (amtTrack.paid >= amtTrack.grand || amtTrack.due <= 0) throw new Error('Bill already paid');
  if (amount > amtTrack.due) throw new Error('Amount exceeds due amount');
  if (discount < 0) throw new Error('Invalid discount');
  const totalTaxAmount = tax.reduce(
    (acc, t) => acc + (t.taxType === 'Percentage' ? (amount * t.taxPercentage) / 100 : t.taxPercentage),
    0,
  );
  if (amount + totalTaxAmount > amtTrack.due) throw new Error('Total amount exceeds due amount');
}
