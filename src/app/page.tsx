'use client';
import { useAuth } from '@context/userContext';
import { CheckBadgeIcon, ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React, { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [countdown, setCountdown] = React.useState(5);

  useEffect(() => {
    // Only redirect if authenticated
    if (!isAuthenticated) {
      return;
    }

    if (countdown === 0) {
      window.location.href = '/dashboard';
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isAuthenticated]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        bounce: 0.4,
      },
    },
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-base-100 to-base-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="hero min-h-screen"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="hero-content flex-col gap-8 rounded-box bg-base-100/50 p-8 shadow-2xl backdrop-blur-sm"
        >
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="text-success"
          >
            <CheckBadgeIcon className="h-12 w-12" />
          </motion.div>

          <motion.h1
            variants={item}
            className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-center text-5xl font-bold text-transparent"
          >
            Login Successfully!
          </motion.h1>

          <motion.div variants={item} className="flex flex-col items-center gap-3">
            <h2 className="text-pretty text-2xl font-semibold">
              Redirecting to Dashboard in{' '}
              <span className="countdown font-mono text-accent">
                <span style={{ '--value': countdown.toString() } as React.CSSProperties}></span>
              </span>{' '}
              seconds...
            </h2>
            <span className="loading loading-dots loading-lg bg-gradient-to-t from-secondary to-accent lg:w-16"></span>
          </motion.div>

          <motion.div variants={item}>
            <Link href="/dashboard" prefetch={true} className="btn btn-primary btn-lg">
              <motion.span
                animate={{
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                <span className="flex flex-nowrap items-center gap-2">
                  <HomeIcon className="h-6 w-6" />
                  Go to Dashboard
                  <ChevronRightIcon className="h-6 w-6" />
                </span>
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}
