'use client';
import { useCompany } from '@context/companyContext';
import { useUser } from '@context/userContext';
import { ShieldCheckIcon, SparklesIcon, UserIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { JSX, useEffect, useState } from 'react';
import AllBills from '../stats/AllBills';
import CompletedOrders from '../stats/CompletedOrders';
import DashboardStats from '../stats/DashboardStats';
import DueBills from '../stats/DueBills';
import DueDateTable from '../stats/DueDateTable';
import UnpaidBills from '../stats/UnpaidBills';

export default function DashboardClient(): JSX.Element {
  const [refresh, setRefresh] = useState(false);
  const { user } = useUser();
  const { company } = useCompany();
  const [showWelcome, setShowWelcome] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [visibleComponents, setVisibleComponents] = useState({
    dashboardStats: true,
    dueDateTable: true,
    allBills: false,
    dueBills: false,
    completedOrders: false,
    unpaidBills: false,
  });

  const handleRefresh = (): void => {
    setRefresh(!refresh);
  };

  const toggleComponent = (key: string): void => {
    setVisibleComponents((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof visibleComponents],
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return (): void => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    const newGreeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    setGreeting(newGreeting);
  }, []);

  interface TimeTheme {
    gradient: string;
    icon: string;
    message: string;
  }

  const getTimeBasedTheme = (): TimeTheme => {
    const hour = new Date().getHours();
    if (hour < 6)
      return { gradient: 'from-blue-900 via-indigo-900 to-purple-900', icon: '🌙', message: 'Working late?' };
    if (hour < 12)
      return { gradient: 'from-orange-400 via-amber-400 to-yellow-400', icon: '🌅', message: 'Rise and shine!' };
    if (hour < 17)
      return { gradient: 'from-sky-400 via-cyan-400 to-teal-400', icon: '☀️', message: 'Having a great day?' };
    if (hour < 20)
      return { gradient: 'from-orange-500 via-red-500 to-purple-500', icon: '🌇', message: 'Good evening!' };
    return { gradient: 'from-indigo-900 via-purple-900 to-pink-900', icon: '🌃', message: 'Burning the midnight oil?' };
  };

  const timeTheme = getTimeBasedTheme();

  const WelcomeScreen = (): JSX.Element => (
    <div className="relative h-full w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative flex h-full flex-col items-center justify-center gap-8 p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          {company?.logos?.medium ? (
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="animate-pulse-border h-full w-full rounded-full" />
              </motion.div>
              <Image
                src={company.logos.medium}
                alt={company.name}
                width={128}
                height={128}
                className="ring-primary/50 rounded-full object-contain ring-2 drop-shadow-2xl"
              />
            </div>
          ) : (
            <div className="bg-linear-to-r from-primary to-secondary rounded-full p-8">
              <UserIcon className="animate-float text-primary-content h-16 w-16" />
            </div>
          )}

          <motion.div className="card bg-base-200/50 backdrop-blur-md">
            <div className="card-body items-center p-6 text-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center justify-center gap-3">
                  <span
                    className={`bg-linear-to-r ${timeTheme.gradient} bg-clip-text font-light text-xl text-transparent`}
                  >
                    {greeting} {timeTheme.message}
                  </span>
                  <span className="text-2xl">{timeTheme.icon}</span>
                </div>
                <h1 className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text font-bold text-4xl capitalize text-transparent">
                  {user?.username || 'Guest'}
                </h1>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {company?.name && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="card bg-base-100/30 backdrop-blur-md"
          >
            <div className="card-body p-6">
              <SparklesIcon className="text-warning mx-auto h-6 w-6 animate-bounce" />
              <h2 className="card-title justify-center text-2xl">{company.name}</h2>
              <p className="text-base-content/70 text-center">Loading your workspace...</p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-3"
        >
          <div className="loading loading-ring loading-lg text-primary" />
          <span className="text-base-content/70 animate-pulse">Preparing your dashboard...</span>
        </motion.div>
      </motion.div>
    </div>
  );

  const NonCompanyUserScreen = (): JSX.Element => (
    <div className="relative h-full w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative flex h-full flex-col items-center justify-center p-8"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="card bg-base-100/60 w-full max-w-md shadow-xl backdrop-blur-md"
        >
          <div className="card-body items-center gap-6 text-center">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="bg-linear-to-r from-primary to-secondary rounded-full p-6"
            >
              <ShieldCheckIcon className="text-primary-content h-12 w-12" />
            </motion.div>

            <motion.div className="space-y-6">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <div className="mb-4 flex items-center justify-center gap-3">
                  <span
                    className={`bg-linear-to-r ${timeTheme.gradient} bg-clip-text font-light text-xl text-transparent`}
                  >
                    {greeting} {timeTheme.message}
                  </span>
                  <span className="text-2xl">{timeTheme.icon}</span>
                </div>
                <h1 className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text font-bold text-3xl capitalize text-transparent">
                  {user?.username || 'Guest'}
                </h1>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div className="alert alert-info shadow-lg">
                  <SparklesIcon className="h-6 w-6" />
                  <span>Welcome to Kalamandir</span>
                </div>
                <div className="alert alert-warning shadow-lg">
                  <ShieldCheckIcon className="h-6 w-6" />
                  <span>Contact administrator for access</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
              className="badge badge-neutral gap-2"
            >
              <div className="loading loading-ring loading-xs" />
              <span>Awaiting approval</span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );

  if (showWelcome) {
    return <WelcomeScreen />;
  }

  if (!user?.isCompanyMember) {
    return <NonCompanyUserScreen />;
  }

  return (
    <div>
      <div className="flex flex-col gap-1 pb-2">
        <span className="rounded-box bg-neutral flex items-center justify-between gap-2 px-4 py-0.5">
          <h1 className="text-neutral-content grow text-center">Dashboard</h1>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-primary btn-xs">
              Show/Hide Tables
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content menu-sm z-1 rounded-box bg-linear-to-bl from-base-100 to-base-300 ring-secondary w-52 p-2 shadow-sm ring-2"
            >
              <li>
                <label className="label cursor-pointer">
                  <span className="label-text">Dashboard Stats</span>
                  <input
                    type="checkbox"
                    checked={visibleComponents.dashboardStats}
                    onChange={() => toggleComponent('dashboardStats')}
                    className="checkbox-secondary checkbox checkbox-sm"
                  />
                </label>
              </li>
              <li>
                <label className="label cursor-pointer">
                  <span className="label-text">Due Date Table</span>
                  <input
                    type="checkbox"
                    checked={visibleComponents.dueDateTable}
                    onChange={() => toggleComponent('dueDateTable')}
                    className="checkbox-secondary checkbox checkbox-sm"
                  />
                </label>
              </li>
              <li>
                <label className="label cursor-pointer">
                  <span className="label-text">All Bills</span>
                  <input
                    type="checkbox"
                    checked={visibleComponents.allBills}
                    onChange={() => toggleComponent('allBills')}
                    className="checkbox-secondary checkbox checkbox-sm"
                  />
                </label>
              </li>
              <li>
                <label className="label cursor-pointer">
                  <span className="label-text">Due Bills</span>
                  <input
                    type="checkbox"
                    checked={visibleComponents.dueBills}
                    onChange={() => toggleComponent('dueBills')}
                    className="checkbox-secondary checkbox checkbox-sm"
                  />
                </label>
              </li>
              <li>
                <label className="label cursor-pointer">
                  <span className="label-text">Completed Orders</span>
                  <input
                    type="checkbox"
                    checked={visibleComponents.completedOrders}
                    onChange={() => toggleComponent('completedOrders')}
                    className="checkbox-secondary checkbox checkbox-sm"
                  />
                </label>
              </li>
              <li>
                <label className="label cursor-pointer">
                  <span className="label-text">Unpaid Bills</span>
                  <input
                    type="checkbox"
                    checked={visibleComponents.unpaidBills}
                    onChange={() => toggleComponent('unpaidBills')}
                    className="checkbox-secondary checkbox checkbox-sm"
                  />
                </label>
              </li>
            </ul>
          </div>
          <button className="btn btn-info btn-xs" onClick={handleRefresh}>
            Refresh
          </button>
        </span>
        <span className="rounded-box flex flex-wrap gap-2">
          {visibleComponents.dashboardStats && (
            <span className="rounded-box border-primary shadow-primary grow border p-2 shadow-inner transition-shadow">
              <DashboardStats refresh={refresh} />
            </span>
          )}
          {visibleComponents.dueDateTable && (
            <span className="rounded-box border-primary shadow-primary grow border p-2 shadow-inner transition-shadow">
              <DueDateTable refresh={refresh} />
            </span>
          )}
          {visibleComponents.allBills && (
            <span className="rounded-box border-primary shadow-primary grow border p-2 shadow-inner transition-shadow">
              <AllBills refresh={refresh} />
            </span>
          )}
          {visibleComponents.dueBills && (
            <span className="rounded-box border-primary shadow-primary grow border p-2 shadow-inner transition-shadow">
              <DueBills refresh={refresh} />
            </span>
          )}
          {visibleComponents.completedOrders && (
            <span className="rounded-box border-primary shadow-primary grow border p-2 shadow-inner transition-shadow">
              <CompletedOrders refresh={refresh} />
            </span>
          )}
          {visibleComponents.unpaidBills && (
            <span className="rounded-box border-primary shadow-primary grow border p-2 shadow-inner transition-shadow">
              <UnpaidBills refresh={refresh} />
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
