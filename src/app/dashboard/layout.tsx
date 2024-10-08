'use client';
import LogoutPage from '@/app/components/logout/page';
import Sidebar from '@/app/components/sidebar/page';
import { useUser } from '@/app/context/userContext';
import { IUser } from '@/models/userModel';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { fetchAndSetUser, user } = useUser();
  useEffect(() => {
    document.title = 'Dashboard | Kalamandir';
    fetchAndSetUser();
  }, [fetchAndSetUser]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  let startX = 0;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const ProfilePage = ({ user }: { user: Omit<IUser, 'password'> }) => {
    return (
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="avatar">
          <div className="w-12 transform rounded-full ring-2 ring-primary hover:scale-105 hover:ring-offset-2 hover:ring-offset-accent">
            {/* src if Uint8Array */}
            <Image
              src={
                user.profileImage.__filename !== 'USER_PROFILE_404_ERROR'
                  ? `data:${user.profileImage.contentType};base64,${Buffer.from(new Uint8Array(user.profileImage?.data || [])).toString('base64')}`
                  : '/klm.webp'
              }
              alt="profile image"
              className="cursor-pointer rounded-full transition-all duration-500 ease-in-out"
              width="40"
              height="40"
              priority
            />
          </div>
        </div>
        <ul tabIndex={0} className="menu dropdown-content menu-sm z-50 mt-3 w-auto rounded-box bg-base-200 p-2 shadow">
          <li className="tooltip tooltip-left" data-tip="Username">
            <a className="justify-between">
              {user.username}
              {user.createdAt && new Date(user.createdAt) > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) && (
                <span className="badge badge-primary">New</span>
              )}
            </a>
          </li>
          <li className="tooltip tooltip-left" data-tip="Email">
            <a>{user.email}</a>
          </li>
          <li>
            <a className="justify-between">
              Verified
              <span className={`badge ${user.isVerified ? 'badge-success' : 'badge-error'}`}>
                {user.isVerified ? 'Yes' : 'No'}
              </span>
            </a>
          </li>
          <li>
            <a className="justify-between">
              Admin
              <span className={`badge ${user.isAdmin ? 'badge-success' : 'badge-error'}`}>
                {user.isAdmin ? 'Yes' : 'No'}
              </span>
            </a>
          </li>
          <li>
            <span className="justify-between">
              Theme
              <Link
                href="/dashboard/settings#themeBlock"
                className="tooltip tooltip-top flex flex-row gap-2 rounded-box bg-primary pl-2 pr-1 font-medium text-primary-content"
                data-tip="edit theme"
              >
                {user.theme.charAt(0).toUpperCase() + user.theme.slice(1)}
                <span className="badge badge-secondary">
                  <Image src="/icons/svg/note-pencil.svg" alt="edit icon" width="18" height="18" />
                </span>
              </Link>
            </span>
          </li>
          <li className={`tooltip tooltip-left`} data-tip="Settings">
            <Link href="/dashboard/settings">Settings</Link>
          </li>
          <li
            className="tooltip tooltip-left text-warning hover:rounded-lg hover:bg-error hover:font-medium hover:text-warning-content"
            data-tip="Logout"
          >
            <LogoutPage />
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden max-sm:-mb-16 max-sm:pb-0.5">
      {/* Navbar */}
      <div className="navbar flex w-full flex-row content-stretch items-center bg-base-300">
        <span
          className={`btn btn-circle ${isSidebarOpen ? 'open' : 'closed'}`}
          // aria-label="toggleSidebar"
          onClick={toggleSidebar}
        >
          {/* hamburger icon */}
          <svg
            className={`swap-off fill-current ${isSidebarOpen ? 'hidden' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>

          {/* close icon */}
          <svg
            className={`swap-on fill-current ${isSidebarOpen ? '' : 'hidden'}`}
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
          </svg>
        </span>

        <div className={`mx-2 flex-1 select-none px-2`}>
          <Link href="/dashboard">Kalamandir</Link>
        </div>

        {/* Profile dropdown */}
        <ProfilePage user={user} />
      </div>
      {/* sidebar and content page */}
      <div
        className="flex h-full w-full flex-grow flex-row overflow-hidden"
        defaultValue={(startX = 0)}
        onTouchStart={(event: React.TouchEvent) => {
          startX = event.touches[0].pageX;
        }}
        onTouchEnd={(event: React.TouchEvent) => {
          const endX = event.changedTouches[0]?.pageX;
          const deltaX = startX - endX;
          if (deltaX > 50 && isSidebarOpen === true && window.innerWidth <= 640) {
            setIsSidebarOpen(false);
          } else if (deltaX < -50 && isSidebarOpen === false && window.innerWidth <= 640 && startX <= 50) {
            setIsSidebarOpen(true);
          }
        }}
      >
        {/* Sidebar */}
        <div
          className={`py-1.5 transition-all duration-500 max-sm:py-1.5 ${
            isSidebarOpen
              ? 'xl:w-1/7 h-full w-screen translate-x-0 rounded-e-2xl border-r border-neutral shadow-2xl max-sm:w-3/5 sm:w-2/4 md:w-1/3 lg:w-1/4 2xl:w-1/5'
              : 'w-0 -translate-x-full'
          }`}
        >
          {/* Sidebar content here */}
          <Sidebar />
        </div>

        {/* Page content */}
        <div
          className={`flex w-full flex-col flex-wrap transition-all duration-500
          ${isSidebarOpen ? ' max-sm:w-2/5 max-sm:bg-base-200 max-sm:bg-transparent' : 'w-full'}`}
          onClick={() => {
            if (window.innerWidth <= 640 && isSidebarOpen) {
              setIsSidebarOpen(false);
            }
          }}
        >
          <div
            className={`h-full rounded-box border border-neutral p-1 shadow-2xl ${
              isSidebarOpen ? 'max-sm:pointer-events-none max-sm:blur-sm' : 'overflow-auto'
            }`}
          >
            {/* Page content here */}
            <div className="flex h-full w-full flex-col overflow-y-auto">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
