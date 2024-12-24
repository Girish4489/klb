import { IBillDetails } from '@/app/dashboard/report/bill-details/types';
import { ICustomer, IReceipt } from '@models/klm';
import { ApiGet, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import axios from 'axios';

interface BillResponse extends ApiResponse {
  bill: IBillDetails[];
}

interface ReceiptResponse extends ApiResponse {
  receipt: IReceipt[];
}

export const fetchAllData = {
  bills: async (fromDate: Date, toDate: Date): Promise<IBillDetails[]> => {
    const bills: IBillDetails[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await ApiGet.Bill.BillFromToDate<BillResponse>(fromDate, toDate, page);
      if (!response || !response.success) {
        hasMore = false;
        continue;
      }
      if (!response.bill || response.bill.length === 0) {
        hasMore = false;
      } else {
        bills.push(...response.bill);
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
      const response = await ApiGet.Receipt.ReceiptFromToDate<ReceiptResponse>(fromDate, toDate, page);
      if (!response || !response.success) {
        hasMore = false;
        continue;
      }
      if (!response.receipt || response.receipt.length === 0) {
        hasMore = false;
      } else {
        receipts.push(...response.receipt);
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
