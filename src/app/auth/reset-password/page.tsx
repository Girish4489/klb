'use client';
import handleError from '@util/error/handleError';
import axios from 'axios';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

function ResetPasswordContent() {
  const [token, setToken] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlToken = searchParams.get('token');
    setToken(urlToken || '');
  }, [searchParams]);

  const resetUserPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = e.currentTarget.password.value.trim();
    const retypepassword = e.currentTarget.retypepassword.value.trim();
    if (password !== retypepassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const resetPassword = async () => {
        const response = await axios.post('/api/auth/reset-password', { token: token, password: password });
        if (response.data.success === true) {
          return response.data.message;
        } else {
          throw new Error(response.data.message ?? response.data.error);
        }
      };
      await toast.promise(resetPassword(), {
        loading: 'Resetting Password...',
        success: (message: string) => <b>{message}</b>,
        error: (error: Error) => <b>{error.message}</b>,
      });
      setTimeout(() => {
        router.push('/auth/login');
      }, 1000);
    } catch (error) {
      console.error(error);
      handleError.log(error);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col justify-center rounded-box shadow-2xl lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="mb-5 text-5xl font-bold">Reset Password</h1>
          <p className="mb-5">Welcome to Kalamandir! Please enter your new password.</p>
        </div>
        <div className="card m-3 w-full max-w-sm flex-shrink-0 bg-base-100 shadow-xl shadow-neutral">
          <div className="card-body pb-5">
            <div className="flex select-none justify-center">Reset Password</div>
            <form onSubmit={resetUserPassword}>
              <div className="form-control">
                <label className="label py-0.5 font-normal text-primary" htmlFor="password">
                  Password
                </label>
                <input
                  className="input input-accent"
                  placeholder="Password"
                  autoComplete="new-password"
                  type="password"
                  id="password"
                  onFocus={(e) => e.target.select()}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label py-0.5 font-normal text-primary" htmlFor="retypepassword">
                  Confirm Password
                </label>
                <input
                  className="input input-accent"
                  placeholder="Retype Password"
                  autoComplete="new-password"
                  type="password"
                  id="retypepassword"
                  onFocus={(e) => e.target.select()}
                  required
                />
              </div>
              <div className="form-control mt-3">
                <button className="btn btn-primary">Reset Password</button>
              </div>
            </form>
            <div className="card-body px-2 py-3">
              <hr className="border-t-2 border-neutral bg-base-300" />
              <div className="flex items-center justify-between gap-2">
                <p className="label label-text text-secondary">If Link expired resend password link go to Login Page</p>
                <Link href="/auth/login" className="btn btn-link p-0">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
