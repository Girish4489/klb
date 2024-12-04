import handleError from '@/app/util/error/handleError';
import { ApiGet } from '@/app/util/makeApiRequest/makeApiRequest';
import { setSearchParam } from '@/app/util/url/urlUtils';
import { IBill, ICategory, IColor, ITax } from '@/models/klm';

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
  ) =>
  async () => {
    try {
      const selectedBill = (searchBill ?? []).find((bill) => bill._id.toString() === billId);
      if (selectedBill) {
        setBill(selectedBill);
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
