import { IReceipt } from '@models/klm';
import { ApiGet, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import { toast } from '@utils/toast/toast';

interface BillDetails {
  baseTotal: number; // Add this field
  discount: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  taxAmount: number;
}

interface ReceiptResponse extends ApiResponse {
  receipt: IReceipt[];
}

const initialBillDetails: BillDetails = {
  baseTotal: 0, // Add this field
  discount: 0,
  grandTotal: 0,
  paidAmount: 0,
  dueAmount: 0,
  taxAmount: 0,
};

const calculateDetailsFromReceipts = (receipts: IReceipt[], billTotalAmount: number): BillDetails => {
  const baseTotal = billTotalAmount; // Original bill total
  const totalAmountPaid = Number(receipts.reduce((acc, receipt) => acc + receipt.amount, 0).toFixed(2));
  const discount = Number(receipts.reduce((acc, receipt) => acc + receipt.discount, 0).toFixed(2));
  const taxAmount = Number(receipts.reduce((acc, receipt) => acc + receipt.taxAmount, 0).toFixed(2));
  const grandTotal = Number((billTotalAmount + taxAmount - discount).toFixed(2));
  const dueAmount = Number((grandTotal - totalAmountPaid).toFixed(2));

  return {
    baseTotal, // Include this field
    discount,
    grandTotal,
    paidAmount: totalAmountPaid,
    dueAmount,
    taxAmount,
  };
};

export const fetchAndCalculateBillDetails = async (
  billNumber: number,
  billTotalAmount: number,
): Promise<BillDetails> => {
  try {
    const receiptsResponse = await ApiGet.Receipt.ReceiptSearch<ReceiptResponse>(billNumber, 'bill');
    if (!receiptsResponse || !Array.isArray(receiptsResponse.receipt) || receiptsResponse.success === false) {
      toast.error('Failed to fetch receipts');
      return initialBillDetails;
    }

    return calculateDetailsFromReceipts(receiptsResponse.receipt, billTotalAmount);
  } catch {
    toast.error('Error calculating bill details');
    return initialBillDetails;
  }
};

export { calculateDetailsFromReceipts, initialBillDetails };
