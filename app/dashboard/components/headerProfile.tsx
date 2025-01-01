'use client';
import LogoutButton from '@components/logout/LogoutButton';
import {
  CheckBadgeIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  SwatchIcon,
  UserCircleIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import { IUser } from '@models/userModel';
import { toast } from '@utils/toast/toast';
import { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { JSX } from 'react';

const LoadingSkeleton = (): JSX.Element => (
  <div className="dropdown dropdown-end">
    <div className="avatar btn btn-circle btn-ghost h-10 w-10">
      <div className="loading loading-spinner text-primary loading-sm rounded-full ring-2"></div>
    </div>
  </div>
);

const HeaderProfilePage = ({ user, isLoading }: { user: IUser | null; isLoading: boolean }): JSX.Element => {
  const profileImageSrc: string =
    user?.profileImage && user.profileImage.__filename !== 'USER_PROFILE_404_ERROR' && user.profileImage.data
      ? `data:${user.profileImage.contentType};base64,${user.profileImage?.data}`
      : '/klm.webp';

  if (isLoading) return <LoadingSkeleton />;

  if (!user) {
    return (
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="avatar btn btn-circle btn-ghost">
          <div className="ring-primary w-10 rounded-full ring-2">
            <Image src="/klm.webp" alt="Profile" width={40} height={40} style={{ imageRendering: 'auto' }} priority />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dropdown dropdown-end relative">
      <div tabIndex={0} role="button" className="avatar btn btn-circle btn-ghost">
        <div className="ring-primary w-10 rounded-full ring-2">
          <Image
            src={profileImageSrc}
            alt="Profile"
            width={40}
            height={40}
            style={{ imageRendering: 'auto' }}
            priority
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content menu-sm rounded-box bg-base-200 ring-primary absolute z-[var(--z-dropdown)] mt-3 w-auto gap-y-1 p-2 shadow-sm ring-1"
      >
        <span className="flex w-full justify-around">
          <Link
            href="/dashboard/settings#settingsProfile"
            className="ring-primary transform rounded-full ring-2 hover:scale-105"
          >
            <Image
              src={profileImageSrc}
              alt="profile image"
              className="cursor-pointer rounded-full"
              width="70"
              height="64"
              style={{ imageRendering: 'auto' }}
              priority
            />
          </Link>
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
          link="/dashboard/settings#themeBlock"
          liClass="grow w-full"
          tooltip="Theme"
        >
          <span className="badge badge-soft badge-secondary badge-sm">
            {(user.preferences?.theme ?? 'default').charAt(0).toUpperCase() +
              (user.preferences?.theme ?? 'default').slice(1)}
          </span>
        </ProfileItem>
        <ProfileItem
          icon={<Cog6ToothIcon className="text-primary h-5 w-5" />}
          label="Settings"
          tooltip="Settings"
          link="/dashboard/settings"
          liClass="grow w-full"
          enable={user.isCompanyMember ?? true}
        />
        <li className="tooltip tooltip-left tooltip-error flex hover:rounded-lg" data-tip="Logout">
          <LogoutButton variant="error" className="btn-sm font-bold" />
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
  <li className={`tooltip tooltip-left tooltip-info ${liClass}`} data-tip={tooltip}>
    {link && enable ? (
      <Link href={link as Route} className="flex w-full items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        {children}
      </Link>
    ) : link ? (
      <div
        className="flex w-full cursor-pointer items-center justify-between gap-2"
        onClick={() => toast.error('Need to have company access')}
      >
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        {children}
      </div>
    ) : (
      <div className="flex w-full items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        {children}
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
