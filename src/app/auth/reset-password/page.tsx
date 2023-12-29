'use client';
import Link from 'next/link';
import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { ThemeSwitcher } from '@/app/components/ThemeSwitcher';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const router = useRouter();

  const [user, setUser] = React.useState({
    password: '',
    retypepassword: '',
  });

  const resetUserPassword = async () => {
    try {
      // check if password and retypepassword are the same
      if (user.password !== user.retypepassword) {
        toast.error('Passwords do not match');
        return;
      }
      toast.loading('Resetting password...');
      const response = await axios.post('/api/auth/reset-password', {
        token,
        password: user,
      });
      // console.log(response.data.message);
      toast.remove();
      toast.success(response.data.message);
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error: any) {
      toast.remove();
      toast.error(error.response.data.error + ' ' + error.response.status);
      // console.error(error.response.data.error);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split('=')[1];
    setToken(urlToken || '');
  }, []);

  return (
    <div className="hero min-h-screen bg-base-200">
      <Toaster />
      <div className="hero-content flex-col justify-center rounded-box shadow-2xl lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="mb-5 text-5xl font-bold">Reset Password</h1>
          <p className="mb-5">Welcome to Kalamandir! Please enter your new password.</p>
        </div>
        <div className="card m-3 w-full max-w-sm flex-shrink-0 bg-base-100 shadow-xl shadow-neutral">
          <div className="card-body pb-5">
            <div className="flex justify-center">
              <ThemeSwitcher />
            </div>
            <div className="form-control">
              <label className="label py-0.5 font-normal text-primary" htmlFor="token">
                Token
              </label>
              <textarea
                className="textarea textarea-accent disabled:opacity-50"
                placeholder="Token"
                name="token"
                id="token"
                defaultValue={token}
              />
            </div>
            <div className="form-control">
              <label className="label py-0.5 font-normal text-primary" htmlFor="password">
                Password
              </label>
              <input
                className="input input-accent"
                placeholder="Password"
                type="password"
                id="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label py-0.5 font-normal text-primary" htmlFor="retypepassword">
                Retype Password
              </label>
              <input
                className="input input-accent"
                placeholder="Retype Password"
                type="password"
                id="retypepassword"
                value={user.retypepassword}
                onChange={(e) => setUser({ ...user, retypepassword: e.target.value })}
              />
            </div>
            <div className="form-control mt-3">
              <button className="btn btn-primary" onClick={resetUserPassword}>
                Reset Password
              </button>
            </div>
            <div className="card-body px-3 pt-3">
              <div className={`flex items-center justify-center`}>
                <p className={` labelfont-normal py-0.5 text-secondary`}>If Already Verified</p>
                <Link href="/auth/login" className="btn btn-link">
                  Login
                </Link>
              </div>
              <hr className="border-t-2 border-neutral bg-base-300" />
              <div className={`flex items-center justify-center`}>
                <p className="label py-0.5 font-normal text-secondary">
                  If Link expired resend verification go to signup
                </p>
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
