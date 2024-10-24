'use client';
import LogoutPage from '@/app/components/logout/page';
import Sidebar from '@/app/components/sidebar/page';
import { useUser } from '@/app/context/userContext';
import { IUser } from '@/models/userModel';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Bars3Icon,
  CheckBadgeIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  SwatchIcon,
  UserCircleIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const ProfilePage = ({ user }: { user: Omit<IUser, 'password'> }) => {
  const profileImageSrc =
    user.profileImage.__filename !== 'USER_PROFILE_404_ERROR' && user.profileImage.data
      ? `data:${user.profileImage.contentType};base64,${user.profileImage?.data}`
      : '/klm.webp';

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="avatar">
        <div className="w-12 transform rounded-full ring-2 ring-primary hover:scale-105 hover:ring-offset-2 hover:ring-offset-accent">
          <Image
            src={profileImageSrc}
            alt="profile image"
            className="cursor-pointer rounded-full transition-all duration-500 ease-in-out"
            width="40"
            height="40"
            priority
          />
        </div>
      </div>
      <ul tabIndex={0} className="menu dropdown-content menu-sm z-50 mt-3 w-auto rounded-box bg-base-200 p-2 shadow">
        <ProfileItem icon={<UserIcon className="h-5 w-5 text-primary" />} label={user.username} tooltip="Username">
          {user.createdAt && new Date(user.createdAt) > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) && (
            <span className="badge badge-primary">New</span>
          )}
        </ProfileItem>
        <ProfileItem icon={<EnvelopeIcon className="h-5 w-5 text-primary" />} label={user.email} tooltip="Email" />
        <ProfileItem
          icon={<CheckBadgeIcon className="h-5 w-5 text-primary" />}
          label="Verified"
          tooltip="Verified"
          liClass="flex"
        >
          <StatusIcon isTrue={user.isVerified} />
        </ProfileItem>
        <ProfileItem icon={<UserCircleIcon className="h-5 w-5 text-primary" />} label="Admin" tooltip="Admin">
          <StatusIcon isTrue={user.isAdmin} />
        </ProfileItem>
        <ProfileItem icon={<SwatchIcon className="h-5 w-5 text-primary" />} label="Theme" tooltip="Theme">
          <Link
            href="/dashboard/settings#themeBlock"
            className="tooltip tooltip-top flex flex-row gap-2 rounded-box bg-primary pl-2 pr-1 font-medium text-primary-content"
            data-tip="edit theme"
          >
            {user.theme.charAt(0).toUpperCase() + user.theme.slice(1)}
            <span className="badge badge-secondary">
              <PencilSquareIcon className="h-5 w-5" />
            </span>
          </Link>
        </ProfileItem>
        <ProfileItem
          icon={<Cog6ToothIcon className="h-5 w-5 text-primary" />}
          label="Settings"
          tooltip="Settings"
          link="/dashboard/settings"
        />
        <li
          className="tooltip tooltip-left flex text-warning hover:rounded-lg hover:bg-error hover:font-medium hover:text-warning-content"
          data-tip="Logout"
        >
          <LogoutPage />
        </li>
      </ul>
    </div>
  );
};

const ProfileItem = ({
  icon,
  label,
  tooltip,
  liClass,
  children,
  link,
}: {
  icon: React.ReactNode;
  label: string;
  tooltip: string;
  liClass?: string;
  children?: React.ReactNode;
  link?: string;
}) => (
  <li className={`tooltip tooltip-left ${liClass}`} data-tip={tooltip}>
    {link ? (
      <Link href={link} className="flex items-center">
        {icon}
        <span className="justify-between">
          {label}
          {children}
        </span>
      </Link>
    ) : (
      <div className="flex items-center">
        {icon}
        <span className="flex grow justify-between">
          {label}
          {children}
        </span>
      </div>
    )}
  </li>
);

const StatusIcon = ({ isTrue }: { isTrue: boolean }) => (
  <span
    className={`tooltip tooltip-left items-center ${isTrue ? 'tooltip-success' : 'tooltip-error'}`}
    data-tip={isTrue ? 'Verified' : 'Not Verified'}
  >
    {isTrue ? (
      <CheckBadgeIcon className="h-5 w-5 text-success" />
    ) : (
      <ExclamationCircleIcon className="h-5 w-5 text-error" />
    )}
  </span>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { fetchAndSetUser, user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  let startX = 0;

  useEffect(() => {
    document.title = 'Dashboard | Kalamandir';
    fetchAndSetUser();
  }, [fetchAndSetUser]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleTouchStart = (event: React.TouchEvent) => {
    startX = event.touches[0].pageX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    const endX = event.changedTouches[0]?.pageX;
    const deltaX = startX - endX;
    if (deltaX > 50 && isSidebarOpen && window.innerWidth <= 640) {
      setIsSidebarOpen(false);
    } else if (deltaX < -50 && !isSidebarOpen && window.innerWidth <= 640 && startX <= 50) {
      setIsSidebarOpen(true);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden max-sm:-mb-16 max-sm:pb-0.5">
      <div className="navbar flex w-full flex-row content-stretch items-center bg-base-300">
        <label className="swap swap-rotate" htmlFor="sidebarToggle">
          <input
            type="checkbox"
            id="sidebarToggle"
            name="sidebarToggle"
            checked={isSidebarOpen}
            onChange={toggleSidebar}
          />
          <Bars3Icon className="swap-off h-8 w-8 fill-current" />
          <XMarkIcon className="swap-on h-8 w-8" />
        </label>
        <div className="mx-2 flex-1 select-none px-2">
          <Link href="/dashboard">Kalamandir</Link>
        </div>
        <ProfilePage user={user} />
      </div>
      <div
        className="flex h-full w-full flex-grow flex-row overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`py-1.5 transition-all duration-500 max-sm:py-1.5 ${isSidebarOpen ? 'xl:w-1/7 h-full w-screen translate-x-0 rounded-e-2xl border-r border-neutral shadow-2xl max-sm:w-3/5 sm:w-2/4 md:w-1/3 lg:w-1/4 2xl:w-1/5' : 'w-0 -translate-x-full'}`}
        >
          <Sidebar />
        </div>
        <div
          className={`flex w-full flex-col flex-wrap transition-all duration-500 ${isSidebarOpen ? ' max-sm:w-2/5 max-sm:bg-base-200 max-sm:bg-transparent' : 'w-full'}`}
          onClick={() => window.innerWidth <= 640 && isSidebarOpen && setIsSidebarOpen(false)}
        >
          <div
            className={`h-full rounded-box border border-neutral p-1 shadow-2xl ${isSidebarOpen ? 'max-sm:pointer-events-none max-sm:blur-sm' : 'overflow-auto'}`}
          >
            <div className="flex h-full w-full flex-col overflow-y-auto">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
