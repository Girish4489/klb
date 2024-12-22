import apiConstants from '@constants/api-constants';
import constants from '@constants/constants';
import { token as tokenUtil } from '@utils/token/token';
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

// Path configurations
const paths = {
  public: {
    static: ['/_next/', '/favicon.ico', '/public/', '/icons/', '/images/'],
    pages: ['/', '/not-found'],
    auth: [
      constants.AUTH_LOGIN_PAGE,
      constants.AUTH_SIGNUP_PAGE,
      constants.AUTH_RESET_PASSWORD_PAGE,
      constants.AUTH_VERIFY_EMAIL_PAGE,
    ],
    landing: [constants.LANDING_PUBLIC_HOME_PAGE, constants.LANDING_PUBLIC_PAGE, constants.LANDING_PUBLIC_LOGOUT_PAGE],
    api: [
      apiConstants.AUTH_LOGIN_API,
      apiConstants.AUTH_SIGNUP_API,
      apiConstants.AUTH_VERIFY_API,
      apiConstants.AUTH_FORGOT_PASSWORD_API,
      apiConstants.AUTH_LOGOUT_API,
      apiConstants.AUTH_CLEAR_COOKIE_API,
    ],
  },
  protected: {
    landing: [constants.LANDING_LOGIN_SUCCESS_PAGE, constants.LANDING_USER_PAGE],
    dashboard: [constants.DASHBOARD_PAGE],
    printPreview: ['/print-preview'],
    api: ['/api/user/', '/api/dashboard/'],
  },
};

export async function middleware(request: NextRequest): Promise<NextResponse | void> {
  const path = request.nextUrl.pathname;
  const authToken = request.cookies.get('authToken')?.value;

  // 1. Static files bypass
  if (paths.public.static.some((prefix) => path.startsWith(prefix))) {
    return NextResponse.next();
  }

  // 2. Check auth token validity
  const isValidToken = authToken ? await tokenUtil.verify(authToken) : null;

  // 3. Path type checks
  const isPublicPage = paths.public.pages.includes(path);
  const isAuthPage = paths.public.auth.some((prefix) => path.startsWith(prefix));
  const isPublicLanding = paths.public.landing.some((prefix) => path.startsWith(prefix));
  const isProtectedLanding = paths.protected.landing.some((prefix) => path.startsWith(prefix));
  const isPublicApi = paths.public.api.some((prefix) => path.startsWith(prefix));
  const isDashboard = paths.protected.dashboard.some((prefix) => path.startsWith(prefix));
  const isPrintPreview = paths.protected.printPreview.some((prefix) => path.startsWith(prefix));
  const isProtectedApi = paths.protected.api.some((prefix) => path.startsWith(prefix));

  // 4. Enhanced routing logic
  // 4.1 Root path handling
  if (path === '/') {
    return isValidToken
      ? NextResponse.redirect(new URL(constants.DASHBOARD_PAGE, request.nextUrl))
      : NextResponse.redirect(new URL(constants.LANDING_PUBLIC_HOME_PAGE, request.nextUrl));
  }

  // 4.2 Public routes - no auth needed
  if (isPublicPage || isPublicLanding || isPublicApi) {
    return NextResponse.next();
  }

  // 4.3 Auth pages - redirect to dashboard if already authenticated
  if (isAuthPage) {
    return isValidToken
      ? NextResponse.redirect(new URL(constants.DASHBOARD_PAGE, request.nextUrl))
      : NextResponse.next();
  }

  // 4.4 Protected routes - require authentication
  if (isDashboard || isProtectedLanding || isPrintPreview || isProtectedApi) {
    if (!isValidToken) {
      if (path.startsWith('/api/')) {
        return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
      }

      // Store intended URL for post-login redirect
      const redirectUrl = new URL(constants.AUTH_LOGIN_PAGE, request.nextUrl);
      redirectUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(redirectUrl);
    }

    // Handle API requests
    if (path.startsWith('/api/')) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', isValidToken.id);
      requestHeaders.set('x-user-role', isValidToken.companyAccess?.role || 'guest');
      return NextResponse.next({ request: { headers: requestHeaders } });
    }
  }

  return NextResponse.next();
}
