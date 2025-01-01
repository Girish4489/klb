import { IUser } from '@models/userModel';
import { SignJWT, jwtVerify } from 'jose'; // Using jose instead of jsonwebtoken
import { NextRequest, NextResponse } from 'next/server';

interface UserTokenPayload {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
  isCompanyMember: boolean;
  companyAccess?: IUser['companyAccess'];
  lastLogin: Date;
}

interface DecodedToken extends UserTokenPayload {
  exp: number;
}

const TOKEN_SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET!);

async function createAuthToken(data: UserTokenPayload, expiresIn: string = '30m'): Promise<string> {
  try {
    if (!data.id || !data.email) {
      throw new Error('Invalid token data: missing required fields');
    }

    // Convert time strings to seconds
    const timeMap: { [key: string]: number } = {
      '30m': 30 * 60,
      '1h': 60 * 60,
      '1d': 24 * 60 * 60,
    };

    const expTime = timeMap[expiresIn] || 30 * 60; // default to 30 minutes

    const jwt = await new SignJWT({ ...data })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + expTime)
      .sign(TOKEN_SECRET);

    return jwt;
  } catch (error) {
    console.error('Token creation error:', error);
    throw new Error('Failed to create token');
  }
}

async function verifyAuthToken(token: string): Promise<DecodedToken | null> {
  try {
    if (!token) {
      console.error('No token provided for verification');
      return null;
    }

    const { payload } = await jwtVerify(token, TOKEN_SECRET);
    if (!payload?.id) {
      console.error('Token verification failed: Missing ID in token');
      return null;
    }

    return payload as unknown as DecodedToken;
  } catch (error) {
    console.error('Token verification failed:', error);
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
