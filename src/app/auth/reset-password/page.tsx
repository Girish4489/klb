'use client';
import handleError from '@/app/util/error/handleError';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const router = useRouter();

  const resetUserPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = e.currentTarget.password.value.trim();
    const retypepassword = e.currentTarget.retypepassword.value.trim();
    if (password !== retypepassword) {
      toast.error('Passwords do not match');
      return;
    }
    const resetPassword = async () => {
      const response = await axios.post('/api/auth/reset-password', { token: token, password: password });
      if (response.data.success === true) {
        return response.data.message;
      } else {
        throw new Error(response.data.error);
      }
    };
    try {
      await toast.promise(resetPassword(), {
        loading: 'Resetting Password...',
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });
      setTimeout(() => {
        router.push('/auth/login');
      }, 1000);
    } catch (error) {
      // console.error(error.response.data.error);
      // toast.error(error.response.data.error);
      handleError.log(error);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split('=')[1];
    setToken(urlToken || '');
  }, []);

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
              <div className="flex items-center justify-between gap-2">
                <p className="label label-text text-secondary">If Already Verified</p>
                <Link href="/auth/login" className="btn btn-link p-0">
                  Login
                </Link>
              </div>
              <hr className="border-t-2 border-neutral bg-base-300" />
              <div className="flex items-center justify-between gap-2">
                <p className="label label-text text-secondary">If Link expired resend verification go to signup</p>
                <Link href="/auth/signup" className="btn btn-link p-0">
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
