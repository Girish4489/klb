'use client';
import { ThemeSwitcher } from '@/app/components/ThemeSwitcher';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = e.currentTarget.username.value.trim();
    const email = e.currentTarget.email.value.trim();
    const password = e.currentTarget.password.value.trim();
    const signup = async () => {
      const response = await axios.post('/api/auth/signup', { username: username, email: email, password: password });
      if (response.data.success === true) {
        return response.data.message;
      } else {
        throw new Error(response.data.error);
      }
    };
    try {
      await toast.promise(signup(), {
        loading: 'Signing up...',
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });
      setTimeout(() => {
        router.push('/auth/login');
      }, 1000);
    } catch (error: any) {
      // console.log("Signup failed", error.message);
      // toast.error(error.message);
    }
  };

  const handleResendVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.resendEmail.value.trim();
    const resendVerification = async () => {
      const response = await axios.post('/api/auth/resend-email', { email: email });
      if (response.data.success === true) {
        return response.data.message;
      } else {
        throw new Error(response.data.error);
      }
    };
    try {
      await toast.promise(resendVerification(), {
        loading: 'Sending verification email',
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });
      setTimeout(() => {
        router.push('/auth/login');
      }, 1000);
    } catch (error: any) {
      // console.log("resend verification failed", error.message);
      // toast.error(error.message);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
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
            <form onSubmit={handleSignup} className="flex flex-col gap-2">
              <div className="form-control">
                <label className="label label-text" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="username"
                  placeholder="username"
                  className="input input-bordered"
                  onFocus={(e) => e.target.select()}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label label-text" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  placeholder="email"
                  className="input input-bordered"
                  onFocus={(e) => e.target.select()}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label label-text" htmlFor="password">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  placeholder="password"
                  className="input input-bordered"
                  onFocus={(e) => e.target.select()}
                  required
                />
              </div>
              <div className="flex flex-row items-center justify-between pe-1">
                <label className="label" htmlFor="check">
                  <span className="label-text-alt">Show password</span>
                </label>
                <input type="checkbox" onChange={handleShowPassword} id="check" name="check" className="checkbox" />
              </div>
              <div className="form-control mt-3">
                <button className="btn btn-primary">Sign up</button>
              </div>
            </form>
          </div>
          <div className="card-body pt-3">
            <div className="flex flex-col justify-center">
              <p className="px-3 py-1 text-xs font-normal text-info">
                Note: If you have not verified your account, please enter your email below and click on resend.
              </p>
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
                  <form onSubmit={handleResendVerification}>
                    <div className="form-control">
                      <label className="label label-text" htmlFor="resendEmail">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="email"
                        name="resendEmail"
                        id="resendEmail"
                        autoComplete="email"
                        className="input input-bordered"
                        onFocus={(e) => e.target.select()}
                        required
                      />
                    </div>
                    <div className="form-control mt-3">
                      <button className="btn btn-primary">Resend</button>
                    </div>
                  </form>
                </div>
              </details>
              <div className="flex items-center justify-center px-2">
                <p className="label py-0.5 font-normal text-secondary">Already have an account?</p>
                <Link href="/auth/login" className="btn btn-link pr-0">
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
