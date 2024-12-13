'use client';
import navigationData, { NavItem, SubNavItem } from '@data/navigationData';
import { Cog6ToothIcon, HomeIcon } from '@heroicons/react/24/solid';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

const SidebarLink = ({
  href,
  title,
  isActive,
  icon,
  iconClass,
  enable = true,
}: {
  href: string;
  title: string;
  isActive: boolean;
  icon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  iconClass?: string;
  enable?: boolean;
}) => (
  <div
    className={`tooltip flex w-full flex-row p-0 ${isActive ? 'active' : ''} ${!enable ? 'cursor-pointer' : ''}`}
    data-tip={title}
    onClick={() => !enable && toast.error('Need to have company access')}
  >
    {enable ? (
      <Link href={href} className="flex grow items-center gap-1 px-4 py-1.5">
        {icon && React.createElement(icon, { className: iconClass })}
        <span className="grow text-left">{title}</span>
      </Link>
    ) : (
      <span className="flex grow items-center gap-1 px-4 py-1.5">
        {icon && React.createElement(icon, { className: iconClass })}
        <span className="grow text-left">{title}</span>
      </span>
    )}
  </div>
);

const SidebarItem = ({
  nav,
  currentPathname,
  accessLevels,
}: {
  nav: NavItem;
  currentPathname: string;
  accessLevels: string[];
}) => {
  const isActive = nav.subNav.some((subNav) => currentPathname === subNav.href && subNav.enable);
  const NavIcon = isActive ? nav.iconSolid : nav.iconOutline;

  return (
    <li
      className={`${nav.enable && nav.accessLevels.some((level) => accessLevels.includes(level)) ? '' : 'disabled hidden disabled:cursor-not-allowed'}`}
    >
      <details open={isActive}>
        <summary>
          {NavIcon && <NavIcon className={nav.iconClass} />}
          {nav.title}
        </summary>
        <ul className="flex flex-col gap-px">
          {nav.subNav.map((subNav: SubNavItem, index) => {
            const SubNavIcon = currentPathname === subNav.href ? subNav.iconSolid : subNav.iconOutline;
            return (
              <li
                key={index}
                className={`${subNav.enable && subNav.accessLevels.some((level) => accessLevels.includes(level)) ? '' : 'disabled hidden disabled:cursor-not-allowed'}`}
              >
                <SidebarLink
                  href={subNav.href ?? '#'}
                  title={subNav.title}
                  isActive={currentPathname === subNav.href}
                  icon={SubNavIcon}
                  iconClass={subNav.iconClass}
                  enable={subNav.enable && nav.enable}
                />
              </li>
            );
          })}
        </ul>
      </details>
    </li>
  );
};

export default function SidebarPage({
  accessLevels,
  isCompanyMember,
}: {
  accessLevels: Array<string>;
  isCompanyMember: boolean;
}) {
  const currentPathname = usePathname();

  return (
    <React.Fragment>
      <div className="flex min-h-full flex-col bg-base-300 pr-px">
        <span className="menu-title sticky top-0 z-10 h-11 rounded-b-box bg-gradient-to-t from-base-100 via-base-300 to-base-200 ring-1">
          <h1 className="flex w-full select-none items-center justify-center bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text py-1 text-center text-base font-bold text-transparent">
            Kalamandir
          </h1>
        </span>
        <ul className="menu menu-sm min-w-72 flex-grow overflow-y-auto rounded-box rounded-b-box bg-gradient-to-tr from-base-300 via-base-200 to-base-300 text-base-content shadow-xl ring-1 ring-neutral xl:menu-vertical lg:min-w-max">
          <li>
            <Link href="/dashboard" className={currentPathname === '/dashboard' ? 'active' : ''}>
              <HomeIcon className="h-5 w-5 text-secondary" />
              Dashboard
            </Link>
          </li>

          {isCompanyMember &&
            navigationData.map((nav: NavItem, index) => (
              <SidebarItem key={index} nav={nav} currentPathname={currentPathname} accessLevels={accessLevels} />
            ))}

          <li>
            {isCompanyMember ? (
              <Link href="/dashboard/settings" className="tooltip flex max-sm:flex-row" data-tip="Settings">
                <Cog6ToothIcon className="h-5 w-5 text-secondary" />
                Settings
              </Link>
            ) : (
              <div
                className="tooltip flex cursor-pointer max-sm:flex-row"
                data-tip="Settings"
                onClick={() => toast.error('Need to have company access')}
              >
                <Cog6ToothIcon className="h-5 w-5 text-secondary" />
                Settings
              </div>
            )}
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
}
