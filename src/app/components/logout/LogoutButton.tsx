'use client';
import constants from '@constants/constants';
import { useCompany } from '@context/companyContext';
import { useAuth } from '@context/userContext';
import { logoutUtils } from '@utils/auth/logoutUtils';
import { useRouter } from 'next/navigation';
import { ComponentPropsWithoutRef } from 'react';

interface LogoutButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'default' | 'error' | 'ghost' | 'link';
  children?: React.ReactNode;
}

export default function LogoutButton({
  variant = 'default',
  children = 'Logout',
  className = '',
  ...props
}: LogoutButtonProps) {
  const router = useRouter();
  const { setAuthenticated } = useAuth();
  const { setCompany } = useCompany();

  const handleLogout = () => {
    logoutUtils.logout({
      onLogoutSuccess: () => {
        setAuthenticated(false);
        setCompany(undefined);
        router.replace(constants.LANDING_PUBLIC_LOGOUT_PAGE);
      },
    });
  };

  const variantClasses = {
    default: 'btn',
    error: 'btn btn-error',
    ghost: 'btn btn-ghost',
    link: 'link link-hover',
  };

  return (
    <button onClick={handleLogout} className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
