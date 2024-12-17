'use client';
import GlassCard from '@components/GlassCard';
import constants from '@constants/constants';
import { HomeIcon, IdentificationIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function LogoutSuccess() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="hero min-h-screen">
        <div className="w-full max-w-md px-4">
          <GlassCard variant="accent" className="animate-slideUp">
            <div className="card-body items-center text-center">
              <div className="animate-bounce">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping">
                    <ShieldCheckIcon className="h-16 w-16 text-success opacity-40" />
                  </div>
                  <ShieldCheckIcon className="relative h-16 w-16 text-success" />
                </div>
              </div>
              <h1 className="mt-8 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                Logged Out Successfully!
              </h1>
              <div className="mt-8 flex w-full flex-col gap-4">
                <Link
                  href={constants.LANDING_PUBLIC_HOME_PAGE}
                  className="btn btn-lg w-full animate-pulse bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-300 hover:scale-105 hover:animate-none"
                >
                  <HomeIcon className="h-6 w-6" />
                  Go to Home
                </Link>
                <Link
                  href={constants.AUTH_LOGIN_PAGE}
                  className="btn btn-lg w-full bg-gradient-to-r from-secondary to-accent transition-transform hover:scale-105"
                >
                  <ShieldCheckIcon className="h-6 w-6" />
                  Login Again
                </Link>
                <Link
                  href={constants.AUTH_SIGNUP_PAGE}
                  className="btn btn-lg w-full bg-gradient-to-r from-accent to-primary transition-transform hover:scale-105"
                >
                  <IdentificationIcon className="h-6 w-6" />
                  Sign Up
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
