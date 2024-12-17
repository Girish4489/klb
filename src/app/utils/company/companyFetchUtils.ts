import axios from 'axios';
import handleError from '../error/handleError';

export async function fetchCompanyData(userId: string, role: string) {
  try {
    const {
      data: { data: companyData, success: success, message: message },
    } = await axios.get(`/api/auth/company?userId=${userId}&role=${role}`);
    if (!success) throw new Error(message || 'Failed to fetch company data');
    return companyData;
  } catch (error) {
    handleError.throw(error);
  }
}
