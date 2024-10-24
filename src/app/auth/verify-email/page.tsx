'use client';
import handleError from '@/app/util/error/handleError';
import axios from 'axios';
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
          const response = await axios.post('/api/auth/verify-email', { token: token });
          if (response.data.success === true) {
            return response.data.message;
          } else {
            throw new Error(response.data.message ?? response.data.error);
          }
        };
        await toast.promise(verifyUser(), {
          loading: 'Verifying email...',
          success: (message) => <b>{message}</b>,
          error: (error) => <b>{error.message}</b>,
        });
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } catch (error) {
        // console.log(error.response);
        // toast.error(error.response.data.error + ' ' + error.response.status);
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
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col justify-center rounded-box shadow-2xl lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="mb-5 text-5xl font-bold">Verify Email</h1>
          <p className="mb-5">Welcome to Kalamandir! Verifying your email is required to continue.</p>
        </div>
        <div className="card m-3 w-full max-w-sm flex-shrink-0 bg-base-100 shadow-xl shadow-neutral">
          <div className="card-body pb-5">
            <div className="flex select-none justify-center">Verify</div>
            <div className="card-body px-2 pt-3">
              <div className="flex items-center justify-between">
                <p className="label label-text text-secondary">If Already Verified</p>
                <Link href="/auth/login" className="btn btn-link pr-0">
                  Login
                </Link>
              </div>
              <hr className="border-t-2 border-neutral bg-base-300" />
              <div className="flex items-center justify-between">
                <p className="label label-text text-secondary">If Link expired resend verification go to signup</p>
                <Link href="/auth/signup" className="btn btn-link pr-0">
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
