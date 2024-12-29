'use client';
import navigationData, { NavItem, SubNavItem } from '@data/navigationData';
import { Cog6ToothIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Cog6ToothIcon as Cog6ToothIconSolid, HomeIcon as HomeIconSolid } from '@heroicons/react/24/solid';
import { Route } from 'next';

import { toast } from '@utils/toast/toast';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { JSX } from 'react';

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
}): JSX.Element => (
  <div
    className={`tooltip tooltip-bottom rounded-box flex p-0 ${!enable ? 'cursor-pointer' : ''}`}
    data-tip={title}
    onClick={() => !enable && toast.error('Need to have company access')}
  >
    {enable ? (
      <Link
        href={href as Route}
        className={`rounded-box flex grow items-center gap-2 px-3 py-2 ${isActive ? 'active bg-neutral/60 font-medium' : ''}`}
      >
        {icon && React.createElement(icon, { className: iconClass })}
        <span className="grow text-left">{title}</span>
      </Link>
    ) : (
      <span
        className={`rounded-box flex grow items-center gap-1 px-4 py-2 ${isActive ? 'active bg-neutral/60 font-medium' : ''}`}
      >
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
}): JSX.Element => {
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
        <ul className="flex flex-col gap-1">
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
}): JSX.Element {
  const currentPathname = usePathname();

  return (
    <React.Fragment>
      <div className="bg-base-100 border-base-200 flex min-h-full w-72 flex-col border-r">
        <div className="bg-base-100 sticky top-0 z-20 px-4 py-3 shadow-sm">
          <h1 className="from-primary via-secondary to-accent bg-gradient-to-r bg-clip-text text-center font-bold text-xl text-transparent">
            Kalamandir
          </h1>
        </div>

        <ul className="menu menu-md w-full flex-1 gap-1 px-2 py-3">
          <li>
            <SidebarLink
              href="/dashboard"
              title="Dashboard"
              isActive={currentPathname === '/dashboard'}
              icon={currentPathname === '/dashboard' ? HomeIconSolid : HomeIcon}
              iconClass="text-secondary h-5 w-5"
              enable={isCompanyMember}
            />
          </li>

          {isCompanyMember &&
            navigationData.map((nav: NavItem, index) => (
              <SidebarItem key={index} nav={nav} currentPathname={currentPathname} accessLevels={accessLevels} />
            ))}

          <li>
            <SidebarLink
              href="/dashboard/settings"
              title="Settings"
              isActive={currentPathname === '/dashboard/settings'}
              icon={currentPathname === '/dashboard/settings' ? Cog6ToothIconSolid : Cog6ToothIcon}
              iconClass="text-secondary h-5 w-5"
              enable={isCompanyMember}
            />
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
}
