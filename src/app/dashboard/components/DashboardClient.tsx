'use client';
import { useCompany } from '@/app/context/companyContext';
import { useUser } from '@/app/context/userContext';
import AllBills from '@/app/dashboard/stats/AllBills';
import CompletedOrders from '@/app/dashboard/stats/CompletedOrders';
import DashboardStats from '@/app/dashboard/stats/DashboardStats';
import DueBills from '@/app/dashboard/stats/DueBills';
import DueDateTable from '@/app/dashboard/stats/DueDateTable';
import UnpaidBills from '@/app/dashboard/stats/UnpaidBills';
import { ShieldCheckIcon, SparklesIcon, UserIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function DashboardClient() {
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

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const toggleComponent = (key: string) => {
    setVisibleComponents((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof visibleComponents],
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    const newGreeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    setGreeting(newGreeting);
  }, []);

  const getTimeBasedTheme = () => {
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

  const WelcomeScreen = () => (
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
              <img
                src={company.logos.medium}
                alt={company.name}
                className="h-32 w-auto rounded-full object-contain ring-2 ring-primary/50 drop-shadow-2xl"
              />
            </div>
          ) : (
            <div className="rounded-full bg-gradient-to-r from-primary to-secondary p-8">
              <UserIcon className="animate-float h-16 w-16 text-primary-content" />
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
                    className={`bg-gradient-to-r ${timeTheme.gradient} bg-clip-text text-xl font-light text-transparent`}
                  >
                    {greeting} {timeTheme.message}
                  </span>
                  <span className="text-2xl">{timeTheme.icon}</span>
                </div>
                <h1 className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-4xl font-bold capitalize text-transparent">
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
              <SparklesIcon className="mx-auto h-6 w-6 animate-bounce text-warning" />
              <h2 className="card-title justify-center text-2xl">{company.name}</h2>
              <p className="text-center text-base-content/70">Loading your workspace...</p>
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
          <span className="animate-pulse text-base-content/70">Preparing your dashboard...</span>
        </motion.div>
      </motion.div>
    </div>
  );

  const NonCompanyUserScreen = () => (
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
          className="card w-full max-w-md bg-base-100/60 shadow-xl backdrop-blur-md"
        >
          <div className="card-body items-center gap-6 text-center">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="rounded-full bg-gradient-to-r from-primary to-secondary p-6"
            >
              <ShieldCheckIcon className="h-12 w-12 text-primary-content" />
            </motion.div>

            <motion.div className="space-y-6">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <div className="mb-4 flex items-center justify-center gap-3">
                  <span
                    className={`bg-gradient-to-r ${timeTheme.gradient} bg-clip-text text-xl font-light text-transparent`}
                  >
                    {greeting} {timeTheme.message}
                  </span>
                  <span className="text-2xl">{timeTheme.icon}</span>
                </div>
                <h1 className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-3xl font-bold capitalize text-transparent">
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
        <span className="flex items-center justify-between gap-2 rounded-box bg-neutral px-4 py-0.5">
          <h1 className="grow text-center text-neutral-content">Dashboard</h1>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-primary btn-xs">
              Show/Hide Tables
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content menu-sm z-[1] w-52 rounded-box bg-gradient-to-bl from-base-100 to-base-300 p-2 shadow ring-2 ring-secondary"
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
        <span className="flex flex-wrap gap-2 rounded-box">
          {visibleComponents.dashboardStats && (
            <span className="grow rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
              <DashboardStats refresh={refresh} />
            </span>
          )}
          {visibleComponents.dueDateTable && (
            <span className="grow rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
              <DueDateTable refresh={refresh} />
            </span>
          )}
          {visibleComponents.allBills && (
            <span className="grow rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
              <AllBills refresh={refresh} />
            </span>
          )}
          {visibleComponents.dueBills && (
            <span className="grow rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
              <DueBills refresh={refresh} />
            </span>
          )}
          {visibleComponents.completedOrders && (
            <span className="grow rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
              <CompletedOrders refresh={refresh} />
            </span>
          )}
          {visibleComponents.unpaidBills && (
            <span className="grow rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
              <UnpaidBills refresh={refresh} />
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
