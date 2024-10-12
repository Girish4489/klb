// /src/app/util/makeApiRequest/makeApiRequest.ts
import { IBill, IReceipt, ITax } from '@/models/klm';
import axios from 'axios';
import handleError from '../error/handleError';

export const ApiPost = {
  Category: async (type: string, data: Record<string, string>) => {
    try {
      const res = await axios.post('/api/dashboard/master-record/category', { type, ...data });
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Tax: async (data: ITax) => {
    try {
      const res = await axios.post('/api/dashboard/master-record/tax', data);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Bill: async (data: IBill) => {
    try {
      const res = await axios.post('/api/dashboard/work-manage/bill', data);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Receipt: {
    SaveReceipt: async (data: IReceipt) => {
      try {
        const res = await axios.post('/api/dashboard/transaction/receipt', data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
  },
};

export const ApiGet = {
  Category: async () => {
    try {
      const res = await axios.get(`/api/dashboard/master-record/category/`);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Tax: async () => {
    try {
      const res = await axios.get(`/api/dashboard/master-record/tax/`);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Bill: {
    BillSearch: async (number: number, type: string) => {
      try {
        const res = await axios.get(`/api/dashboard/work-manage/bill?searchValue=${number}&type=${type}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    LastBill: async () => {
      try {
        const res = await axios.get(`/api/dashboard/work-manage/bill?last=bill`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    BillToday: async () => {
      try {
        const res = await axios.get(`/api/dashboard/work-manage/bill?today=bill&week=bill`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    BillWeekBill: async () => {
      try {
        const res = await axios.get(`/api/dashboard/work-manage/bill`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    BillFromToDate: async (fromDate: Date, toDate: Date, page: number) => {
      try {
        const res = await axios.get(
          `/api/dashboard/report/bill-details?fromDate=${fromDate}&toDate=${toDate}&page=${page}`,
        );
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
  },
  Receipt: {
    ReceiptSearch: async (number: number, type: string) => {
      try {
        const res = await axios.get(`/api/dashboard/transaction/receipt?searchValue=${number}&searchType=${type}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    LastReceipt: async () => {
      try {
        const res = await axios.get('/api/dashboard/transaction/receipt?last=receipt');
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    RecentReceipt: async () => {
      try {
        const res = await axios.get('/api/dashboard/transaction/receipt?recent=receipt');
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    ReceiptFromToDate: async (fromDate: Date, toDate: Date, page: number) => {
      try {
        const res = await axios.get(`/api/dashboard/report/receipt?fromDate=${fromDate}&toDate=${toDate}&page=${page}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
  },
  printDocument: {
    PrintBill: async (printType: string, billNumber: number) => {
      try {
        const res = await axios.get(
          `/api/dashboard/print-document/print-bill?printType=${printType}&billNumber=${billNumber}`,
        );
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    PrintReceipt: async (printType: string, receiptNumber: number) => {
      try {
        const res = await axios.get(
          `/api/dashboard/print-document/print-receipt?printType=${printType}&receiptNumber=${receiptNumber}`,
        );
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
  },
};

export const ApiPut = {
  Tax: async (
    id: string,
    data: {
      taxName: string;
      taxType: string;
      taxPercentage: number;
      updatedAt: Date;
    },
  ) => {
    try {
      const res = await axios.put(`/api/dashboard/master-record/tax?updateTId=${id}`, data);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Bill: async (id: string, data: IBill) => {
    try {
      const res = await axios.put(`/api/dashboard/work-manage/bill?updateBillId=${id}`, data);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
};

export const ApiDelete = {
  Tax: async (id: string) => {
    try {
      const res = await axios.delete(`/api/dashboard/master-record/tax?deleteTId=${id}`);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Bill: async (id: string) => {
    try {
      const res = await axios.delete(`/api/dashboard/work-manage/bill?deleteBillId=${id}`);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
};
