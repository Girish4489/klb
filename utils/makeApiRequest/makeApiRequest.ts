// /src/app/util/makeApiRequest/makeApiRequest.ts
import { default as apiPath } from '@constants/api-constants';
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
  Category: async <T extends ApiResponse>(type: string, data: Record<string, string>): Promise<T | undefined> => {
    try {
      const res = await axios.post(apiPath.DASHBOARD_CATEGORY_API, { type, ...data });
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Tax: async <T extends ApiResponse>(data: ITax): Promise<T | undefined> => {
    try {
      const res = await axios.post(apiPath.DASHBOARD_TAX_API, data);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Bill: async <T extends ApiResponse>(data: IBill): Promise<T | undefined> => {
    try {
      const res = await axios.post(apiPath.DASHBOARD_BILL_API, data);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Company: {
    AddNewCompany: async <T extends ApiResponse>(data: ICompany): Promise<T | undefined> => {
      try {
        const res = await axios.post(apiPath.DASHBOARD_COMPANY_API, data);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
  },
  Receipt: {
    SaveReceipt: async <T extends ApiResponse>(data: IReceipt): Promise<T | undefined> => {
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
  Category: async <T extends ApiResponse>(): Promise<T | undefined> => {
    try {
      const res = await axios.get(apiPath.DASHBOARD_CATEGORY_API);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Tax: async <T extends ApiResponse>(): Promise<T | undefined> => {
    try {
      const res = await axios.get(`${apiPath.DASHBOARD_TAX_API}`);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Bill: {
    BillSearch: async <T extends ApiResponse>(number: number, type: string): Promise<T | undefined> => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_BILL_API}?searchValue=${number}&type=${type}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    LastBill: async <T extends ApiResponse>(): Promise<T | undefined> => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_BILL_API}?last=bill`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    BillToday: async <T extends ApiResponse>(): Promise<T | undefined> => {
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
    ReceiptSearch: async <T extends ApiResponse>(number: number, type: string): Promise<T | undefined> => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_RECEIPT_API}?searchValue=${number}&searchType=${type}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    LastReceipt: async <T extends ApiResponse>(): Promise<T | undefined> => {
      try {
        const res = await axios.get(`${apiPath.DASHBOARD_RECEIPT_API}?last=receipt`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    RecentReceipt: async <T extends ApiResponse>(): Promise<T | undefined> => {
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
    UsersByEmails: async <T extends ApiResponse>(emails: string[]): Promise<T | undefined> => {
      try {
        const res = await axios.post(apiPath.AUTH_COMPANY_USER_API, { emails });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
  },
  printDocument: {
    PrintBill: async <T extends ApiResponse>(printType: string, billNumber: number): Promise<T | undefined> => {
      try {
        const res = await axios.get(`${apiPath.PRINT_BILL_API}?printType=${printType}&billNumber=${billNumber}`);
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    PrintReceipts: async <T extends ApiResponse>(printType: string, billNumber: number): Promise<T | undefined> => {
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
    updateUserRole: async <T extends ApiResponse>(email: string, role: RoleType): Promise<T | undefined> => {
      try {
        const res = await axios.put(apiPath.AUTH_USER_EMAIL_API, { email, data: { companyAccess: { role } } });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    updateUserAccess: async <T extends ApiResponse>(
      email: string,
      access: { login: boolean; canEdit: boolean; canDelete: boolean; canView: boolean },
    ): Promise<T | undefined> => {
      try {
        const res = await axios.put(apiPath.AUTH_USER_EMAIL_API, { email, data: { companyAccess: { access } } });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    updateUserAccessLevels: async <T extends ApiResponse>(
      email: string,
      accessLevels: RoleType[],
    ): Promise<T | undefined> => {
      try {
        const res = await axios.put(apiPath.AUTH_USER_EMAIL_API, { email, data: { companyAccess: { accessLevels } } });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    removeUserAccessLevel: async <T extends ApiResponse>(
      email: string,
      removeAccessLevel: RoleType,
    ): Promise<T | undefined> => {
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
    updateUserSecondaryEmails: async <T extends ApiResponse>(
      email: string,
      secondaryEmails: string[],
    ): Promise<T | undefined> => {
      try {
        const res = await axios.put(apiPath.AUTH_USER_EMAIL_API, { email, data: { secondaryEmails } });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
    updateUserMobile: async <T extends ApiResponse>(email: string, mobile: string[]): Promise<T | undefined> => {
      try {
        const res = await axios.put(apiPath.AUTH_USER_EMAIL_API, { email, data: { mobile } });
        return res.data;
      } catch (error) {
        handleError.throw(error);
      }
    },
  },
  Tax: async <T extends ApiResponse>(id: string, data: Partial<ITax>): Promise<T | undefined> => {
    try {
      const res = await axios.put(`${apiPath.DASHBOARD_TAX_API}?updateTId=${id}`, data);
      return res.data;
    } catch (error) {
      handleError.throw(error);
    }
  },
  Bill: async <T extends ApiResponse>(id: string, data: IBill): Promise<T | undefined> => {
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
  Tax: async <T extends ApiResponse>(id: string): Promise<T | undefined> => {
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
