// /src/app/util/makeApiRequest/makeApiRequest.ts
import { default as apiPath } from '@/app/constants/api-constants';
import { ICompany } from '@models/companyModel';
import { IBill, IReceipt, ITax } from '@models/klm';
import { IUser, RoleType } from '@models/userModel';
import handleError from '@utils/error/handleError';
import axios from 'axios';

export const ApiPost = {
  Category: async (type: string, data: Record<string, string>) => {
    try {
      const res = await axios.post(apiPath.DASHBOARD_CATEGORY_API, { type, ...data });
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Tax: async (data: ITax) => {
    try {
      const res = await axios.post(apiPath.DASHBOARD_TAX_API, data);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Bill: async (data: IBill) => {
    try {
      const res = await axios.post(apiPath.DASHBOARD_BILL_API, data);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Company: {
    AddNewCompany: async (data: ICompany) => {
      try {
        const res = await axios.post(apiPath.DASHBOARD_COMPANY_API, data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
  },
  Receipt: {
    SaveReceipt: async (data: IReceipt) => {
      try {
        const res = await axios.post(apiPath.DASHBOARD_RECEIPT_API, data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
  },
  User: {
    updateFontPreferences: async (fonts: { name: string; weight: number }) => {
      try {
        const res = await axios.post(apiPath.AUTH_FONTS_API, { fonts });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    updateAnimationPreferences: async (animations: { enabled: boolean; intensity: number }) => {
      try {
        const res = await axios.post(apiPath.AUTH_ANIMATIONS_API, { animations });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    updatePreferences: async (preferences: Partial<IUser['preferences']>) => {
      try {
        const res = await axios.post(apiPath.AUTH_PREFERENCES_API, { preferences });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
  },
  Auth: {
    login: async (data: { email: string; password: string }) => {
      try {
        const res = await axios.post(apiPath.AUTH_LOGIN_API, data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    signup: async (data: { username: string; email: string; password: string }) => {
      try {
        const res = await axios.post(apiPath.AUTH_SIGNUP_API, data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    resendEmail: async (data: { email: string }) => {
      try {
        const res = await axios.post(apiPath.AUTH_RESEND_EMAIL_API, data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    forgotPassword: async (data: { email: string }) => {
      try {
        const res = await axios.post(apiPath.AUTH_FORGOT_PASSWORD_API, data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    verifyEmail: async (data: { token: string }) => {
      try {
        const res = await axios.post(apiPath.AUTH_VERIFY_EMAIL_API, data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    resetPassword: async (data: { token: string; password: string }) => {
      try {
        const res = await axios.post(apiPath.AUTH_RESET_PASSWORD_API, data);
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
      const res = await axios.get(apiPath.DASHBOARD_CATEGORY_API);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Tax: async () => {
    try {
      const res = await axios.get(`${apiPath.DASHBOARD_TAX_API}`);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Bill: {
    BillSearch: async (number: number, type: string) => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_BILL_API}?searchValue=${number}&type=${type}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    LastBill: async () => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_BILL_API}?last=bill`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    BillToday: async () => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_BILL_API}?today=bill&week=bill`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    BillWeekBill: async () => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_BILL_API}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    BillFromToDate: async (fromDate: Date, toDate: Date, page: number) => {
      try {
        const res = await axios.get(
          `${apiPath.REPORT_BILL_DETAILS_API}?fromDate=${fromDate}&toDate=${toDate}&page=${page}`,
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
        const res = await axios.get(`${apiPath.DASHBOARD_RECEIPT_API}?searchValue=${number}&searchType=${type}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    LastReceipt: async () => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_RECEIPT_API}?last=receipt`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    RecentReceipt: async () => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_RECEIPT_API}?recent=receipt`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    ReceiptFromToDate: async (fromDate: Date, toDate: Date, page: number) => {
      try {
        const res = await axios.get(`${apiPath.REPORT_RECEIPT_API}?fromDate=${fromDate}&toDate=${toDate}&page=${page}`);
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
        const res = await axios.get(`${apiPath.DASHBOARD_COMPANY_API}?companyId=${id}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    getCompanies: async () => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_COMPANY_API}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    // returns company access of all users in the company
    UsersByEmails: async (emails: string[]) => {
      try {
        const res = await axios.post(apiPath.AUTH_COMPANY_USER_API, { emails });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
  },
  printDocument: {
    PrintBill: async (printType: string, billNumber: number) => {
      try {
        const res = await axios.get(`${apiPath.PRINT_BILL_API}?printType=${printType}&billNumber=${billNumber}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    PrintReceipts: async (printType: string, billNumber: number) => {
      try {
        const res = await axios.get(`${apiPath.PRINT_RECEIPT_API}?printType=${printType}&billNumber=${billNumber}`);
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
        const res = await axios.put(apiPath.AUTH_USER_EMAIL_API, { email, data: { companyAccess: { role } } });
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
        const res = await axios.put(apiPath.AUTH_USER_EMAIL_API, { email, data: { companyAccess: { access } } });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    updateUserAccessLevels: async (email: string, accessLevels: RoleType[]) => {
      try {
        const res = await axios.put(apiPath.AUTH_USER_EMAIL_API, { email, data: { companyAccess: { accessLevels } } });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    removeUserAccessLevel: async (email: string, removeAccessLevel: RoleType) => {
      try {
        const res = await axios.put(apiPath.AUTH_USER_EMAIL_API, {
          email,
          data: { companyAccess: { removeAccessLevel } },
        });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    updateUserSecondaryEmails: async (email: string, secondaryEmails: string[]) => {
      try {
        const res = await axios.put(apiPath.AUTH_USER_EMAIL_API, { email, data: { secondaryEmails } });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    updateUserMobile: async (email: string, mobile: string[]) => {
      try {
        const res = await axios.put(apiPath.AUTH_USER_EMAIL_API, { email, data: { mobile } });
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
      const res = await axios.put(`${apiPath.DASHBOARD_TAX_API}?updateTId=${id}`, data);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Bill: async (id: string, data: IBill) => {
    try {
      const res = await axios.put(`${apiPath.DASHBOARD_BILL_API}?updateBillId=${id}`, data);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  company: {
    updateCompany: async (id: string, data: ICompany) => {
      try {
        const res = await axios.put(`${apiPath.DASHBOARD_COMPANY_API}?updateCompanyId=${id}`, data);
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
      const res = await axios.delete(`${apiPath.DASHBOARD_TAX_API}?deleteTId=${id}`);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Bill: async (id: string) => {
    try {
      const res = await axios.delete(`${apiPath.DASHBOARD_BILL_API}?deleteBillId=${id}`);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
};
