'use client';
import HeaderProfilePage from '@components/profile/headerProfile';
import Sidebar from '@components/sidebar/sidebarPage';
import { useCompany } from '@context/companyContext';
import { useUser } from '@context/userContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Bars3Icon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

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
        <div className="navbar sticky top-0 z-10 flex w-full items-center gap-x-2 bg-base-300 py-1">
          <label
            className={`rounded-box p-2 transition-transform duration-700 ease-in-out focus:outline-none lg:hidden ${isSidebarOpen ? 'rotate-180' : 'rotate-0'}`}
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
          >
            {isSidebarOpen ? (
              <XMarkIcon className="h-7 w-7 text-current" />
            ) : (
              <Bars3Icon className="h-7 w-7 text-current" />
            )}
          </label>
          <div className="flex-1 select-none px-2">
            <Link href="/dashboard">{company?.name ? company.name : 'Kalamandir'}</Link>
          </div>
          <HeaderProfilePage user={user} isLoading={isLoading} />
        </div>
        {/* Page content */}
        <div className="flex-grow overflow-y-auto p-4">{children}</div>
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
