'use client';
import { useAuth } from '@context/userContext';
import { authUtils } from '@util/auth/authUtils';
import handleError from '@util/error/handleError';
import axios from 'axios';
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
      router.push('/dashboard');
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

      const response = await axios.post('/api/auth/login', { email, password });

      if (response.data.success) {
        setAuthenticated(true);
        authUtils.storeUser(response.data.user);
        toast.success('Login successful');
        router.replace(authUtils.getIntendedUrl());
      } else {
        throw new Error(response.data.message);
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
    const forgot = e.currentTarget.forgotEmail.value.trim();
    try {
      const forgotPassword = async () => {
        if (forgot.length === 0) throw new Error('Please enter email');

        const response = await axios.post('/api/auth/forgot-password', { email: forgot });
        if (response.data.success === true) {
          return response.data.message;
        } else {
          throw new Error(response.data.message ?? response.data.error);
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
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col rounded-box shadow-2xl lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">Welcome back! Please enter your username and password to continue.</p>
        </div>
        <div className="card m-3 w-full max-w-sm shrink-0 bg-base-100 shadow-lg shadow-neutral">
          <form className="card-body pb-5" onSubmit={handleLogin}>
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
                className="input input-bordered"
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
                className="input input-bordered"
                required
              />
            </div>
            <div className="flex flex-row items-center justify-between p-2 hover:rounded-box hover:bg-base-300/50">
              <label className="label grow cursor-pointer" htmlFor="check">
                <span className="label-text-alt">Show password</span>
              </label>
              <input
                type="checkbox"
                onChange={() => setShowPassword(!showPassword)}
                id="check"
                name="check"
                className="checkbox"
              />
            </div>
            <div className="form-control mt-3">
              <button className="btn btn-primary" disabled={isLoading}>
                Login
              </button>
            </div>
          </form>
          <div className="card-body pt-3">
            <div className="flex flex-col justify-center">
              <details className="collapse collapse-arrow bg-base-200">
                <summary className="collapse-title select-none py-1 text-xs font-normal">Forgot your password?</summary>
                <style>{`
                  .collapse-title {
                    height: fit-content;
                    min-height: fit-content;
                    padding-top: 14px;
                    padding-bottom: 14px;
                  }
                `}</style>
                <div className="collapse-content">
                  <form className="card-body p-0 pb-2" onSubmit={handleForgotPassword}>
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
                        className="input input-bordered"
                        required
                      />
                    </div>
                    <div className="form-control mt-3">
                      <button className="btn btn-primary">Reset</button>
                    </div>
                  </form>
                </div>
              </details>
              <div className="flex items-center justify-center px-2">
                <p className="label py-0.5 font-normal text-secondary">Don{"'"}t have an account yet?</p>
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
