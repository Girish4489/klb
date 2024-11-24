import { IUser } from '@/models/userModel';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

interface TokenData {
  id: string;
  username?: string;
  email?: string;
  companyAccess?: IUser['companyAccess'];
  [key: string]: unknown;
}

interface DecodedToken extends TokenData {
  exp: number;
}

const TOKEN_SECRET = process.env.TOKEN_SECRET!;

async function createAuthToken(tokenData: TokenData, expiresIn: string | number = '1d'): Promise<string> {
  let sanitizedTokenData = { ...tokenData };
  if (typeof sanitizedTokenData.email === 'string') {
    sanitizedTokenData.email = sanitizedTokenData.email.replace(/\.$/, '');
  }
  return jwt.sign(sanitizedTokenData, TOKEN_SECRET, { expiresIn });
}

async function verifyAuthToken(token: string): Promise<DecodedToken | null> {
  try {
    return jwt.verify(token, TOKEN_SECRET) as DecodedToken;
  } catch {
    return null;
  }
}

async function isAuthTokenExpired(token: string): Promise<boolean> {
  const decoded = await verifyAuthToken(token);
  if (!decoded) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

async function getAuthTokenExpiry(token: string): Promise<number> {
  const decoded = await verifyAuthToken(token);
  if (!decoded) return 0;

  return decoded.exp;
}

async function setAuthTokenCookie(response: NextResponse, token: string, expiresIn: number): Promise<void> {
  response.cookies.set('authToken', token, {
    httpOnly: true,
    expires: new Date(expiresIn * 1000),
  });
}

function getAuthTokenFromCookie(request: NextRequest): string | null {
  return request.cookies.get('authToken')?.value || null;
}

const token = {
  create: createAuthToken,
  verify: verifyAuthToken,
  isExpired: isAuthTokenExpired,
  expiry: getAuthTokenExpiry,
};

const cookie = {
  set: setAuthTokenCookie,
  get: getAuthTokenFromCookie,
};

export { cookie, token };
