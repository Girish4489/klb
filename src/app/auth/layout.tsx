'use client';
import PatternBackground, { defaultPattern } from '@components/patterns/PatternBackground';
import React, { useEffect } from 'react';

export default function AuthLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.title = 'Auth | Kalamandir';
  }, []);
  return (
    <div className="h-screen">
      <PatternBackground config={defaultPattern} />
      {children}
    </div>
  );
}
