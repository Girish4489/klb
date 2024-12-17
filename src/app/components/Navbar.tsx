'use client';
import ScrollProgress from '@components/ScrollProgress';
import constants from '@constants/constants';
import { IdentificationIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function NavbarWithProgress() {
  return (
    <>
      <ScrollProgress />
      <div className="navbar fixed top-0 z-50 bg-gradient-to-t from-base-100/80 to-base-300/65 py-0.5 backdrop-blur-sm">
        <div className="navbar-start">
          <Link href={constants.LANDING_PUBLIC_HOME_PAGE} className="btn btn-ghost btn-sm text-lg">
            Kalamandir
          </Link>
        </div>
        <div className="navbar-end gap-2">
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
    </>
  );
}

export function Navbar() {
  return (
    <div className="navbar fixed top-0 z-50 bg-gradient-to-t from-base-100/80 to-base-300/65 py-0.5 backdrop-blur-sm">
      <div className="navbar-start">
        <Link href={constants.LANDING_PUBLIC_HOME_PAGE} className="btn btn-ghost btn-sm text-lg">
          Kalamandir
        </Link>
      </div>
      <div className="navbar-end gap-2">
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
