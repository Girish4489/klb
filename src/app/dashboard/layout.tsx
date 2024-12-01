'use client';
import HeaderProfilePage from '@/app/components/profile/headerProfile';
import Sidebar from '@/app/components/sidebar/sidebarPage';
import { useCompany } from '@/app/context/companyContext';
import { useUser } from '@/app/context/userContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Bars3Icon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { fetchAndSetUser, user } = useUser();
  const { company } = useCompany();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [smallDivice, setSmallDivice] = useState(false);
  let startX = 0;

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
    setSmallDivice(window.innerWidth <= 640);
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

  const handleTouchStart = (event: React.TouchEvent) => {
    startX = event.touches[0].pageX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    const endX = event.changedTouches[0]?.pageX;
    const deltaX = startX - endX;
    if (deltaX > 50 && isSidebarOpen && smallDivice) {
      setIsSidebarOpen(false);
    } else if (deltaX < -50 && !isSidebarOpen && smallDivice && startX <= 50) {
      setIsSidebarOpen(true);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden max-sm:-mb-16 max-sm:pb-0.5">
      <div className="navbar flex w-full flex-row content-stretch items-center gap-x-2 bg-base-300 py-1">
        <button
          className={`rounded-box p-2 transition-transform duration-700 ease-in-out focus:outline-none ${isSidebarOpen ? 'rotate-180' : 'rotate-0'}`}
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-7 w-7 text-current" />
          ) : (
            <Bars3Icon className="h-7 w-7 text-current" />
          )}
        </button>
        <div className="flex-1 select-none px-2">
          <Link href="/dashboard">{company?.name ? company.name : 'Kalamandir'}</Link>
        </div>
        <HeaderProfilePage user={user} isLoading={isLoading} />
      </div>
      <div
        className="flex h-full w-full flex-grow flex-row overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`py-1.5 transition-transform duration-700 ease-in-out max-sm:py-1.5 ${
            isSidebarOpen
              ? 'xl:w-1/7 h-full w-screen translate-x-0 rounded-e-2xl border-r border-neutral shadow-sm max-sm:w-3/5 sm:w-2/4 md:w-1/3 lg:w-1/4 2xl:w-1/5'
              : 'w-0 -translate-x-full'
          }`}
        >
          <Sidebar accessLevels={user?.companyAccess?.accessLevels || []} />
        </div>
        {/* main content */}
        <div
          className={`flex w-full grow flex-col flex-wrap transition-transform duration-700 ease-in-out ${
            isSidebarOpen ? 'max-sm:w-2/5 max-sm:bg-base-200 max-sm:bg-transparent' : 'w-full'
          }`}
          onClick={() => window.innerWidth <= 640 && isSidebarOpen && setIsSidebarOpen(false)}
        >
          <div
            className={`h-full rounded-box border border-neutral p-1 shadow-sm transition-opacity duration-700 ease-in-out ${isSidebarOpen ? `${smallDivice && 'opacity-50 max-sm:pointer-events-none max-sm:blur-sm'} '` : 'overflow-auto opacity-100'}`}
          >
            <div className="flex h-full w-full flex-col overflow-y-auto">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
