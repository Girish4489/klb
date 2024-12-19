import { IBillDetails } from '@/app/dashboard/report/bill-details/types';
import { ICustomer, IReceipt } from '@models/klm';
import { ApiGet } from '@utils/makeApiRequest/makeApiRequest';
import axios from 'axios';

export const fetchAllData = {
  bills: async (fromDate: Date, toDate: Date): Promise<IBillDetails[]> => {
    const bills: IBillDetails[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const data = await ApiGet.Bill.BillFromToDate(fromDate, toDate, page);
      if (data.bill.length === 0) {
        hasMore = false;
      } else {
        bills.push(...data.bill);
        page++;
      }
    }

    return bills;
  },

  receipts: async (fromDate: Date, toDate: Date): Promise<IReceipt[]> => {
    const receipts: IReceipt[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res = await ApiGet.Receipt.ReceiptFromToDate(fromDate, toDate, page);
      if (res.receipt.length === 0) {
        hasMore = false;
      } else {
        receipts.push(...res.receipt);
        page++;
      }
    }

    return receipts;
  },

  customers: async (): Promise<ICustomer[]> => {
    const customers: ICustomer[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res = await axios.post('/api/dashboard/report/customer-details', {
        type: 'getCustomers',
        page,
        itemsPerPage: 10,
      });

      if (!res.data.data.length || res.data.isLastCustomerLoaded) {
        hasMore = false;
      } else {
        customers.push(...res.data.data);
        page++;
      }
    }

    return customers;
  },
};
