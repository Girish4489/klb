'use client';
import HeaderProfilePage from '@/app/dashboard/components/headerProfile';
import Sidebar from '@components/sidebar/sidebarPage';
import { useCompany } from '@context/companyContext';
import { useUser } from '@context/userContext';
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Notifications from './components/Notifications';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { fetchAndSetUser, user } = useUser();
  const { company } = useCompany();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        await fetchAndSetUser();
      } finally {
        setIsLoading(false);
      }
    };

    document.title = 'Dashboard | Kalamandir';
    initializeUser();
  }, [fetchAndSetUser]);

  useEffect(() => {
    const savedSidebarState = localStorage.getItem('isSidebarOpen');
    if (savedSidebarState !== null) {
      setIsSidebarOpen(JSON.parse(savedSidebarState));
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => {
      const newState = !prevState;
      localStorage.setItem('isSidebarOpen', JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="my-drawer-2"
        type="checkbox"
        className="drawer-toggle"
        checked={isSidebarOpen}
        onChange={toggleSidebar}
      />
      <div className="drawer-content flex h-screen flex-col">
        {/* Navbar */}
        <div className="navbar sticky top-0 z-10 flex min-h-10 w-full items-center gap-x-2 rounded-b-box bg-opacity-60 bg-gradient-to-t from-base-100 to-base-300 px-2 py-0.5 shadow-lg ring-1 ring-info backdrop-blur-md">
          <div className="flex-none">
            <button className="btn btn-square btn-ghost btn-sm lg:hidden" onClick={toggleSidebar}>
              <Bars3BottomLeftIcon className="h-6 w-6 text-base-content" />
            </button>
          </div>
          <div className="flex-1">
            <Link href="/dashboard" className="btn btn-ghost btn-sm text-base-content">
              {company?.name ? company.name : 'Kalamandir'}
            </Link>
          </div>
          <div className="flex flex-row items-center justify-between gap-x-2">
            <Notifications notifications={user?.notifications || []} />
            <HeaderProfilePage user={user} isLoading={isLoading} />
          </div>
        </div>
        {/* Page content */}
        <div className="flex-grow overflow-y-auto px-0 py-2">{children}</div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <Sidebar
          accessLevels={user?.companyAccess?.accessLevels || []}
          isCompanyMember={user.isCompanyMember || false}
        />
      </div>
    </div>
  );
}
