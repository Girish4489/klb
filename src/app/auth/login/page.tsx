'use client';
import { ThemeSwitcher } from '@/app/components/ThemeSwitcher';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: '',
    password: '',
  });

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const reload = () => {
    window.location.reload();
  };

  const handleLogin = async () => {
    user.email = user.email.trim();
    user.password = user.password.trim();
    try {
      toast.loading('Logging in...');
      const response = await axios.post('/api/auth/login', user);
      toast.remove();
      // Reload the page to trigger middleware redirection to the dashboard
      toast.success(response.data.message);
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
      reload();
    } catch (error: any) {
      toast.remove();
      toast.error(error.response.data.error);
      // console.log("Login failed:", error.response.data.error);
    } finally {
      setUser({ email: '', password: '' });
    }
  };

  const [forgot, setForgot] = React.useState({ email: '' });

  const handleForgotPassword = async () => {
    if (forgot.email.length === 0) {
      toast.error('Please enter email');
      return;
    }
    forgot.email = forgot.email.trim();
    try {
      toast.loading('Sending email...');
      const response = await axios.post('/api/auth/forgot-password', forgot);
      toast.remove();
      toast.success(response.data.message);
      // Reload the page to trigger middleware redirection to the dashboard
      // window.location.reload();
    } catch (error: any) {
      toast.remove();
      toast.error(error.response.data.error);
      // console.log("Forgot password failed:", error.response.data.error);
    } finally {
      setUser({ email: '', password: '' });
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <Toaster />
      <div className="hero-content flex-col rounded-box shadow-2xl lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">Welcome back! Please enter your username and password to continue.</p>
        </div>
        <div className="card m-3 w-full max-w-sm shrink-0 bg-base-100 shadow-lg shadow-neutral">
          <form className="card-body pb-5">
            <div className="flex justify-center">
              <ThemeSwitcher />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                id="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                autoComplete="email"
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
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                autoComplete="current-password"
                className="input input-bordered"
                required
              />
            </div>
            <div className="flex flex-row items-center justify-between py-2 pe-1">
              <label className="label" htmlFor="check">
                <span className="label-text-alt">Show password</span>
              </label>
              <input type="checkbox" onChange={handleShowPassword} id="check" className="checkbox" />
            </div>
            <div className="form-control mt-3">
              <button className="btn btn-primary" onClick={handleLogin}>
                Login
              </button>
            </div>
          </form>
          <div className="card-body pt-3">
            <div className="flex flex-col justify-center">
              <details className="collapse collapse-arrow bg-base-200">
                <summary
                  className="collapse-title flex items-center py-1 align-middle text-xs font-normal"
                  style={{ display: 'flex' }}
                >
                  Forgot your password?
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
                    <label className="label" htmlFor="forgotEmail">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="email"
                      id="forgotEmail"
                      value={forgot.email}
                      onChange={(e) => setForgot({ ...forgot, email: e.target.value })}
                      autoComplete="email"
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control mt-3">
                    <button className="btn btn-primary" onClick={handleForgotPassword}>
                      Reset
                    </button>
                  </div>
                </div>
              </details>
              <div className="flex items-center justify-center">
                <p className="label py-0.5 font-normal text-secondary">Don{"'"}t have an account yet?</p>
                <Link href="/auth/signup" className="btn btn-link">
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
