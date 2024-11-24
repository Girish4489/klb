import { token as tokenUtil } from '@/app/util/token/token';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === '/auth/login' ||
    path === '/auth/signup' ||
    path === '/auth/verifyemail' ||
    path === '/auth/resetpassword' ||
    path === '/auth/resetpassword/[token]' ||
    path === '/auth/verifyemail/[token]';

  const authToken = request.cookies.get('authToken')?.value || '';
  const tokenData = await tokenUtil.verify(authToken);

  if (tokenData) {
    const { companyAccess } = tokenData;
    if (!companyAccess?.access.login) {
      return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
    }
  }

  if (tokenData) {
    const { loginAccess } = tokenData;
    if (!loginAccess) {
      return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
    }
  }

  if (isPublicPath && authToken) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (!isPublicPath && !authToken) {
    return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/auth/profile',
    '/auth/login',
    '/auth/signup',
    '/auth/verifyemail/:path*',
    '/auth/profile/:path*',
    '/auth/resetpassword/:path*',
    '/dashboard',
    '/dashboard/:path*',
  ],
};
