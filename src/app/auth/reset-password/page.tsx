'use client';
import handleError from '@utils/error/handleError';
import { ApiPost } from '@utils/makeApiRequest/makeApiRequest';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

function ResetPasswordContent() {
  const [token, setToken] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    setToken(urlToken || '');
  }, [searchParams]);

  const resetUserPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const password = e.currentTarget.password.value.trim();
      const retypepassword = e.currentTarget.retypepassword.value.trim();

      if (password !== retypepassword) {
        throw new Error('Passwords do not match');
      }

      const resetPassword = async () => {
        const response = await ApiPost.Auth.resetPassword({ token, password });
        if (response.success) {
          return response.message;
        }
        throw new Error(response.message ?? response.error);
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
      handleError.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hero relative h-full">
      <div className="hero-content max-h-[80%] min-h-fit min-w-[65%] max-w-[80%] flex-col rounded-box bg-base-200 px-6 py-12 shadow-inner shadow-primary sm:max-h-full lg:flex-row-reverse">
        <div className="flex select-none flex-col gap-2 p-4 text-center lg:min-w-[55%]">
          <h1 className="text-center text-5xl font-bold">Reset Password</h1>
          <p className="text-pretty px-2 py-3">Welcome back! Please enter your new password to continue.</p>
        </div>
        <div className="card h-full w-full max-w-xs shrink-0 grow gap-1 bg-base-300 shadow-inner shadow-primary max-sm:max-w-sm sm:max-h-full lg:min-h-[85%] lg:max-w-sm">
          <form className="card-body p-4" onSubmit={resetUserPassword}>
            <div className="flex select-none justify-center">Reset Password</div>
            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">New Password</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="New Password"
                className="input input-sm input-bordered input-primary"
                autoComplete="new-password"
                required
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="retypepassword">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="retypepassword"
                name="retypepassword"
                placeholder="Confirm Password"
                className="input input-sm input-bordered input-primary"
                autoComplete="new-password"
                required
              />
            </div>
            <div className="flex flex-row items-center justify-between p-2 hover:rounded-box hover:bg-neutral">
              <label className="flex grow cursor-pointer items-center justify-between" htmlFor="check">
                Show password:
                <input
                  type="checkbox"
                  onChange={() => setShowPassword(!showPassword)}
                  id="check"
                  className="checkbox-primary checkbox checkbox-sm"
                />
              </label>
            </div>
            <div className="form-control mt-2">
              <button className="btn btn-primary btn-sm" disabled={isLoading}>
                {isLoading && <span className="loading loading-spinner"></span>}
                Reset Password
              </button>
            </div>
          </form>
          <div className="card-body p-4">
            <div className="flex items-center justify-center gap-4">
              <p className="label-text text-secondary">Link expired?</p>
              <Link href="/auth/login" className="btn btn-link btn-sm">
                Go to Login
              </Link>
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
