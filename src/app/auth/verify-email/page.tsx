'use client';
import handleError from '@utils/error/handleError';
import { ApiPost } from '@utils/makeApiRequest/makeApiRequest';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect } from 'react';
import { toast } from 'react-hot-toast';

function VerifyEmailPageWrapper() {
  const [token, setToken] = React.useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlToken = searchParams.get('token');
    setToken(urlToken || '');
  }, [searchParams]);

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        const verifyUser = async () => {
          const response = await ApiPost.Auth.verifyEmail({ token });
          if (response.success) {
            return response.message;
          }
          throw new Error(response.message ?? response.error);
        };
        await toast.promise(verifyUser(), {
          loading: 'Verifying email...',
          success: (message: string) => <b>{message}</b>,
          error: (error: Error) => <b>{error.message}</b>,
        });
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } catch (error) {
        handleError.log(error);
      }
    };

    if (token.length > 0) {
      verifyUserEmail();
    } else {
      toast.error('Invalid Link or token');
    }
  }, [token, router]);

  return (
    <div className="hero relative h-full">
      <div className="hero-content max-h-[80%] min-h-fit min-w-[65%] max-w-[80%] flex-col rounded-box bg-base-200 px-6 py-12 shadow-inner shadow-primary sm:max-h-full lg:flex-row-reverse">
        <div className="flex select-none flex-col gap-2 p-4 text-center lg:min-w-[55%]">
          <h1 className="text-center text-5xl font-bold">Verify Email</h1>
          <p className="text-pretty px-2 py-3">Welcome to Kalamandir! Please wait while we verify your email.</p>
        </div>
        <div className="card h-full w-full max-w-xs shrink-0 grow gap-1 bg-base-300 shadow-inner shadow-primary max-sm:max-w-sm sm:max-h-full lg:min-h-[85%] lg:max-w-sm">
          <div className="card-body p-4">
            <div className="flex select-none justify-center">Verify</div>
            <div className="divider"></div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="label-text text-secondary">Already verified?</p>
                <Link href="/auth/login" className="btn btn-link btn-sm">
                  Login
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <p className="label-text text-secondary">Link expired?</p>
                <Link href="/auth/signup" className="btn btn-link btn-sm">
                  Signup
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPageWrapper />
    </Suspense>
  );
}
