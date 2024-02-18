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
};
