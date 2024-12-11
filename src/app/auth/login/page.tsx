'use client';
import { useAuth } from '@context/userContext';
import { authUtils } from '@util/auth/authUtils';
import handleError from '@util/error/handleError';
import { ApiPost } from '@util/makeApiRequest/makeApiRequest';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, setAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email')?.toString().trim();
      const password = formData.get('password')?.toString().trim();

      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }
      // password should be at least 6 characters
      if (password.length < 6) {
        throw new Error('Password should be at least 6 characters');
      }

      const response = await ApiPost.Auth.login({ email, password });

      if (response.success) {
        setAuthenticated(true);
        authUtils.storeUser(response.user);
        toast.success('Login successful');
        router.replace('/');
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

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <div className="hero relative h-full">
      <div className="hero-content max-h-[80%] min-h-fit min-w-[65%] max-w-[80%] flex-col rounded-box bg-base-200 px-6 py-12 shadow-inner shadow-primary sm:max-h-full lg:flex-row-reverse">
        <div className="flex select-none flex-col gap-2 p-4 text-center lg:min-w-[55%]">
          <h1 className="text-center text-5xl font-bold">Login now!</h1>
          <p className="text-pretty px-2 py-3">Welcome back! Please enter your username and password to continue.</p>
        </div>
        <div className="card h-full w-full max-w-xs shrink-0 grow gap-1 bg-base-300 shadow-inner shadow-primary max-sm:max-w-sm sm:max-h-full lg:min-h-[85%] lg:max-w-sm">
          <form className="card-body p-4" onSubmit={handleLogin}>
            <div className="flex select-none justify-center">Login</div>
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                id="email"
                name="email"
                autoComplete="email"
                onFocus={(e) => e.target.select()}
                className="input input-sm input-bordered input-primary"
                required
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="password"
                id="password"
                name="password"
                autoComplete="current-password"
                onFocus={(e) => e.target.select()}
                className="input input-sm input-bordered input-primary"
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
                  name="check"
                  className="checkbox-primary checkbox checkbox-sm"
                />
              </label>
            </div>
            <div className="form-control">
              <button className="btn btn-primary btn-sm" disabled={isLoading}>
                {isLoading && <span className="loading loading-spinner"></span>}
                Login
              </button>
            </div>
          </form>
          <div className="card-body grow p-4">
            <div className="flex flex-col justify-center gap-2">
              <details className="collapse collapse-arrow bg-base-300 shadow-inner shadow-base-300 ring-1 ring-primary transition-all duration-700">
                <summary className="collapse-title card-compact h-fit select-none text-base">
                  Forgot your password?
                </summary>
                <div className="collapse-content">
                  <form className="card-body gap-2 p-0" onSubmit={handleForgotPassword}>
                    <div className="form-control">
                      <label className="label" htmlFor="forgotEmail">
                        <span className="label-text">Forgot Email</span>
                      </label>
                      <input
                        type="email"
                        placeholder="email"
                        id="forgotEmail"
                        name="forgotEmail"
                        onFocus={(e) => e.target.select()}
                        autoComplete="email"
                        className="input input-sm input-bordered"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <button className="btn btn-warning btn-sm">Reset</button>
                    </div>
                  </form>
                </div>
              </details>
              <div className="flex items-center justify-center gap-4 px-2">
                <p className="label text-pretty py-0.5 font-normal text-secondary">Don{"'"}t have an account yet?</p>
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
