'use client';
import PatternBackground, { defaultPattern } from '@/app/components/patterns/PatternBackground';
import { useCompany } from '@/app/context/companyContext';
import { useUser } from '@/app/context/userContext';
import AllBills from '@/app/dashboard/stats/AllBills';
import CompletedOrders from '@/app/dashboard/stats/CompletedOrders';
import DashboardStats from '@/app/dashboard/stats/DashboardStats';
import DueBills from '@/app/dashboard/stats/DueBills';
import DueDateTable from '@/app/dashboard/stats/DueDateTable';
import UnpaidBills from '@/app/dashboard/stats/UnpaidBills';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function DashboardClient() {
  const [refresh, setRefresh] = useState(false);
  const { user } = useUser();
  const { company } = useCompany();
  const [showWelcome, setShowWelcome] = useState(true);
  const [greeting, setGreeting] = useState('');

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const getAnimationConfig = () => {
    const enabled = user?.preferences?.animations?.enabled ?? true;
    const intensity = user?.preferences?.animations?.intensity ?? 10;
    const scale = Math.max(0.1, Math.min(1, intensity / 10)); // Ensure scale is between 0.1 and 1

    if (!enabled) {
      return {
        container: { initial: {}, animate: {}, transition: { duration: 0 } },
        title: { initial: {}, animate: {}, transition: { duration: 0 } },
        text: { initial: {}, animate: {}, transition: { duration: 0 } },
        loader: { initial: {}, animate: {}, transition: { duration: 0 } },
      };
    }

    return {
      container: {
        initial: { opacity: 0, y: 20 * scale },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 * scale },
      },
      title: {
        initial: { scale: 0.5, x: -50 * scale },
        animate: { scale: 1, x: 0 },
        transition: { delay: 0.2 * scale, type: 'spring', stiffness: 120 * scale },
      },
      text: {
        initial: { opacity: 0, x: 50 * scale },
        animate: { opacity: 1, x: 0 },
        transition: { delay: 0.4 * scale, type: 'spring', stiffness: 100 * scale },
      },
      loader: {
        initial: { scale: 0, rotate: -180 * scale },
        animate: { scale: 1, rotate: 0 },
        transition: { delay: 0.6 * scale, type: 'spring', stiffness: 200 * scale },
      },
    };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000); // Adjust timing based on user's animation preference

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    const newGreeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    setGreeting(newGreeting);
  }, []);

  if (showWelcome) {
    const animations = getAnimationConfig();
    const scale = user?.preferences?.animations?.intensity ?? 10;
    const duration = Math.max(0.5, (scale / 10) * 2); // Scale duration between 0.5 and 2 seconds

    return (
      <div className="relative h-full w-full">
        <div className="hidden bg-success" /> {/* Hidden element for color reference */}
        <PatternBackground
          config={{
            icon: 'mixed',
            size: 8,
            spacing: 24,
            color: 'bg-success', // Pass the Tailwind class name directly
            opacity: 0.2,
            rotate: 30,
            rounded: true,
          }}
        />
        <motion.div
          {...animations.container}
          className="relative flex h-full flex-col items-center justify-center gap-6 p-4 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: duration }}
        >
          {company?.logos?.medium && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-4"
            >
              <img src={company.logos.medium} alt={company.name} className="h-24 w-auto object-contain" />
            </motion.div>
          )}
          <motion.div {...animations.title} className="flex flex-col gap-2">
            <span className="text-2xl text-primary">{greeting || ''},</span>
            <h1 className="text-4xl font-bold capitalize">{user?.username || 'Guest'}</h1>
            {company?.name && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="text-lg text-secondary"
              >
                {company.name}
              </motion.span>
            )}
          </motion.div>
          <motion.div
            {...animations.loader}
            className="loading loading-ring loading-lg text-primary"
            onAnimationComplete={() => setShowWelcome(false)}
          />
        </motion.div>
      </div>
    );
  }

  if (!user?.isCompanyMember) {
    const animations = getAnimationConfig();

    return (
      <div className="relative h-full w-full">
        <PatternBackground config={defaultPattern} />
        <motion.div
          {...animations.container}
          className="relative flex h-full flex-col items-center justify-center text-center"
        >
          <div className="flex flex-col items-center justify-center gap-6 rounded-box bg-base-300 p-4">
            <motion.div {...animations.title} className="flex flex-col gap-2">
              <span className="text-2xl text-primary">{greeting || ''},</span>
              <h1 className="text-4xl font-bold capitalize">{user?.username || 'Guest'}</h1>
            </motion.div>
            <motion.p {...animations.text} className="max-w-md text-lg">
              Welcome to Kalamandir. You currently don't belong to any company. Please contact your administrator to get
              access to company features.
            </motion.p>
            <motion.div {...animations.loader} className="loading loading-ring loading-lg text-primary" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col gap-1 pb-2">
        <span className="flex items-center justify-between gap-2 rounded-box bg-neutral px-4 py-0.5">
          <h1 className="grow text-center">Dashboard</h1>
          <button className="btn btn-info btn-sm" onClick={handleRefresh}>
            Refresh
          </button>
        </span>
        <motion.span
          className="flex flex-wrap gap-2 rounded-box"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="grow rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
            <DashboardStats refresh={refresh} />
          </span>
          <span className="grow rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
            <DueDateTable refresh={refresh} />
          </span>
          <span className="grow rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
            <AllBills refresh={refresh} />
          </span>
          <span className="grow rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
            <DueBills refresh={refresh} />
          </span>
          <span className="grow rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
            <CompletedOrders refresh={refresh} />
          </span>
          <span className="grow rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
            <UnpaidBills refresh={refresh} />
          </span>
        </motion.span>
      </div>
    </motion.div>
  );
}
