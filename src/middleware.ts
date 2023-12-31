import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === '/auth/login' ||
    path === '/auth/signup' ||
    path === '/auth/verifyemail' ||
    path === '/auth/resetpassword' ||
    path === '/auth/resetpassword/[token]' ||
    path === '/auth/verifyemail/[token]';

  const token = request.cookies.get('token')?.value || '';

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (!isPublicPath && !token) {
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
