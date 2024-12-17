'use client';
import GlassCard from '@components/GlassCard';
import { EnvelopeIcon, IdentificationIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import handleError from '@utils/error/handleError';
import { ApiPost } from '@utils/makeApiRequest/makeApiRequest';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect } from 'react';
import { toast } from 'react-hot-toast';

function VerifyEmailPageWrapper() {
  const [token, setToken] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isVerified, setIsVerified] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlToken = searchParams.get('token');
    setToken(urlToken || '');
  }, [searchParams]);

  const handleVerification = async () => {
    if (!token) {
      toast.error('Invalid Link or token');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await ApiPost.Auth.verifyEmail({ token });
      if (response.success) {
        toast.success(response.message);
        setIsVerified(true);
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        throw new Error(response.message ?? response.error);
      }
    } catch (error) {
      handleError.toast(error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <GlassCard variant="accent" className="animate-slideUp">
      <div className="flex flex-col gap-8 p-8 lg:flex-row-reverse">
        {/* Info Section */}
        <div className="flex select-none flex-col justify-center gap-4 lg:w-1/2">
          <div className="text-center">
            <h1 className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-5xl font-bold text-transparent">
              Verify Your Email
            </h1>
            <p className="mt-4 text-pretty text-base-content/70">
              We're verifying your email address to ensure the security of your account. This helps protect your
              business data.
            </p>
          </div>
          <div className="mt-4 space-y-4 rounded-box bg-base-200/50 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold">Next Steps:</h2>
            <ul className="ml-6 list-disc space-y-2 text-base-content/70">
              <li>Verification in progress</li>
              <li>Automatic redirect to login</li>
              <li>Access your dashboard</li>
              <li>Start managing your business</li>
            </ul>
          </div>
        </div>

        {/* Status Section */}
        <div className="lg:w-1/2">
          <div className="rounded-box bg-base-100/50 p-8 text-center backdrop-blur-sm">
            <div className="mb-6 flex justify-center">
              {isVerified ? (
                <ShieldCheckIcon className="h-16 w-16 animate-bounce text-success" />
              ) : (
                <EnvelopeIcon className="h-16 w-16 animate-pulse text-accent" />
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Verification Status</h2>
              {!isVerified && (
                <span
                  className={`${isVerifying || (!token && 'select-disabled tooltip tooltip-error')} block h-full bg-transparent`}
                  data-tip={!token ? 'Invalid verification link' : ''}
                >
                  <button
                    onClick={handleVerification}
                    disabled={isVerifying || !token}
                    className={`btn btn-accent btn-block ${
                      isVerifying || !token
                        ? 'btn-disabled'
                        : 'bg-gradient-to-r from-accent via-primary to-secondary text-primary-content transition-all hover:scale-[1.02]'
                    }`}
                  >
                    {isVerifying ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <ShieldCheckIcon className="h-5 w-5" />
                    )}
                    {isVerifying ? 'Verifying...' : 'Verify Email'}
                  </button>
                </span>
              )}

              {isVerified && (
                <div className="alert alert-success">
                  <ShieldCheckIcon className="h-5 w-5" />
                  <span>Email verified successfully! Redirecting to login...</span>
                </div>
              )}

              <div className="divider">Options</div>

              <div className="space-y-4">
                <Link href="/auth/login" className="btn btn-outline btn-accent btn-block">
                  <ShieldCheckIcon className="h-5 w-5" />
                  Go to Login
                </Link>

                <Link href="/auth/signup" className="btn btn-outline btn-secondary btn-block">
                  <IdentificationIcon className="h-5 w-5" />
                  Create New Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPageWrapper />
    </Suspense>
  );
}
