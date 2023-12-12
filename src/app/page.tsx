'use client';
import { useEffect, useState } from 'react';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import Link from 'next/link';

export default function Home() {
  const [countdown, setCountdown] = useState(5); // Initial countdown time

  useEffect(() => {
    // Function to decrement the countdown timer
    const decrementCountdown = () => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    };

    const timer = setInterval(decrementCountdown, 1000); // Decrease countdown every second

    // Redirect to the dashboard page when the countdown reaches 0
    if (countdown === 0) {
      clearInterval(timer); // Clear the interval
      window.location.href = '/dashboard'; // Redirect to the dashboard page
    }

    // Cleanup the interval when the component unmounts
    return () => {
      clearInterval(timer);
    };
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
