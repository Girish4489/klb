import { token as tokenUtil } from '@util/token/token';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|icons|images).*)',
  ],
};

const publicPaths = ['/auth/login', '/auth/signup', '/auth/reset-password', '/auth/verify-email', '/not-found'];
const apiPublicPaths = ['/api/auth/login', '/api/auth/signup', '/api/auth/verify', '/api/auth/forgot-password'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const authToken = request.cookies.get('authToken')?.value;

  // Allow public paths and API routes
  if (path === '/api/auth/user' || path === '/not-found' || path === '/') {
    return NextResponse.next();
  }

  const isPublicPath = publicPaths.includes(path);
  const isPublicApi = apiPublicPaths.includes(path);

  // Handle public paths
  if (isPublicPath || isPublicApi) {
    if (authToken) {
      return NextResponse.redirect(new URL('/', request.nextUrl));
    }
    return NextResponse.next();
  }

  // Handle missing auth token
  if (!authToken) {
    if (path.startsWith('/api/')) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
  }

  // Verify token and handle protected routes
  try {
    const tokenData = await tokenUtil.verify(authToken);
    if (!tokenData) throw new Error('Invalid token');

    if (path.startsWith('/api/')) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', tokenData.id);
      requestHeaders.set('x-user-role', tokenData.companyAccess?.role || 'guest');
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware authentication error:', error);
    const response = NextResponse.redirect(new URL('/auth/login', request.nextUrl));
    response.cookies.delete('authToken');
    return response;
  }
}
