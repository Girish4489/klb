'use client';
import Notifications from '@/app/dashboard/components/Notifications';
import HeaderProfilePage from '@/app/dashboard/components/headerProfile';
import Sidebar from '@components/sidebar/sidebarPage';
import { useCompany } from '@context/companyContext';
import { useUser } from '@context/userContext';
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { JSX, ReactNode, useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }): JSX.Element {
  const { fetchAndSetUser, user } = useUser();
  const { company } = useCompany();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async (): Promise<void> => {
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

  const toggleSidebar = (): void => {
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
        {/* Fixed navbar with glass effect */}
        <div className="navbar bg-base-100/70 fixed inset-x-0 top-0 z-[var(--z-navbar)] h-12 max-h-12 min-h-12 w-full py-4 shadow-lg backdrop-blur">
          <div className="flex-none">
            <button className="btn btn-square btn-ghost btn-sm lg:hidden" onClick={toggleSidebar}>
              <Bars3BottomLeftIcon className="text-base-content h-6 w-6" />
            </button>
          </div>
          <div className="flex-1">
            <Link href="/dashboard" className="btn btn-ghost btn-sm font-semibold">
              {company?.name ?? 'Kalamandir'}
            </Link>
          </div>
          {/* Notifications and profile container */}
          <div className="flex flex-row items-center justify-between gap-3">
            <Notifications notifications={user?.notifications ?? []} />
            <HeaderProfilePage user={user ?? null} isLoading={isLoading} />
          </div>
        </div>
        {/* Main content area that flows under the navbar */}
        <main className="relative flex-1 overflow-y-auto pt-12">{children}</main>
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
