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
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    const newGreeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    setGreeting(newGreeting);
  }, []);

  if (showWelcome) {
    return (
      <div className="relative h-full w-full">
        <div className="hidden bg-success" /> {/* Hidden element for color reference */}
        <PatternBackground
          config={{
            icon: 'mixed',
            size: 8,
            spacing: 24,
            color: 'bg-success',
            opacity: 0.2,
            rotate: 30,
            rounded: true,
          }}
        />
        <div className="relative flex h-full flex-col items-center justify-center gap-6 p-4 text-center">
          {company?.logos?.medium && (
            <div className="mb-4">
              <img src={company.logos.medium} alt={company.name} className="h-24 w-auto object-contain" />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <span className="text-2xl text-primary">{greeting || ''},</span>
            <h1 className="text-4xl font-bold capitalize">{user?.username || 'Guest'}</h1>
            {company?.name && <span className="text-lg text-secondary">{company.name}</span>}
          </div>
          <div className="loading loading-ring loading-lg text-primary" />
        </div>
      </div>
    );
  }

  if (!user?.isCompanyMember) {
    return (
      <div className="relative h-full w-full">
        <PatternBackground config={defaultPattern} />
        <div className="relative flex h-full flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center justify-center gap-6 rounded-box bg-base-300 p-4">
            <div className="flex flex-col gap-2">
              <span className="text-2xl text-primary">{greeting || ''},</span>
              <h1 className="text-4xl font-bold capitalize">{user?.username || 'Guest'}</h1>
            </div>
            <p className="max-w-md text-lg">
              Welcome to Kalamandir. You currently don't belong to any company. Please contact your administrator to get
              access to company features.
            </p>
            <div className="loading loading-ring loading-lg text-primary" />
          </div>
        </div>
      </div>
    );
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
