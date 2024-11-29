import handleError from '@/app/util/error/handleError';
import { ApiGet } from '@/app/util/makeApiRequest/makeApiRequest';
import { IBill, ICategory, ITax } from '@/models/klm';

export async function fetchInitialData(
  setCategory: React.Dispatch<React.SetStateAction<ICategory[]>>,
  setTax: React.Dispatch<React.SetStateAction<ITax[]>>,
  setTodayBill: React.Dispatch<React.SetStateAction<IBill[]>>,
  setThisWeekBill: React.Dispatch<React.SetStateAction<IBill[]>>,
) {
  try {
    const [catResponse, taxResponse, billResponse] = await Promise.all([
      ApiGet.Category(),
      ApiGet.Tax(),
      ApiGet.Bill.BillToday(),
    ]);

    if (catResponse.success) {
      setCategory(catResponse.categories);
    } else {
      throw new Error(catResponse.message);
    }

    if (taxResponse.success) {
      setTax(taxResponse.taxes);
    } else {
      throw new Error(taxResponse.message);
    }

    if (billResponse.success) {
      setTodayBill(billResponse.todayBill);
      setThisWeekBill(billResponse.weekBill);
    } else {
      throw new Error(billResponse.message);
    }
  } catch (error) {
    handleError.toastAndLog(error);
  }
}

export async function validateBill(bill: IBill | undefined) {
  if (!bill) throw new Error('No bill data found');
  if (!bill.billNumber) throw new Error('Bill number is required');
  if (!bill.order || bill.order.length === 0) throw new Error('No orders added');
  if (!bill.date) throw new Error('Date is required');
  if (!bill.dueDate) throw new Error('Due date is required');
  if (!bill.mobile) throw new Error('Mobile number is required');

  for (const [index, order] of bill.order.entries()) {
    if ((order.amount ?? 0) <= 0) {
      throw new Error(`Amount should be greater than 0 for order Sl No ${index + 1}`);
    }
  }
}
