import { ICompany } from '@models/companyModel';
import handleError from '@utils/error/handleError';
import axios from 'axios';

export async function fetchCompanyData(userId: string, role: string): Promise<ICompany | undefined> {
  try {
    const {
      data: { data: companyData, success: success, message: message },
    } = await axios.get(`/api/auth/company?userId=${userId}&role=${role}`);
    if (!success) throw new Error(message || 'Failed to fetch company data');
    return companyData;
  } catch (error) {
    handleError.throw(error);
    return undefined;
  }
}
