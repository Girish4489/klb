'use client';
import LogoutButton from '@components/logout/LogoutButton';
import {
  CheckBadgeIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  SwatchIcon,
  UserCircleIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import { IUser } from '@models/userModel';
import { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React, { JSX } from 'react';
import { toast } from 'react-hot-toast';

const LoadingSkeleton = (): JSX.Element => (
  <div className="avatar placeholder">
    <div className="bg-neutral-focus text-neutral-content w-12 rounded-full">
      <span className="loading loading-spinner loading-sm"></span>
    </div>
  </div>
);

const HeaderProfilePage = ({ user, isLoading }: { user: IUser | null; isLoading: boolean }): JSX.Element => {
  const profileImageSrc =
    user?.profileImage && user.profileImage.__filename !== 'USER_PROFILE_404_ERROR' && user.profileImage.data
      ? `data:${user.profileImage.contentType};base64,${user.profileImage?.data}`
      : '/klm.webp';

  if (isLoading) return <LoadingSkeleton />;

  if (!user) {
    return (
      <div className="dropdown dropdown-end h-8">
        <div tabIndex={0} role="button" className="avatar btn btn-circle btn-ghost btn-sm">
          <div className="w-8 rounded-full">
            <Image src="/klm.webp" alt="Profile" width="32" height="32" className="rounded-full" priority />
          </div>
        </div>
      </div>
    );
  }

  return (
    <span className="my-auto flex items-center pt-1.5">
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="avatar btn btn-circle btn-ghost btn-sm my-auto grow">
          <div className="ring-primary h-8 w-8 rounded-full ring-2">
            <Image
              src={profileImageSrc}
              alt="Profile"
              className="w-8"
              width={32}
              height={32}
              style={{ imageRendering: 'auto' }}
              priority
            />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu dropdown-content menu-sm rounded-box bg-base-200 ring-primary z-50 w-auto gap-y-1 p-2 shadow-sm ring-1"
        >
          <span className="flex w-full justify-around">
            <div className="ring-primary transform rounded-full ring-2 hover:scale-105">
              <Image
                src={profileImageSrc}
                alt="profile image"
                className="cursor-pointer rounded-full"
                width="70"
                height="64"
                style={{ imageRendering: 'auto' }}
                priority
              />
            </div>
          </span>
          <ProfileItem
            icon={<UserIcon className="text-primary h-5 w-5" />}
            label={user.username}
            liClass="grow w-full"
            tooltip="Username"
          >
            {!user.isCompanyMember && <span className="badge badge-primary">New</span>}
          </ProfileItem>
          <ProfileItem icon={<EnvelopeIcon className="text-primary h-5 w-5" />} label={user.email} tooltip="Email" />
          <ProfileItem
            icon={<CheckBadgeIcon className="text-primary h-5 w-5" />}
            label="Verified"
            tooltip="Verified"
            liClass="flex"
          >
            <StatusIcon isTrue={user.isVerified} />
          </ProfileItem>
          <ProfileItem
            icon={<UserCircleIcon className="text-primary h-5 w-5" />}
            label="Admin"
            liClass="grow w-full"
            tooltip="Admin"
          >
            <StatusIcon isTrue={user.isAdmin} />
          </ProfileItem>
          <ProfileItem
            icon={<SwatchIcon className="text-primary h-5 w-5" />}
            label="Theme"
            liClass="grow w-full"
            tooltip="Theme"
          >
            <Link
              href="/dashboard/settings#themeBlock"
              className="tooltip tooltip-top rounded-box bg-primary text-primary-content flex flex-row gap-2 pl-2 pr-1 font-medium"
              data-tip="edit theme"
            >
              {(user.preferences?.theme ?? 'default').charAt(0).toUpperCase() +
                (user.preferences?.theme ?? 'default').slice(1)}
              <span className="badge badge-secondary">
                <PencilSquareIcon className="h-5 w-5" />
              </span>
            </Link>
          </ProfileItem>
          <ProfileItem
            icon={<Cog6ToothIcon className="text-primary h-5 w-5" />}
            label="Settings"
            tooltip="Settings"
            link="/dashboard/settings"
            liClass="grow w-full"
            enable={user.isCompanyMember ?? true}
          />
          <li
            className="tooltip tooltip-left text-warning hover:bg-error hover:text-warning-content flex hover:rounded-lg hover:font-medium"
            data-tip="Logout"
          >
            <LogoutButton variant="error" className="btn-sm" />
          </li>
        </ul>
      </div>
    </span>
  );
};

const ProfileItem = ({
  icon,
  label,
  tooltip,
  liClass,
  children,
  link,
  enable = true,
}: {
  icon: React.ReactNode;
  label: string;
  tooltip: string;
  liClass?: string;
  children?: React.ReactNode;
  link?: string;
  enable?: boolean;
}): JSX.Element => (
  <li className={`tooltip tooltip-left ${liClass}`} data-tip={tooltip}>
    {link && enable ? (
      <Link href={link as Route} className={`flex items-center`}>
        {icon}
        <span className="justify-between">
          {label}
          {children}
        </span>
      </Link>
    ) : link ? (
      <div className="flex cursor-pointer items-center" onClick={() => toast.error('Need to have company access')}>
        {icon}
        <span className="flex grow justify-between">
          {label}
          {children}
        </span>
      </div>
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

const StatusIcon = ({ isTrue }: { isTrue: boolean }): JSX.Element => (
  <span
    className={`tooltip tooltip-left items-center ${isTrue ? 'tooltip-success' : 'tooltip-error'}`}
    data-tip={isTrue ? 'Verified' : 'Not Verified'}
  >
    {isTrue ? (
      <CheckBadgeIcon className="text-success h-5 w-5" />
    ) : (
      <ExclamationCircleIcon className="text-error h-5 w-5" />
    )}
  </span>
);

export default HeaderProfilePage;
