const apiConstants = {
  // Auth API routes
  AUTH_LOGIN_API: '/api/auth/login',
  AUTH_SIGNUP_API: '/api/auth/signup',
  AUTH_VERIFY_API: '/api/auth/verify',
  AUTH_FORGOT_PASSWORD_API: '/api/auth/forgot-password',
  AUTH_LOGOUT_API: '/api/auth/logout',
  AUTH_CLEAR_COOKIE_API: '/api/auth/clear-cookie',
  AUTH_RESEND_EMAIL_API: '/api/auth/resend-email',
  AUTH_VERIFY_EMAIL_API: '/api/auth/verify-email',
  AUTH_RESET_PASSWORD_API: '/api/auth/reset-password',
  AUTH_FONTS_API: '/api/auth/fonts',
  AUTH_ANIMATIONS_API: '/api/auth/animations',
  AUTH_PREFERENCES_API: '/api/auth/preferences',
  AUTH_USER_EMAIL_API: '/api/auth/user/email',
  AUTH_COMPANY_USER_API: '/api/auth/company/user',

  // Dashboard API routes
  DASHBOARD_API: '/api/dashboard',
  DASHBOARD_CATEGORY_API: '/api/dashboard/master-record/category',
  DASHBOARD_TAX_API: '/api/dashboard/master-record/tax',
  DASHBOARD_BILL_API: '/api/dashboard/work-manage/bill',
  DASHBOARD_COMPANY_API: '/api/dashboard/staff-manage/company',
  DASHBOARD_RECEIPT_API: '/api/dashboard/transaction/receipt',

  // Report API routes
  REPORT_BILL_DETAILS_API: '/api/dashboard/report/bill-details',
  REPORT_RECEIPT_API: '/api/dashboard/report/receipt',

  // Print API routes
  PRINT_BILL_API: '/api/print-document/print-bill',
  PRINT_RECEIPT_API: '/api/print-document/print-receipt',
} as const;

export default apiConstants;
