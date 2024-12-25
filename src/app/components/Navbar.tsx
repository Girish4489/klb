'use client';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { useTheme } from '@/app/context/ThemeContext';
import ScrollProgress from '@components/ScrollProgress';
import constants from '@constants/constants';
import { IdentificationIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JSX, useEffect } from 'react';

function NavbarContent(): JSX.Element {
  return (
    <div className="navbar bg-linear-to-t from-base-100/80 to-base-300/65 backdrop-blur-xs fixed top-0 z-50 py-0.5">
      <div className="navbar-start">
        <Link href={constants.LANDING_PUBLIC_HOME_PAGE} className="btn btn-ghost btn-sm text-lg">
          Kalamandir
        </Link>
      </div>
      <div className="navbar-end gap-2">
        <ThemeToggle />
        <Link href={constants.AUTH_LOGIN_PAGE} className="btn btn-outline btn-secondary btn-sm">
          <ShieldCheckIcon className="h-5 w-5" />
          Login
        </Link>
        <Link href={constants.AUTH_SIGNUP_PAGE} className="btn btn-outline btn-primary btn-sm">
          <IdentificationIcon className="h-5 w-5" />
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export function NavbarWithProgress(): JSX.Element {
  const router = useRouter();
  const { listenToSystemTheme } = useTheme();

  useEffect(() => {
    listenToSystemTheme();
  }, [listenToSystemTheme, router]);

  return (
    <>
      <ScrollProgress />
      <NavbarContent />
    </>
  );
}

export function Navbar(): JSX.Element {
  const router = useRouter();
  const { listenToSystemTheme } = useTheme();

  useEffect(() => {
    listenToSystemTheme();
  }, [listenToSystemTheme, router]);

  return <NavbarContent />;
}
