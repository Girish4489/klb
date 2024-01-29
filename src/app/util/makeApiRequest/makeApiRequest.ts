// /src/app/util/makeApiRequest/makeApiRequest.ts
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
};
