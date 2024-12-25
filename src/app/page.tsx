'use client';
import constants from '@constants/constants';
import { homeMetadata } from '@utils/metadata';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JSX, useEffect } from 'react';

export default function Home(): JSX.Element {
  const router = useRouter();
  useEffect(() => {
    router.push(constants.LANDING_PUBLIC_HOME_PAGE);
  }, []);

  return (
    <>
      <Head>
        <title>{homeMetadata.title as string}</title>
        <meta name="description" content={homeMetadata.description as string} />
      </Head>
      <main className="bg-linear-to-br from-base-100 to-base-300 relative min-h-screen overflow-hidden">
        <div className="hero min-h-screen">
          <div className="hero-content rounded-box bg-base-100/50 backdrop-blur-xs flex-col gap-8 p-8 shadow-2xl">
            <h1 className="text-center text-5xl font-bold">Welcome to Kalamandir!</h1>
            <p className="text-center text-2xl">Your platform for Fashion and Lifestyle products Management.</p>
            <Link href={constants.AUTH_LOGIN_PAGE} className="btn btn-primary btn-lg">
              Login
            </Link>
            <Link href={constants.AUTH_SIGNUP_PAGE} className="btn btn-primary btn-lg">
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
