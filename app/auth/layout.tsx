'use client';
import { Navbar } from '@components/Navbar';
import { JSX, useEffect } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }): JSX.Element {
  useEffect(() => {
    document.title = 'Auth | Kalamandir';
  }, []);
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex min-h-[calc(100vh-4rem)] w-full grow items-center justify-center p-4">
        <div className="w-full max-w-[85%] animate-fadeIn">{children}</div>
      </main>
    </div>
  );
}
