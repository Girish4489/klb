'use client';
import GlassCard from '@components/GlassCard';
import constants from '@constants/constants';
import { KeyIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import handleError from '@utils/error/handleError';
import { ApiPost, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { JSX, Suspense, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface ResetPasswordResponse extends ApiResponse {
  email?: string;
}

function ResetPasswordContent(): JSX.Element {
  const [token, setToken] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    setToken(urlToken || '');
  }, [searchParams]);

  const resetUserPassword = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const password = e.currentTarget.password.value.trim();
      const retypepassword = e.currentTarget.retypepassword.value.trim();

      if (password !== retypepassword) {
        throw new Error('Passwords do not match');
      }

      const resetPassword = async (): Promise<string> => {
        const response = await ApiPost.Auth.resetPassword<ResetPasswordResponse>({ token, password });
        if (!response) {
          throw new Error('No response from server');
        }
        if (response.success) {
          return response.message ?? 'Password reset successful';
        }
        throw new Error(response.message ?? response.error ?? 'Failed to reset password');
      };

      await toast.promise(resetPassword(), {
        loading: 'Resetting Password...',
        success: (message: string) => <b>{message}</b>,
        error: (error: Error) => <b>{error.message}</b>,
      });

      setTimeout(() => {
        router.push(constants.AUTH_LOGIN_PAGE);
      }, 1000);
    } catch (error) {
      handleError.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard variant="primary" className="animate-slideUp">
      <div className="flex flex-col gap-8 p-8 lg:flex-row-reverse">
        {/* Info Section */}
        <div className="flex select-none flex-col justify-center gap-4 lg:w-1/2">
          <div className="text-center">
            <h1 className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-5xl font-bold text-transparent">
              Reset Password
            </h1>
            <p className="mt-4 text-pretty text-base-content/70">
              Create a new password for your account to regain access to your fashion business management tools.
            </p>
          </div>
          <div className="mt-4 space-y-4 rounded-box bg-base-200/50 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold">Password Requirements:</h2>
            <ul className="ml-6 list-disc space-y-2 text-base-content/70">
              <li>At least 6 characters long</li>
              <li>Include numbers and letters</li>
              <li>Avoid common passwords</li>
              <li>Use unique combinations</li>
            </ul>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:w-1/2">
          <form className="space-y-6" onSubmit={resetUserPassword}>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <KeyIcon className="h-4 w-4" />
                  New Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter new password"
                  className="input input-bordered w-full bg-base-100/50 pr-10 backdrop-blur-sm"
                  required
                />
                <label className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                  <input
                    type="checkbox"
                    onChange={() => setShowPassword(!showPassword)}
                    className="checkbox-primary checkbox checkbox-xs"
                    checked={showPassword}
                  />
                </label>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <LockClosedIcon className="h-4 w-4" />
                  Confirm Password
                </span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="retypepassword"
                placeholder="Confirm new password"
                className="input input-bordered bg-base-100/50 backdrop-blur-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block bg-gradient-to-r from-primary via-accent to-secondary text-primary-content transition-all hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? <span className="loading loading-spinner loading-sm" /> : <KeyIcon className="h-5 w-5" />}
              Reset Password
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-base-content/70">
              Remember your password?{' '}
              <Link href={constants.AUTH_LOGIN_PAGE} className="link link-primary font-semibold hover:link-accent">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default function ResetPasswordPage(): JSX.Element {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
