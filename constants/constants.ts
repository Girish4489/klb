const constants = {
  // File constraints
  MAX_COMPANY_LOGO_FILE_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  LOGO_SIZES: ['small', 'medium', 'large'] as const,

  // Auth pages
  AUTH_SIGNUP_PAGE: '/auth/signup',
  AUTH_LOGIN_PAGE: '/auth/login',
  AUTH_RESET_PASSWORD_PAGE: '/auth/reset-password',
  AUTH_VERIFY_EMAIL_PAGE: '/auth/verify-email',

  // Landing pages
  LANDING_LOGIN_SUCCESS_PAGE: '/landing/login-success',
  LANDING_PUBLIC_HOME_PAGE: '/landing/public/home',
  LANDING_PUBLIC_LOGOUT_PAGE: '/landing/public/logout-success',
  LANDING_PUBLIC_PAGE: '/landing/public',
  LANDING_USER_PAGE: '/landing/user',

  // Dashboard pages
  DASHBOARD_PAGE: '/dashboard',
} as const;

export default constants;
