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

async function createAuthToken(user: Partial<IUser>, expiresIn: string | number = '1d'): Promise<string> {
  if (!user._id) {
    console.error('Cannot create token: Missing user ID');
    throw new Error('Invalid user data');
  }

  const tokenData: UserTokenPayload = {
    id: user._id.toString(),
    username: user.username ?? '',
    email: user.email?.replace(/\.$/, '') ?? '',
    isVerified: user.isVerified ?? false,
    isAdmin: user.isAdmin ?? false,
    isCompanyMember: user.isCompanyMember ?? false,
    companyAccess: user.companyAccess,
    lastLogin: user.lastLogin ?? new Date(),
  };

  // Convert expiresIn to seconds if it's a string
  const expTime = typeof expiresIn === 'string' ? (expiresIn === '1d' ? 24 * 60 * 60 : parseInt(expiresIn)) : expiresIn;

  const jwt = await new SignJWT({ ...tokenData })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expTime)
    .sign(TOKEN_SECRET);

  return jwt;
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
