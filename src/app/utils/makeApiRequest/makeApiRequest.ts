// /src/app/util/makeApiRequest/makeApiRequest.ts
import { default as apiPath } from '@/app/constants/api-constants';
import { ICompany } from '@models/companyModel';
import { IBill, IReceipt, ITax } from '@models/klm';
import { IUser, RoleType } from '@models/userModel';
import handleError from '@utils/error/handleError';
import axios from 'axios';

export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const ApiPost = {
  Category: async (type: string, data: Record<string, string>): Promise<ApiResponse | undefined> => {
    try {
      const res = await axios.post(apiPath.DASHBOARD_CATEGORY_API, { type, ...data });
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Tax: async (data: ITax): Promise<ApiResponse | undefined> => {
    try {
      const res = await axios.post(apiPath.DASHBOARD_TAX_API, data);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Bill: async (data: IBill): Promise<ApiResponse | undefined> => {
    try {
      const res = await axios.post(apiPath.DASHBOARD_BILL_API, data);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Company: {
    AddNewCompany: async (data: ICompany): Promise<ApiResponse | undefined> => {
      try {
        const res = await axios.post(apiPath.DASHBOARD_COMPANY_API, data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
  },
  Receipt: {
    SaveReceipt: async (data: IReceipt): Promise<ApiResponse | undefined> => {
      try {
        const res = await axios.post(apiPath.DASHBOARD_RECEIPT_API, data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
  },
  User: {
    updateFontPreferences: async (fonts: { name: string; weight: number }): Promise<ApiResponse | undefined> => {
      try {
        const res = await axios.post(apiPath.AUTH_FONTS_API, { fonts });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    updateAnimationPreferences: async (animations: {
      enabled: boolean;
      intensity: number;
    }): Promise<ApiResponse | undefined> => {
      try {
        const res = await axios.post(apiPath.AUTH_ANIMATIONS_API, { animations });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    updatePreferences: async <T extends ApiResponse>(
      preferences: Partial<IUser['preferences']>,
    ): Promise<T | undefined> => {
      try {
        const res = await axios.post(apiPath.AUTH_PREFERENCES_API, { preferences });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
  },
  Auth: {
    login: async <T extends ApiResponse>(data: { email: string; password: string }): Promise<T | undefined> => {
      try {
        const res = await axios.post(apiPath.AUTH_LOGIN_API, data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    signup: async <T extends ApiResponse>(data: {
      username: string;
      email: string;
      password: string;
    }): Promise<T | undefined> => {
      try {
        const res = await axios.post(apiPath.AUTH_SIGNUP_API, data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    resendEmail: async <T extends ApiResponse>(data: { email: string }): Promise<T | undefined> => {
      try {
        const res = await axios.post(apiPath.AUTH_RESEND_EMAIL_API, data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    forgotPassword: async <T extends ApiResponse>(data: { email: string }): Promise<T | undefined> => {
      try {
        const res = await axios.post(apiPath.AUTH_FORGOT_PASSWORD_API, data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    verifyEmail: async <T extends ApiResponse>(data: { token: string }): Promise<T | undefined> => {
      try {
        const res = await axios.post(apiPath.AUTH_VERIFY_EMAIL_API, data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    resetPassword: async <T extends ApiResponse>(data: { token: string; password: string }): Promise<T | undefined> => {
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
  Category: async (): Promise<ApiResponse | undefined> => {
    try {
      const res = await axios.get(apiPath.DASHBOARD_CATEGORY_API);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Tax: async (): Promise<ApiResponse | undefined> => {
    try {
      const res = await axios.get(`${apiPath.DASHBOARD_TAX_API}`);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Bill: {
    BillSearch: async (number: number, type: string): Promise<ApiResponse | undefined> => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_BILL_API}?searchValue=${number}&type=${type}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    LastBill: async (): Promise<ApiResponse | undefined> => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_BILL_API}?last=bill`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    BillToday: async (): Promise<ApiResponse | undefined> => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_BILL_API}?today=bill&week=bill`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    BillWeekBill: async (): Promise<ApiResponse | undefined> => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_BILL_API}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    BillFromToDate: async <T extends ApiResponse>(
      fromDate: Date,
      toDate: Date,
      page: number,
    ): Promise<T | undefined> => {
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
    ReceiptSearch: async (number: number, type: string): Promise<ApiResponse | undefined> => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_RECEIPT_API}?searchValue=${number}&searchType=${type}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    LastReceipt: async (): Promise<ApiResponse | undefined> => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_RECEIPT_API}?last=receipt`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    RecentReceipt: async (): Promise<ApiResponse | undefined> => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_RECEIPT_API}?recent=receipt`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    ReceiptFromToDate: async <T extends ApiResponse>(
      fromDate: Date,
      toDate: Date,
      page: number,
    ): Promise<T | undefined> => {
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
    getCompany: async (id: string): Promise<ApiResponse | undefined> => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_COMPANY_API}?companyId=${id}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    getCompanies: async (): Promise<ApiResponse | undefined> => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_COMPANY_API}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    // returns company access of all users in the company
    UsersByEmails: async (emails: string[]): Promise<ApiResponse | undefined> => {
      try {
        const res = await axios.post(apiPath.AUTH_COMPANY_USER_API, { emails });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
  },
  printDocument: {
    PrintBill: async (printType: string, billNumber: number): Promise<ApiResponse | undefined> => {
      try {
        const res = await axios.get(`${apiPath.PRINT_BILL_API}?printType=${printType}&billNumber=${billNumber}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    PrintReceipts: async (printType: string, billNumber: number): Promise<ApiResponse | undefined> => {
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
    updateUserRole: async (email: string, role: RoleType): Promise<ApiResponse | undefined> => {
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
    ): Promise<ApiResponse | undefined> => {
      try {
        const res = await axios.put(apiPath.AUTH_USER_EMAIL_API, { email, data: { companyAccess: { access } } });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    updateUserAccessLevels: async (email: string, accessLevels: RoleType[]): Promise<ApiResponse | undefined> => {
      try {
        const res = await axios.put(apiPath.AUTH_USER_EMAIL_API, { email, data: { companyAccess: { accessLevels } } });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    removeUserAccessLevel: async (email: string, removeAccessLevel: RoleType): Promise<ApiResponse | undefined> => {
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
    updateUserSecondaryEmails: async (email: string, secondaryEmails: string[]): Promise<ApiResponse | undefined> => {
      try {
        const res = await axios.put(apiPath.AUTH_USER_EMAIL_API, { email, data: { secondaryEmails } });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    updateUserMobile: async (email: string, mobile: string[]): Promise<ApiResponse | undefined> => {
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
  ): Promise<ApiResponse | undefined> => {
    try {
      const res = await axios.put(`${apiPath.DASHBOARD_TAX_API}?updateTId=${id}`, data);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Bill: async (id: string, data: IBill): Promise<ApiResponse | undefined> => {
    try {
      const res = await axios.put(`${apiPath.DASHBOARD_BILL_API}?updateBillId=${id}`, data);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  company: {
    updateCompany: async <T extends ApiResponse>(id: string, data: ICompany): Promise<T | undefined> => {
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
  Tax: async (id: string): Promise<ApiResponse | undefined> => {
    try {
      const res = await axios.delete(`${apiPath.DASHBOARD_TAX_API}?deleteTId=${id}`);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Bill: async (id: string): Promise<ApiResponse | undefined> => {
    try {
      const res = await axios.delete(`${apiPath.DASHBOARD_BILL_API}?deleteBillId=${id}`);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
};
