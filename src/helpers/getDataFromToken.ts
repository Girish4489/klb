import handleError from '@/app/util/error/handleError';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get('token')?.value || '';
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as { id: string };
    return decodedToken.id;
  } catch (error) {
    handleError.throw(error);
  }
};
