'use client';
import GlassCard from '@components/GlassCard';
import constants from '@constants/constants';
import { useAuth } from '@context/userContext';
import { EnvelopeIcon, KeyIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { authUtils } from '@utils/auth/authUtils';
import handleError from '@utils/error/handleError';
import { ApiPost } from '@utils/makeApiRequest/makeApiRequest';
import { loginMetadata } from '@utils/metadata';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { JSX, useState } from 'react';
import toast from 'react-hot-toast';

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

      const response = await ApiPost.Auth.login({ email, password });

      if (response.success) {
        setAuthenticated(true);
        authUtils.storeUser(response.user);
        toast.success('Login successful');
        router.push(constants.LANDING_LOGIN_SUCCESS_PAGE);
      } else {
        throw new Error(response.message);
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
      const forgotPassword = async () => {
        if (email.length === 0) throw new Error('Please enter email');

        const response = await ApiPost.Auth.forgotPassword({ email });
        if (response.success) {
          return response.message;
        } else {
          throw new Error(response.message ?? response.error);
        }
      };
      await toast.promise<string>(forgotPassword(), {
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
              <h1 className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-5xl font-bold text-transparent">
                Welcome Back!
              </h1>
              <p className="mt-4 text-pretty text-base-content/70">
                Sign in to your account to manage your fashion business and access all features.
              </p>
            </div>
            <div className="mt-4 space-y-4 rounded-box bg-base-200/50 p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold">Access your:</h2>
              <ul className="ml-6 list-disc space-y-2 text-base-content/70">
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
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4" />
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="input input-bordered bg-base-100/50 backdrop-blur-sm"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <KeyIcon className="h-4 w-4" />
                    Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
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

              <button
                type="submit"
                className="btn btn-primary btn-block bg-gradient-to-r from-primary via-accent to-secondary text-primary-content transition-all hover:scale-[1.02]"
                disabled={isLoading}
              >
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
            <div className="space-y-4 rounded-box bg-base-200/50 p-4 backdrop-blur-sm">
              <details className="collapse collapse-plus bg-base-100/50">
                <summary className="collapse-title text-sm font-medium">Forgot your password?</summary>
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
              <p className="text-sm text-base-content/70">
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="link link-primary font-semibold hover:link-accent">
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
