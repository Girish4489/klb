import handleError from '@/app/util/error/handleError';
import { cookie, token } from '@/app/util/token/token';
import { NextRequest } from 'next/server';

export const getDataFromToken = async (request: NextRequest) => {
  try {
    const tokenValue = cookie.get(request);
    if (!tokenValue) {
      throw new Error('No token found');
    }
    const decodedToken = await token.verify(tokenValue);
    if (!decodedToken) {
      throw new Error('Invalid token');
    }
    return decodedToken.id;
  } catch (error) {
    handleError.throw(error);
  }
};
