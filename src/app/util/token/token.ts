import { IUser } from '@/models/userModel';
import { SignJWT, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

interface UserTokenPayload {
  id: string;
  username?: string;
  email?: string;
  companyAccess?: IUser['companyAccess'];
  [key: string]: unknown;
}

interface DecodedToken extends UserTokenPayload {
  exp: number;
}

// const TOKEN_SECRET = process.env.TOKEN_SECRET!;
const TOKEN_SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET!);

async function createAuthToken(tokenData: UserTokenPayload, expiresIn: string | number = '1d'): Promise<string> {
  let sanitizedTokenData = { ...tokenData };
  if (typeof sanitizedTokenData.email === 'string') {
    sanitizedTokenData.email = sanitizedTokenData.email.replace(/\.$/, '');
  }
  const jwt = await new SignJWT(sanitizedTokenData)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(TOKEN_SECRET);
  return jwt;
}

async function verifyAuthToken(token: string): Promise<DecodedToken | null> {
  try {
    const { payload } = await jwtVerify(token, TOKEN_SECRET);
    return payload as DecodedToken;
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
