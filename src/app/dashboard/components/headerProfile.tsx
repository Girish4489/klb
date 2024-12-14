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
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { toast } from 'react-hot-toast';

const LoadingSkeleton = () => (
  <div className="avatar placeholder">
    <div className="bg-neutral-focus w-12 rounded-full text-neutral-content">
      <span className="loading loading-spinner loading-sm"></span>
    </div>
  </div>
);

const HeaderProfilePage = ({ user, isLoading }: { user: IUser | null; isLoading: boolean }) => {
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
          <div className="h-8 w-8 rounded-full ring-2 ring-primary">
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
          className="menu dropdown-content menu-sm z-50 w-auto gap-y-1 rounded-box bg-base-200 p-2 shadow ring-1 ring-primary"
        >
          <span className="flex w-full justify-around">
            <div className="transform rounded-full ring-2 ring-primary hover:scale-105">
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
          <ProfileItem icon={<UserIcon className="h-5 w-5 text-primary" />} label={user.username} tooltip="Username">
            {!user.isCompanyMember && <span className="badge badge-primary">New</span>}
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
              {(user.preferences?.theme ?? 'default').charAt(0).toUpperCase() +
                (user.preferences?.theme ?? 'default').slice(1)}
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
            enable={user.isCompanyMember ?? true}
          />
          <li
            className="tooltip tooltip-left flex text-warning hover:rounded-lg hover:bg-error hover:font-medium hover:text-warning-content"
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
}) => (
  <li className={`tooltip tooltip-left ${liClass}`} data-tip={tooltip}>
    {link && enable ? (
      <Link href={link} className={`flex items-center`}>
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

export default HeaderProfilePage;
