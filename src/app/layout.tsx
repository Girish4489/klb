import TopbarLoader from '@/app/components/topbarLoader/page';
import { ThemeProvider } from '@/app/context/ThemeContext';
import { UserProvider } from '@/app/context/userContext';
import type { Metadata } from 'next';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kalamandir',
  description: 'Kalamandir is a platform for Fashion and Lifestyle products Management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/logo/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/logo/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/logo/favicon-16x16.png" />
        <link rel="mask-icon" href="/icons/logo/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="manifest" href="/icons/logo/site.webmanifest" />
        <meta name="msapplication-config" content="/icons/logo/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />
      </head>

      <ThemeProvider>
        <UserProvider>
          <body>
            <TopbarLoader />
            <Toaster />
            {children}
          </body>
        </UserProvider>
      </ThemeProvider>
    </html>
  );
}
