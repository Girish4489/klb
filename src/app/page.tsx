'use client';
import { useAuth } from '@context/userContext';
import { CheckBadgeIcon, ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid';
import { homeMetadata } from '@utils/metadata';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [countdown, setCountdown] = React.useState(5);

  useEffect(() => {
    // Only redirect if authenticated
    if (!isAuthenticated) {
      return;
    }

    if (countdown === 0) {
      window.location.href = '/dashboard';
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isAuthenticated]);

  return (
    <>
      <Head>
        <title>{homeMetadata.title as string}</title>
        <meta name="description" content={homeMetadata.description as string} />
      </Head>
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-base-100 to-base-300">
        <div className="hero min-h-screen">
          <div className="hero-content flex-col gap-8 rounded-box bg-base-100/50 p-8 shadow-2xl backdrop-blur-sm">
            <div className="text-success">
              <CheckBadgeIcon className="h-12 w-12" />
            </div>

            <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-center text-5xl font-bold text-transparent">
              Login Successfully!
            </h1>

            <div className="flex flex-col items-center gap-3">
              <h2 className="text-pretty text-2xl font-semibold">
                Redirecting to Dashboard in{' '}
                <span className="countdown font-mono text-accent">
                  <span style={{ '--value': countdown.toString() } as React.CSSProperties}></span>
                </span>{' '}
                seconds...
              </h2>
              <span className="loading loading-dots loading-lg bg-gradient-to-t from-secondary to-accent lg:w-16"></span>
            </div>

            <div>
              <Link href="/dashboard" prefetch={true} className="btn btn-primary btn-lg">
                <span className="flex flex-nowrap items-center gap-2">
                  <HomeIcon className="h-6 w-6" />
                  Go to Dashboard
                  <ChevronRightIcon className="h-6 w-6" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
