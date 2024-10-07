'use client';
import Link from 'next/link';
import React, { useEffect } from 'react';

export default function Home() {
  const [countdown, setCountdown] = React.useState(5);

  useEffect(() => {
    if (countdown === 0) {
      window.location.href = '/dashboard';
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Cleanup the interval when the component unmounts or countdown reaches 0
    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <main>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col rounded-box shadow-2xl lg:flex-row-reverse">
          <div className="flex flex-col items-center gap-2 text-center lg:text-center">
            <h1 className="text-5xl font-bold">Login Successfully!</h1>
            <h2 className="text-xl font-bold">Redirecting to Dashboard in {countdown} seconds...</h2>
            <span className="loading loading-dots loading-lg bg-accent "></span>
            <Link href={'/dashboard'} className="btn btn-primary">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
