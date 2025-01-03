import { IBill, ICategory, IColor } from '@models/klm';
import handleError from '@utils/error/handleError';
import { ApiGet, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import { setSearchParam } from '@utils/url/urlUtils';
import { Types } from 'mongoose';
import { Dispatch, FormEvent, SetStateAction } from 'react';

interface CategoryResponse extends ApiResponse {
  categories: ICategory[];
}

interface BillSearchResponse extends ApiResponse {
  bill: IBill[];
}

interface BillTodayResponse extends ApiResponse {
  todayBill: IBill[];
  weekBill: IBill[];
}

export async function fetchInitialData(
  setCategory: Dispatch<SetStateAction<ICategory[]>>,
  setTodayBill: Dispatch<SetStateAction<IBill[]>>,
  setThisWeekBill: Dispatch<SetStateAction<IBill[]>>,
): Promise<void> {
  try {
    const [catResponse, billResponse] = await Promise.all([
      ApiGet.Category<CategoryResponse>(),
      ApiGet.Bill.BillToday<BillTodayResponse>(),
    ]);

    if (!catResponse || !billResponse) {
      throw new Error('Failed to fetch data');
    }

    if (catResponse.success) {
      setCategory(catResponse.categories);
    } else {
      throw new Error(catResponse.message);
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

export async function validateBill(bill: IBill | undefined): Promise<void> {
  if (!bill) throw new Error('No bill data found');
  if (!bill.billNumber) throw new Error('Bill number is required');
  if (!bill.order || bill.order.length === 0) throw new Error('No orders added');
  if (!bill.date) throw new Error('Date is required');
  if (!bill.dueDate) throw new Error('Due date is required');
  if (!bill.mobile) throw new Error('Mobile number is required');
  if (!bill.name) throw new Error('Name is required');
  if (!bill.totalAmount) throw new Error('Total amount is required');

  for (const [index, order] of bill.order.entries()) {
    if ((order.amount ?? 0) <= 0) {
      throw new Error(`Amount should be greater than 0 for order Sl No ${index + 1}`);
    }
    if (!order.color || order.color.name === '' || order.color.hex === '') {
      throw new Error(`Color is required for order Sl No ${index + 1}`);
    }
  }
}

export function checkOrderInUrl(orderNumber: string): void {
  const orderElement = document.getElementById(`order_${orderNumber}`);
  if (orderElement) {
    orderElement.scrollIntoView({ behavior: 'smooth' });
    orderElement.focus();
    orderElement.classList.add('animate-bounce');
    setTimeout(() => {
      orderElement.classList.remove('animate-bounce');
    }, 3000);
  }
}

export function clearBill(setBill: Dispatch<SetStateAction<IBill | undefined>>): void {
  setBill(undefined);
  setSearchParam('billNumber', '');
  setSearchParam('orderNumber', '');
}

export async function billSearch(
  event: FormEvent<HTMLFormElement>,
  setBill: Dispatch<SetStateAction<IBill | undefined>>,
  setSearchBill: Dispatch<SetStateAction<IBill[] | undefined>>,
): Promise<void> {
  event.preventDefault();
  try {
    setBill(undefined);
    const inputValue: number = parseInt((event.target as HTMLFormElement).billSearch.value);
    const typeBillOrMobile: string = (event.target as HTMLFormElement).selectBill.value;

    if (!inputValue || !typeBillOrMobile) {
      throw new Error('Please provide valid details');
    }

    const res = await ApiGet.Bill.BillSearch<BillSearchResponse>(inputValue, typeBillOrMobile);
    if (!res) {
      throw new Error('No response from server');
    }

    if (res.success === true) {
      setSearchBill(res.bill);
    } else {
      setSearchBill(undefined);
      throw new Error(res.message);
    }
  } catch (error) {
    handleError.toastAndLog(error);
  }
}

export const searchRowClicked =
  (
    billId: string,
    searchBill: IBill[] | undefined,
    setBill: Dispatch<SetStateAction<IBill | undefined>>,
    setSearchBill: Dispatch<SetStateAction<IBill[] | undefined>>,
    updateUrlWithBillNumber: (billNumber: string) => void,
    setNewBill: Dispatch<SetStateAction<boolean>>,
  ) =>
  async (): Promise<void> => {
    try {
      const selectedBill = (searchBill ?? []).find((bill) => bill._id.toString() === billId);
      if (selectedBill) {
        setBill(selectedBill);
        setNewBill(false);
        updateUrlWithBillNumber(selectedBill.billNumber.toString());
        setSearchBill(undefined);
      } else {
        handleError.toast(new Error('Bill not found'));
      }
    } catch (error) {
      handleError.toastAndLog(error);
    }
  };

export const updateUrlWithBillNumber = (billNumber: string): void => {
  setSearchParam('billNumber', billNumber);
};

export const handleColorSelect = async (
  color: IColor,
  orderIndex: number,
  setBill: Dispatch<SetStateAction<IBill | undefined>>,
): Promise<void> => {
  await setBill((prevBill) => {
    if (!prevBill) return prevBill;

    const updatedOrder = [...prevBill.order];
    const order = updatedOrder[orderIndex];
    if (!order) return prevBill;

    updatedOrder[orderIndex] = {
      ...order,
      color: color,
    };

    return {
      ...prevBill,
      order: updatedOrder,
    } as IBill | undefined;
  });
};

export const handleSearch = async (
  event: FormEvent<HTMLFormElement>,
  setSearchBill: (bills: IBill[] | undefined) => void,
): Promise<void> => {
  event.preventDefault();
  try {
    const inputValue: number = (event.target as HTMLFormElement).billSearch.value;
    const typeBillOrMobile: string = (event.target as HTMLFormElement).selectBill.value;

    const res = await ApiGet.Bill.BillSearch<BillSearchResponse>(inputValue, typeBillOrMobile);
    if (!res) {
      throw new Error('No response from server');
    }

    if (res.success === true) {
      setSearchBill(res.bill);
    } else {
      setSearchBill(undefined);
      throw new Error(res.message);
    }
  } catch (error) {
    handleError.toastAndLog(error);
  }
};

export const calculateTotalAmount = (orders: IBill['order']): number => {
  return orders?.reduce((total, item) => total + (item.amount || 0), 0) || 0;
};

export const updateOrderAmount = (
  bill: IBill | undefined,
  orderIndex: number,
  amount: number,
  setBill: Dispatch<SetStateAction<IBill | undefined>>,
): void => {
  if (!bill) return;
  const updatedOrder = bill.order.map((o, i) => (i === orderIndex ? { ...o, amount } : o));
  setBill({
    ...bill,
    order: updatedOrder,
  } as IBill);
};

export const createEmptyOrder = (): IBill['order'][number] => ({
  category: {
    catId: new Types.ObjectId(),
    categoryName: '',
  },
  dimension: [],
  styleProcess: [],
  work: false,
  barcode: false,
  measurement: '',
  orderNotes: '',
  color: { type: 'Custom', name: '', hex: '' },
  amount: 0,
  status: 'Pending',
});

export const createInitialBill = (lastBillNumber: number = 0): Partial<IBill> => ({
  billNumber: lastBillNumber + 1,
  date: new Date(),
  dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  urgent: false,
  trail: false,
  name: '',
  email: '',
  totalAmount: 0,
  deliveryStatus: 'Pending',
  paymentStatus: 'Unpaid',
  order: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const updateBillAmounts = (bill: Partial<IBill>): Partial<IBill> => {
  const orderAmount = calculateTotalAmount(bill.order ?? []);
  return {
    ...bill,
    totalAmount: orderAmount,
  };
};
