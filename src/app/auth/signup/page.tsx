'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import { ThemeSwitcher } from '@/app/components/ThemeSwitcher';

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSignup = async () => {
    // Logic to handle signup form submission
    try {
      toast.loading('Signing up');
      const response = await axios.post('/api/auth/signup', user);
      // console.log("Signup success", response.data);
      toast.remove();
      if (response.data.success === false) {
        toast.error(response.data.message);
        return;
      }
      toast.success('Signup Successfull \n Please verify your email');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error: any) {
      // console.log("Signup failed", error.message);
      toast.remove();
      toast.error(error.message);
    } finally {
      setUser({ username: '', email: '', password: '' });
    }
  };

  const [resendUser, setResendUser] = useState({ email: '' });
  const handleResendVerification = async () => {
    // Logic to resend verification mail
    resendUser.email = resendUser.email.trim();
    try {
      toast.loading('Sending verification email');
      const response = await axios.post('/api/auth/resend-email', resendUser);
      // console.log("Resend email success", response.data);
      toast.remove();
      if (response.data.success === false) {
        toast.error(response.data.message);
        return;
      }
      toast.success('Verification email sent');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error: any) {
      // console.log("Resend email failed", error.message);
      toast.remove();
      toast.error(error.message);
    } finally {
      setResendUser({ email: '' });
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <Toaster />
      <div className="hero-content flex-col justify-center rounded-box shadow-2xl lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="mb-5 text-5xl font-bold">Sign up now!</h1>
          <p className="mb-5">Welcome to Kalamandir! Please enter your details to continue.</p>
        </div>
        <div className="card m-3 w-full max-w-sm flex-shrink-0 bg-base-100 shadow-xl shadow-neutral">
          <div className="card-body pb-5">
            <div className="flex justify-center">
              <ThemeSwitcher />
            </div>
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
                className="input input-bordered"
                required
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                name="email"
                id="email"
                autoComplete="email"
                className="input input-bordered"
                required
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                name="password"
                id="password"
                autoComplete="new-password"
                className="input input-bordered"
                required
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>
            <div className="form-control mt-3">
              <button className="btn btn-primary" onClick={handleSignup}>
                Sign up
              </button>
            </div>
          </div>
          <div className="card-body pt-3">
            <div className="flex flex-col justify-center">
              <details className="collapse collapse-arrow bg-base-200">
                <summary
                  className="collapse-title flex items-center py-1 align-middle text-xs font-normal"
                  style={{ display: 'flex' }}
                >
                  Verify your Account?
                </summary>
                <style jsx>{`
                  .collapse-title {
                    height: fit-content;
                    min-height: fit-content;
                    padding-top: 14px;
                    padding-bottom: 14px;
                  }
                `}</style>
                <div className="collapse-content">
                  <div className="form-control">
                    <label className="label" htmlFor="resendEmail">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="email"
                      name="email"
                      id="resendEmail"
                      autoComplete="email"
                      className="input input-bordered"
                      required
                      value={resendUser.email}
                      onChange={(e) => setResendUser({ ...resendUser, email: e.target.value })}
                    />
                  </div>
                  <div className="form-control mt-3">
                    <button className="btn btn-primary" onClick={handleResendVerification}>
                      Resend
                    </button>
                  </div>
                </div>
              </details>
              <div className="flex items-center justify-center">
                <p className="label py-0.5 font-normal text-secondary">Already have an account?</p>
                <Link href="/auth/login" className="btn btn-link">
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
