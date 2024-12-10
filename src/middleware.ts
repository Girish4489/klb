import { token as tokenUtil } from '@util/token/token';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'experimental-edge', // Changed from 'edge' to 'experimental-edge'
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

const publicPaths = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/verify'];
const apiPublicPaths = ['/api/auth/login', '/api/auth/signup', '/api/auth/verify', '/api/auth/forgot-password'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = publicPaths.includes(path);
  const isPublicApi = apiPublicPaths.includes(path);
  const authToken = request.cookies.get('authToken')?.value;

  // Handle public paths
  if (isPublicPath || isPublicApi) {
    if (authToken) {
      return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }
    return NextResponse.next();
  }

  // Handle missing auth token
  if (!authToken) {
    if (path.startsWith('/api/')) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    // Store intended URL before redirect
    const intendedUrl = new URL('/auth/login', request.nextUrl);
    intendedUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(intendedUrl);
  }

  try {
    const tokenData = await tokenUtil.verify(authToken);
    if (!tokenData) throw new Error('Invalid token');

    // Add auth headers for API routes
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
