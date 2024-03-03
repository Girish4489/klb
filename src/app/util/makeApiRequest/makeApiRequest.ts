// /src/app/util/makeApiRequest/makeApiRequest.ts
import { ITax } from '@/models/klm';
import axios from 'axios';

export const ApiPost = {
  Category: async (type: string, data: any) => {
    try {
      const res = await axios.post('/api/dashboard/master-record/category', { type, ...data });
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  },
  Tax: async (data: ITax) => {
    try {
      const res = await axios.post('/api/dashboard/master-record/tax', data);
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  },
  Bill: async (data: any) => {
    try {
      const res = await axios.post('/api/dashboard/work-manage/bill', data);
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  },
};

export const ApiGet = {
  Category: async () => {
    try {
      const res = await axios.get(`/api/dashboard/master-record/category/`);
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  },
  Tax: async () => {
    try {
      const res = await axios.get(`/api/dashboard/master-record/tax/`);
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  },
  Bill: {
    // Add a colon (:) after the object key "Bill"
    BillSearch: async (number: number, type: string) => {
      try {
        const res = await axios.get(`/api/dashboard/work-manage/bill?searchValue=${number}&type=${type}`);
        return res.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'An error occurred');
      }
    },
    LastBill: async () => {
      try {
        const res = await axios.get(`/api/dashboard/work-manage/bill?last=bill`);
        return res.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'An error occurred');
      }
    },
    BillToday: async () => {
      try {
        const res = await axios.get(`/api/dashboard/work-manage/bill?today=bill&week=bill`);
        return res.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'An error occurred');
      }
    },
    BillWeekBill: async () => {
      try {
        const res = await axios.get(`/api/dashboard/work-manage/bill`);
        return res.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'An error occurred');
      }
    },
    BillFromToDate: async (fromDate: Date, toDate: Date, page: number) => {
      try {
        const res = await axios.get(
          `/api/dashboard/report/bill-details?fromDate=${fromDate}&toDate=${toDate}&page=${page}`,
        );
        return res.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'An error occurred');
      }
    },
  },
};

export const ApiPut = {
  Tax: async (id: string, data: any) => {
    try {
      const res = await axios.put(`/api/dashboard/master-record/tax?updateTId=${id}`, data);
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  },
  Bill: async (id: string, data: any) => {
    try {
      const res = await axios.put(`/api/dashboard/work-manage/bill?updateBillId=${id}`, data);
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  },
};

export const ApiDelete = {
  Tax: async (id: string) => {
    try {
      const res = await axios.delete(`/api/dashboard/master-record/tax?deleteTId=${id}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  },
  Bill: async (id: string) => {
    try {
      const res = await axios.delete(`/api/dashboard/work-manage/bill?deleteBillId=${id}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  },
};
