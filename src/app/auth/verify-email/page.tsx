'use client';
import GlassCard from '@components/GlassCard';
import { EnvelopeIcon, IdentificationIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import handleError from '@utils/error/handleError';
import { ApiPost, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { JSX, Suspense, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface VerifyEmailResponse extends ApiResponse {
  email?: string;
}

function VerifyEmailPageWrapper(): JSX.Element {
  const [token, setToken] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlToken = searchParams.get('token');
    setToken(urlToken || '');
  }, [searchParams]);

  const handleVerification = async (): Promise<void> => {
    if (!token) {
      toast.error('Invalid Link or token');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await ApiPost.Auth.verifyEmail<VerifyEmailResponse>({ token });

      if (!response) {
        throw new Error('No response from server');
      }

      if (response.success) {
        toast.success(response.message ?? 'Email verified successfully');
        setIsVerified(true);
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        throw new Error(response.message ?? response.error ?? 'Failed to verify email');
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
            <h1 className="bg-linear-to-r from-accent via-primary to-secondary bg-clip-text text-5xl font-bold text-transparent">
              Verify Your Email
            </h1>
            <p className="text-base-content/70 mt-4 text-pretty">
              We&apos;re verifying your email address to ensure the security of your account. This helps protect your
              business data.
            </p>
          </div>
          <div className="rounded-box bg-base-200/50 backdrop-blur-xs mt-4 space-y-4 p-6">
            <h2 className="text-lg font-semibold">Next Steps:</h2>
            <ul className="text-base-content/70 ml-6 list-disc space-y-2">
              <li>Verification in progress</li>
              <li>Automatic redirect to login</li>
              <li>Access your dashboard</li>
              <li>Start managing your business</li>
            </ul>
          </div>
        </div>

        {/* Status Section */}
        <div className="lg:w-1/2">
          <div className="rounded-box bg-base-100/50 backdrop-blur-xs p-8 text-center">
            <div className="mb-6 flex justify-center">
              {isVerified ? (
                <ShieldCheckIcon className="text-success h-16 w-16 animate-bounce" />
              ) : (
                <EnvelopeIcon className="text-accent h-16 w-16 animate-pulse" />
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
                        : 'bg-linear-to-r from-accent via-primary to-secondary text-primary-content transition-all hover:scale-[1.02]'
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

export default function VerifyEmailPage(): JSX.Element {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPageWrapper />
    </Suspense>
  );
}
