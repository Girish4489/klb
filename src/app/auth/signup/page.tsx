'use client';
import handleError from '@util/error/handleError';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const username = e.currentTarget.username.value.trim();
    const email = e.currentTarget.email.value.trim();
    const password = e.currentTarget.password.value.trim();
    try {
      const signup = async () => {
        const response = await axios.post('/api/auth/signup', { username: username, email: email, password: password });
        if (response.data.success === true) {
          return response.data.message;
        } else {
          throw new Error(response.data.message ?? response.data.error);
        }
      };
      await toast.promise(signup(), {
        loading: 'Signing up...',
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

  const handleResendVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.resendEmail.value.trim();
    try {
      const resendVerification = async () => {
        const response = await axios.post('/api/auth/resend-email', { email: email });
        if (response.data.success === true) {
          return response.data.message;
        } else {
          throw new Error(response.data.message ?? response.data.error);
        }
      };
      await toast.promise(resendVerification(), {
        loading: 'Sending verification email',
        success: (message: string) => <b>{message}</b>,
        error: (error: Error) => <b>{error.message}</b>,
      });
      setTimeout(() => {
        router.push('/auth/login');
      }, 1000);
    } catch (error) {
      handleError.log(error);
    }
  };

  return (
    <div className="hero relative h-full">
      <div className="hero-content min-w-[75%] flex-col rounded-box bg-base-200 shadow-inner shadow-primary lg:flex-row-reverse">
        <div className="flex select-none flex-col gap-2 p-4 text-center lg:text-left">
          <h1 className="text-center text-5xl font-bold">Sign up now!</h1>
          <p className="text-pretty px-2 py-3">Welcome to Kalamandir! Please enter your details to continue.</p>
        </div>
        <div className="card w-full max-w-xs shrink-0 gap-1 bg-base-300 shadow-inner shadow-primary max-sm:max-w-sm">
          <form className="card-body p-4" onSubmit={handleSignup}>
            <div className="flex select-none justify-center">Sign Up</div>
            <div className="form-control">
              <label className="label" htmlFor="username">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                name="username"
                id="username"
                autoComplete="username"
                placeholder="username"
                className="input input-sm input-bordered input-primary"
                onFocus={(e) => e.target.select()}
                required
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                placeholder="email"
                className="input input-sm input-bordered input-primary"
                onFocus={(e) => e.target.select()}
                required
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                autoComplete="new-password"
                placeholder="password"
                className="input input-sm input-bordered input-primary"
                onFocus={(e) => e.target.select()}
                required
              />
            </div>
            <div className="flex flex-row items-center justify-between p-2 hover:rounded-box hover:bg-neutral">
              <label className="flex grow cursor-pointer items-center justify-between" htmlFor="check">
                Show password:
                <input
                  type="checkbox"
                  onChange={handleShowPassword}
                  id="check"
                  name="check"
                  className="checkbox-primary checkbox checkbox-sm"
                />
              </label>
            </div>
            <div className="form-control">
              <button className="btn btn-primary btn-sm" disabled={isLoading}>
                {isLoading && <span className="loading loading-spinner"></span>}
                Sign up
              </button>
            </div>
          </form>
          <div className="card-body p-4">
            <div className="flex flex-col justify-center gap-2">
              <p className="px-3 py-1 text-xs font-normal text-info">
                Note: If you have not verified your account, please enter your email below and click on resend.
              </p>
              <details className="collapse collapse-arrow bg-base-300 shadow-inner shadow-base-300 ring-1 ring-primary transition-all duration-700">
                <summary className="collapse-title card-compact h-fit select-none text-base">
                  Verify your Account?
                </summary>
                <div className="collapse-content">
                  <form className="card-body gap-2 p-0" onSubmit={handleResendVerification}>
                    <div className="form-control">
                      <label className="label" htmlFor="resendEmail">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="email"
                        placeholder="email"
                        name="resendEmail"
                        id="resendEmail"
                        autoComplete="email"
                        className="input input-sm input-bordered"
                        onFocus={(e) => e.target.select()}
                        required
                      />
                    </div>
                    <div className="form-control">
                      <button className="btn btn-warning btn-sm">Resend</button>
                    </div>
                  </form>
                </div>
              </details>
              <div className="flex items-center justify-center gap-4 px-2">
                <p className="label text-pretty py-0.5 font-normal text-secondary">Already have an account?</p>
                <Link href="/auth/login" className="btn btn-link btn-sm">
                  Login here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
