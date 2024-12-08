import { IBill, ICategory, IColor } from '@/models/klm';
import handleError from '@util/error/handleError';
import { ApiGet } from '@util/makeApiRequest/makeApiRequest';
import { setSearchParam } from '@util/url/urlUtils';
import { Types } from 'mongoose';

export async function fetchInitialData(
  setCategory: React.Dispatch<React.SetStateAction<ICategory[]>>,
  setTodayBill: React.Dispatch<React.SetStateAction<IBill[]>>,
  setThisWeekBill: React.Dispatch<React.SetStateAction<IBill[]>>,
) {
  try {
    const [catResponse, billResponse] = await Promise.all([ApiGet.Category(), ApiGet.Bill.BillToday()]);

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

export async function validateBill(bill: IBill | undefined) {
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

export function checkOrderInUrl(orderNumber: string) {
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

export function clearBill(setBill: React.Dispatch<React.SetStateAction<IBill | undefined>>) {
  setBill(undefined);
  setSearchParam('billNumber', '');
  setSearchParam('orderNumber', '');
}

export async function billSearch(
  event: React.FormEvent<HTMLFormElement>,
  setBill: React.Dispatch<React.SetStateAction<IBill | undefined>>,
  setSearchBill: React.Dispatch<React.SetStateAction<IBill[] | undefined>>,
) {
  event.preventDefault();
  try {
    setBill(undefined);
    const inputValue: number = (event.target as HTMLFormElement).billSearch.value;
    const typeBillOrMobile: string = (event.target as HTMLFormElement).selectBill.value;

    const res = await ApiGet.Bill.BillSearch(inputValue, typeBillOrMobile);

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
    setBill: React.Dispatch<React.SetStateAction<IBill | undefined>>,
    setSearchBill: React.Dispatch<React.SetStateAction<IBill[] | undefined>>,
    updateUrlWithBillNumber: (billNumber: string) => void,
    setNewBill: React.Dispatch<React.SetStateAction<boolean>>,
  ) =>
  async () => {
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

export const updateUrlWithBillNumber = (billNumber: string) => {
  setSearchParam('billNumber', billNumber);
};

export const handleColorSelect = async (
  color: IColor,
  orderIndex: number,
  setBill: React.Dispatch<React.SetStateAction<IBill | undefined>>,
) => {
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
  event: React.FormEvent<HTMLFormElement>,
  setSearchBill: (bills: IBill[] | undefined) => void,
) => {
  event.preventDefault();
  try {
    const inputValue: number = (event.target as HTMLFormElement).billSearch.value;
    const typeBillOrMobile: string = (event.target as HTMLFormElement).selectBill.value;

    const res = await ApiGet.Bill.BillSearch(inputValue, typeBillOrMobile);

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

export const calculateTotalAmount = (orders: IBill['order']) => {
  return orders?.reduce((total, item) => total + (item.amount || 0), 0) || 0;
};

export const updateOrderAmount = (
  bill: IBill | undefined,
  orderIndex: number,
  amount: number,
  setBill: React.Dispatch<React.SetStateAction<IBill | undefined>>,
) => {
  if (!bill) return;
  const updatedOrder = bill.order.map((o, i) => (i === orderIndex ? { ...o, amount } : o));
  setBill({
    ...bill,
    order: updatedOrder,
  } as IBill);
};

export const createEmptyOrder = () => ({
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
  color: { _id: new Types.ObjectId(), name: '', code: '' },
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
  paidAmount: 0,
  dueAmount: 0,
  totalAmount: 0,
  discount: 0,
  grandTotal: 0,
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
    grandTotal: orderAmount - (bill.discount ?? 0),
  };
};
