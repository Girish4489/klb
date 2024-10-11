import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

interface TokenData {
  id: string;
  username?: string;
  email?: string;
  [key: string]: unknown;
}

interface DecodedToken extends TokenData {
  exp: number;
}

const TOKEN_SECRET = process.env.TOKEN_SECRET!;

/**
 * Creates a JSON Web Token (JWT) with the provided token data and expiration time.
 *
 * @param tokenData - The data to be encoded in the token.
 * @param expiresIn - The time duration after which the token will expire.
 *                     This can be a string (e.g., '1d' for one day, '5m' for 5 minutes) or a number (in seconds).
 *                     Supported units are:
 *                     - 's' for seconds
 *                     - 'm' for minutes
 *                     - 'h' for hours
 *                     - 'd' for days
 *                     - 'w' for weeks
 *                     - 'M' for months
 *                     - 'y' for years
 *                     Defaults to '1d'.
 * @returns A promise that resolves to the signed JWT as a string.
 */
async function createToken(tokenData: TokenData, expiresIn: string | number = '1d'): Promise<string> {
  let sanitizedTokenData = { ...tokenData };
  if (typeof sanitizedTokenData.email === 'string') {
    sanitizedTokenData.email = sanitizedTokenData.email.replace(/\.$/, '');
  }
  return jwt.sign(sanitizedTokenData, TOKEN_SECRET, { expiresIn });
}

/**
 * Verifies the provided JWT token using the TOKEN_SECRET.
 *
 * @param token - The JWT token to be verified.
 * @returns A promise that resolves to the decoded token if verification is successful, or null if the token is invalid.
 */
async function verifyToken(token: string): Promise<DecodedToken | null> {
  try {
    return jwt.verify(token, TOKEN_SECRET) as DecodedToken;
  } catch {
    return null; // If there's an error, assume the token is invalid
  }
}

/**
 * Checks if the provided token is expired.
 *
 * @param token - The JWT token to be checked.
 * @returns A promise that resolves to `true` if the token is expired, otherwise `false`.
 */
async function isTokenExpired(token: string): Promise<boolean> {
  const decoded = await verifyToken(token);
  if (!decoded) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

/**
 * Retrieves the expiry time of a given token.
 *
 * @param token - The token whose expiry time is to be retrieved.
 * @returns A promise that resolves to the expiry time of the token in seconds since the epoch, or 0 if the token is invalid.
 */
async function getTokenExpiry(token: string): Promise<number> {
  const decoded = await verifyToken(token);
  if (!decoded) return 0;

  return decoded.exp;
}

/**
 * Sets a JWT token as an HTTP-only cookie in the response.
 *
 * @param response - The NextResponse object.
 * @param token - The JWT token to be set as a cookie.
 * @param expiresIn - The expiration time of the cookie in seconds since the epoch.
 */
async function setTokenCookie(response: NextResponse, token: string, expiresIn: number): Promise<void> {
  response.cookies.set('token', token, {
    httpOnly: true,
    expires: new Date(expiresIn * 1000),
  });
}

/**
 * Retrieves the JWT token from the cookies in the request.
 *
 * @param request - The NextRequest object.
 * @returns The JWT token if found, otherwise null.
 */
function getTokenFromCookie(request: NextRequest): string | null {
  return request.cookies.get('token')?.value || null;
}

const token = {
  create: createToken,
  verify: verifyToken,
  isExpired: isTokenExpired,
  expiry: getTokenExpiry,
};

const cookie = {
  set: setTokenCookie,
  get: getTokenFromCookie,
};

export { cookie, token };
