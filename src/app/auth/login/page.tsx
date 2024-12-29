'use client';
import constants from '@/app/constants/constants';
import GlassCard from '@components/GlassCard';
import { useAuth } from '@context/userContext';
import { EnvelopeIcon, KeyIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { IUser } from '@models/userModel';
import { authUtils } from '@utils/auth/authUtils';
import handleError from '@utils/error/handleError';
import { ApiPost, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import { loginMetadata } from '@utils/metadata';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { JSX, useState } from 'react';
import toast from 'react-hot-toast';

interface LoginResponse extends ApiResponse {
  user?: IUser;
}

interface ForgotPasswordResponse extends ApiResponse {
  email?: string;
}

export default function LoginPage(): JSX.Element {
  const { setAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email')?.toString().trim();
      const password = formData.get('password')?.toString().trim();

      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }
      if (password.length < 6) {
        throw new Error('Password should be at least 6 characters');
      }

      const response = await ApiPost.Auth.login<LoginResponse>({ email, password });

      if (!response) {
        throw new Error('No response from server');
      }

      if (response.success && response.user) {
        setAuthenticated(true);
        authUtils.storeUser(response.user);
        toast.success('Login successful');
        router.push(constants.LANDING_LOGIN_SUCCESS_PAGE);
      } else {
        throw new Error(response.message ?? 'Login failed');
      }
    } catch (error) {
      handleError.toast(error);
      setAuthenticated(false);
      authUtils.clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const email = e.currentTarget.forgotEmail.value.trim();
    try {
      const forgotPassword = async (): Promise<string> => {
        if (email.length === 0) throw new Error('Please enter email');

        const response = await ApiPost.Auth.forgotPassword<ForgotPasswordResponse>({ email });
        if (!response) {
          throw new Error('No response from server');
        }
        if (response.success) {
          return response.message ?? 'Reset link sent successfully';
        }
        throw new Error(response.message ?? response.error ?? 'Failed to send reset link');
      };
      await toast.promise(forgotPassword(), {
        loading: 'Sending reset link...',
        success: (message: string) => <b>{message}</b>,
        error: (error: Error) => <b>{error.message}</b>,
      });
    } catch (error) {
      handleError.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>{loginMetadata.title as string}</title>
        <meta name="description" content={loginMetadata.description as string} />
      </Head>
      <GlassCard variant="primary" className="animate-slideUp">
        <div className="flex flex-col gap-8 p-8 lg:flex-row-reverse">
          {/* Info Section */}
          <div className="flex select-none flex-col justify-center gap-4 lg:w-1/2">
            <div className="text-center">
              <h1 className="bg-linear-to-r from-primary via-accent to-secondary bg-clip-text font-bold text-5xl text-transparent">
                Welcome Back!
              </h1>
              <p className="text-base-content/70 mt-4 text-pretty">
                Sign in to your account to manage your fashion business and access all features.
              </p>
            </div>
            <div className="rounded-box bg-base-200/50 backdrop-blur-xs mt-4 space-y-4 p-6">
              <h2 className="text-lg font-semibold">Access your:</h2>
              <ul className="text-base-content/70 ml-6 list-disc space-y-2">
                <li>Business Dashboard</li>
                <li>Inventory Management</li>
                <li>Sales Reports</li>
                <li>Customer Data</li>
              </ul>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:w-1/2">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="form-control w-full">
                <label className="label" htmlFor="email">
                  <span className="label-text flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4" />
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="input input-bordered bg-base-100/50 backdrop-blur-xs w-full grow"
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
                    placeholder="Enter your password"
                    className="input input-bordered bg-base-100/50 backdrop-blur-xs w-full pr-10"
                    required
                  />
                  <label className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                    <input
                      type="checkbox"
                      onChange={() => setShowPassword(!showPassword)}
                      className="checkbox-primary checkbox checkbox-sm"
                      checked={showPassword}
                    />
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-soft btn-block" disabled={isLoading}>
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <ShieldCheckIcon className="h-5 w-5" />
                )}
                Sign in
              </button>
            </form>

            <div className="divider my-8">OR</div>

            {/* Forgot Password Section */}
            <div className="rounded-box bg-base-200/50 backdrop-blur-xs space-y-4 p-4">
              <details className="collapse-plus bg-base-100/50 collapse">
                <summary className="collapse-title font-medium text-sm">Forgot your password?</summary>
                <div className="collapse-content">
                  <form className="mt-4 space-y-4" onSubmit={handleForgotPassword}>
                    <input
                      type="email"
                      name="forgotEmail"
                      placeholder="Enter your email"
                      className="input input-sm input-bordered w-full"
                      required
                    />
                    <button type="submit" className="btn btn-warning btn-sm btn-block">
                      Reset Password
                    </button>
                  </form>
                </div>
              </details>
            </div>

            <div className="mt-6 text-center">
              <p className="text-base-content/70 text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="link link-primary hover:link-accent font-semibold">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </>
  );
}
