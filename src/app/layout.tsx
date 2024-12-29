'use client';
import '@/app/globals.css';
import { SpeedInsightsWrapper } from '@components/SpeedInsights';
import TopbarLoader from '@components/topbarLoader/page';
import { ThemeProvider } from '@context/ThemeContext';
import { CompanyProvider } from '@context/companyContext';
import { AuthProvider, UserProvider } from '@context/userContext';
import { roboto } from '@utils/fonts/fontConfig';
import { defaultMetadata } from '@utils/metadata';
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';
import { JSX, ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html
      lang="en"
      className={`${Object.values(roboto)
        .map((font) => font.variable)
        .join(' ')}`}
    >
      <Head>
        <title>{defaultMetadata.title as string}</title>
        <meta name="description" content={defaultMetadata.description as string} />
      </Head>
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
        <AuthProvider>
          <UserProvider>
            <CompanyProvider>
              <body className={roboto.regular.className}>
                <TopbarLoader />
                <Toaster />
                {children}
                <SpeedInsightsWrapper />
                <Analytics />
              </body>
            </CompanyProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </html>
  );
}
