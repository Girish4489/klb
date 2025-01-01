'use client';
import GlassCard from '@components/GlassCard';
import constants from '@constants/constants';
import { CheckBadgeIcon, ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CSSProperties, JSX, useEffect, useState } from 'react';

export default function LoginSuccess(): JSX.Element {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown < 0) {
      router.replace(constants.DASHBOARD_PAGE);
    } else {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return (): void => clearTimeout(timer);
    }
  }, [countdown, router]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="hero min-h-screen">
        <div className="w-full max-w-md px-4">
          <GlassCard variant="accent" className="animate-slideUp">
            <div className="card-body items-center text-center">
              <div className="animate-bounce">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping">
                    <CheckBadgeIcon className="text-success h-16 w-16 opacity-40" />
                  </div>
                  <CheckBadgeIcon className="text-success relative h-16 w-16" />
                </div>
              </div>
              <h1 className="bg-linear-to-r from-primary via-accent to-secondary mt-8 bg-clip-text font-bold text-4xl text-transparent md:text-5xl">
                Login Successfully!
              </h1>
              <div className="mt-8 flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-3">
                  <h2 className="text-pretty text-2xl font-semibold">
                    Redirecting to Dashboard in{' '}
                    <span className="countdown text-accent font-mono">
                      <span style={{ '--value': countdown } as CSSProperties}></span>
                    </span>{' '}
                    seconds...
                  </h2>
                  <span className="loading loading-dots loading-lg text-accent"></span>
                </div>
                <Link
                  href={constants.DASHBOARD_PAGE}
                  prefetch={true}
                  className="btn btn-primary btn-lg w-full animate-pulse transition-all duration-300 hover:scale-105 hover:animate-none"
                >
                  <HomeIcon className="h-6 w-6" />
                  Go to Dashboard
                  <ChevronRightIcon className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
