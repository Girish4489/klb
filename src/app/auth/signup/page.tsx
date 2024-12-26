'use client';
import constants from '@/app/constants/constants';
import GlassCard from '@components/GlassCard';
import { EnvelopeIcon, IdentificationIcon, KeyIcon, UserIcon } from '@heroicons/react/24/outline';
import { IUser } from '@models/userModel';
import handleError from '@utils/error/handleError';
import { ApiPost, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { JSX } from 'react';
import { toast } from 'react-hot-toast';

interface SignupResponse extends ApiResponse {
  savedUser?: Partial<IUser>;
}

interface EmailResponse extends ApiResponse {
  email?: string;
}

export default function SignupPage(): JSX.Element {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleShowPassword = (): void => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    const username = e.currentTarget.username.value.trim();
    const email = e.currentTarget.email.value.trim();
    const password = e.currentTarget.password.value.trim();
    // password should be at least 6 characters
    if (password.length < 6) {
      throw new Error('Password should be at least 6 characters');
    }
    try {
      const signup = async (): Promise<string> => {
        const response = await ApiPost.Auth.signup<SignupResponse>({ username, email, password });
        if (!response) {
          throw new Error('No response from server');
        }
        if (response.success) {
          return response.message ?? 'Signup successful';
        }
        throw new Error(response.message ?? response.error ?? 'Unknown error occurred');
      };
      await toast.promise(signup(), {
        loading: 'Signing up...',
        success: (message: string) => <b>{message}</b>,
        error: (error: Error) => <b>{error.message}</b>,
      });
      setTimeout(() => {
        router.push(constants.AUTH_LOGIN_PAGE);
      }, 800);
    } catch (error) {
      handleError.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const email = e.currentTarget.resendEmail.value.trim();
    try {
      const resendVerification = async (): Promise<string> => {
        const response = await ApiPost.Auth.resendEmail<EmailResponse>({ email });
        if (!response) {
          throw new Error('No response from server');
        }
        if (response.success) {
          return response.message ?? 'Verification email sent';
        }
        throw new Error(response.message ?? response.error ?? 'Unknown error occurred');
      };
      await toast.promise(resendVerification(), {
        loading: 'Sending verification email',
        success: (message: string) => <b>{message}</b>,
        error: (error: Error) => <b>{error.message}</b>,
      });
      setTimeout(() => {
        router.push(constants.AUTH_LOGIN_PAGE);
      }, 1000);
    } catch (error) {
      handleError.log(error);
    }
  };

  return (
    <GlassCard variant="secondary" className="animate-slideUp">
      <div className="flex flex-col gap-8 p-8 lg:flex-row-reverse">
        {/* Info Section */}
        <div className="flex select-none flex-col justify-center gap-4 lg:w-1/2">
          <div className="text-center">
            <h1 className="bg-linear-to-r from-secondary via-primary to-accent bg-clip-text text-5xl font-bold text-transparent">
              Create Account
            </h1>
            <p className="text-base-content/70 mt-4 text-pretty">
              Join Kalamandir to manage your fashion business better. Get started with a free account today.
            </p>
          </div>
          <div className="rounded-box bg-base-200/50 backdrop-blur-xs mt-4 space-y-4 p-6">
            <h2 className="text-lg font-semibold">What you&apos;ll get:</h2>
            <ul className="text-base-content/70 ml-6 list-disc space-y-2">
              <li>Real-time inventory tracking</li>
              <li>Sales analytics dashboard</li>
              <li>Customer relationship tools</li>
              <li>Secure data management</li>
            </ul>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:w-1/2">
          <form className="space-y-6" onSubmit={handleSignup}>
            <div className="form-control w-full">
              <label className="label" htmlFor="username">
                <span className="label-text flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Username
                </span>
              </label>
              <input
                type="text"
                name="username"
                id="username"
                autoComplete="username"
                placeholder="Enter your username"
                className="input input-bordered bg-base-100/50 backdrop-blur-xs w-full grow"
                onFocus={(e) => e.target.select()}
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label" htmlFor="email">
                <span className="label-text flex items-center gap-2">
                  <EnvelopeIcon className="h-4 w-4" />
                  Email
                </span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                placeholder="Enter your email"
                className="input input-bordered bg-base-100/50 backdrop-blur-xs w-full grow"
                onFocus={(e) => e.target.select()}
                required
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text flex items-center gap-2">
                  <KeyIcon className="h-4 w-4" />
                  Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  className="input input-bordered bg-base-100/50 backdrop-blur-xs w-full pr-10"
                  required
                />
                <label className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                  <input
                    type="checkbox"
                    onChange={handleShowPassword}
                    className="checkbox-secondary checkbox checkbox-sm"
                    checked={showPassword}
                  />
                </label>
              </div>
              <label className="label">
                <span className="label-text-alt text-info">Must be at least 6 characters</span>
              </label>
            </div>

            <button type="submit" className="btn btn-secondary btn-block btn-soft" disabled={isLoading}>
              {isLoading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <IdentificationIcon className="h-5 w-5" />
              )}
              Create Account
            </button>
          </form>

          <div className="divider my-8">OR</div>

          {/* Account verification section */}
          <div className="rounded-box bg-base-200/50 backdrop-blur-xs space-y-4 p-4">
            <details className="collapse-plus bg-base-100/50 collapse">
              <summary className="collapse-title text-sm font-medium">Need to verify your account?</summary>
              <div className="collapse-content">
                <form className="mt-4 space-y-4" onSubmit={handleResendVerification}>
                  <div className="form-control">
                    <input
                      type="email"
                      name="resendEmail"
                      placeholder="Enter your email"
                      className="input input-sm input-bordered w-full"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-warning btn-sm btn-block">
                    Resend Verification
                  </button>
                </form>
              </div>
            </details>
          </div>

          <div className="mt-6 text-center">
            <p className="text-base-content/70 text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="link link-secondary hover:link-accent font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
