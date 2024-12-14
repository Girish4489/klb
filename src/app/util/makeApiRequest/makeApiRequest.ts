// /src/app/util/makeApiRequest/makeApiRequest.ts
import { ICompany } from '@models/companyModel';
import { IBill, IReceipt, ITax } from '@models/klm';
import { IUser, RoleType } from '@models/userModel';
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
  Company: {
    AddNewCompany: async (data: ICompany) => {
      try {
        const res = await axios.post('/api/dashboard/staff-manage/company', data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
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
  User: {
    updateFontPreferences: async (fonts: { name: string; weight: number }) => {
      try {
        const res = await axios.post('/api/auth/fonts', { fonts });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    updateAnimationPreferences: async (animations: { enabled: boolean; intensity: number }) => {
      try {
        const res = await axios.post('/api/auth/animations', { animations });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    updatePreferences: async (preferences: Partial<IUser['preferences']>) => {
      try {
        const res = await axios.post('/api/auth/preferences', { preferences });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
  },
  Auth: {
    login: async (data: { email: string; password: string }) => {
      try {
        const res = await axios.post('/api/auth/login', data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    signup: async (data: { username: string; email: string; password: string }) => {
      try {
        const res = await axios.post('/api/auth/signup', data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    resendEmail: async (data: { email: string }) => {
      try {
        const res = await axios.post('/api/auth/resend-email', data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    forgotPassword: async (data: { email: string }) => {
      try {
        const res = await axios.post('/api/auth/forgot-password', data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    verifyEmail: async (data: { token: string }) => {
      try {
        const res = await axios.post('/api/auth/verify-email', data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    resetPassword: async (data: { token: string; password: string }) => {
      try {
        const res = await axios.post('/api/auth/reset-password', data);
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
  User: {},
  Company: {
    getCompany: async (id: string) => {
      try {
        const res = await axios.get(`/api/dashboard/staff-manage/company?companyId=${id}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    getCompanies: async () => {
      try {
        const res = await axios.get(`/api/dashboard/staff-manage/company`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    // returns company access of all users in the company
    UsersByEmails: async (emails: string[]) => {
      try {
        const res = await axios.post('/api/auth/company/user', { emails });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
  },
  printDocument: {
    PrintBill: async (printType: string, billNumber: number) => {
      try {
        const res = await axios.get(`/api/print-document/print-bill?printType=${printType}&billNumber=${billNumber}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    PrintReceipts: async (printType: string, billNumber: number) => {
      try {
        const res = await axios.get(
          `/api/print-document/print-receipt?printType=${printType}&billNumber=${billNumber}`,
        );
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
  },
};

export const ApiPut = {
  User: {
    updateUserRole: async (email: string, role: RoleType) => {
      try {
        const res = await axios.put(`/api/auth/user/email`, { email, data: { companyAccess: { role } } });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    updateUserAccess: async (
      email: string,
      access: { login: boolean; canEdit: boolean; canDelete: boolean; canView: boolean },
    ) => {
      try {
        const res = await axios.put(`/api/auth/user/email`, { email, data: { companyAccess: { access } } });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    updateUserAccessLevels: async (email: string, accessLevels: RoleType[]) => {
      try {
        const res = await axios.put(`/api/auth/user/email`, { email, data: { companyAccess: { accessLevels } } });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    removeUserAccessLevel: async (email: string, removeAccessLevel: RoleType) => {
      try {
        const res = await axios.put(`/api/auth/user/email`, { email, data: { companyAccess: { removeAccessLevel } } });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    updateUserSecondaryEmails: async (email: string, secondaryEmails: string[]) => {
      try {
        const res = await axios.put(`/api/auth/user/email`, { email, data: { secondaryEmails } });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    updateUserMobile: async (email: string, mobile: string[]) => {
      try {
        const res = await axios.put(`/api/auth/user/email`, { email, data: { mobile } });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
  },
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
  company: {
    updateCompany: async (id: string, data: ICompany) => {
      try {
        const res = await axios.put(`/api/dashboard/staff-manage/company?updateCompanyId=${id}`, data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
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
