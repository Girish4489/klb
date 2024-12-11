'use client';
import navigationData, { NavItem, SubNavItem } from '@data/navigationData';
import { ChartBarIcon, Cog6ToothIcon, HomeIcon } from '@heroicons/react/24/solid';

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
    className={`tooltip flex w-full flex-row ${isActive ? 'active' : ''} ${!enable ? 'cursor-pointer' : ''}`}
    data-tip={title}
    onClick={() => !enable && toast.error('Need to have company access')}
  >
    {enable ? (
      <Link href={href} className="flex items-center">
        {icon && React.createElement(icon, { className: iconClass })}
        <span className="text-left">{title}</span>
      </Link>
    ) : (
      <>
        {icon && React.createElement(icon, { className: iconClass })}
        <span className="text-left">{title}</span>
      </>
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
        <ul>
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
      <div className="flex h-full w-full flex-col justify-around overflow-hidden transition-all duration-300 ease-in-out max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:top-0 max-sm:z-50">
        <div className="mx-1 mb-3 h-full overflow-y-auto rounded-box">
          <ul className="menu rounded-box bg-base-200 shadow-xl xl:menu-vertical lg:min-w-max">
            <h1 className="menu-title select-none text-center">Kalamndir</h1>
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
          </ul>
        </div>
        <div className="bottom-0 flex flex-col items-center justify-center rounded-box border-neutral">
          <ul className="menu menu-horizontal my-2 flex-wrap rounded-box bg-base-200 shadow-2xl max-sm:menu-vertical">
            <li>
              <Link href="/dashboard" className="tooltip flex max-sm:flex-row" data-tip="Dashboard">
                <HomeIcon className="h-5 w-5 text-secondary" />
                <span className="hidden max-sm:inline-block">Dashboard</span>
              </Link>
            </li>
            <li>
              {isCompanyMember ? (
                <Link href="/dashboard/settings" className="tooltip flex max-sm:flex-row" data-tip="Settings">
                  <Cog6ToothIcon className="h-5 w-5 text-secondary" />
                  <span className="hidden max-sm:inline-block">Settings</span>
                </Link>
              ) : (
                <div
                  className="tooltip flex cursor-pointer max-sm:flex-row"
                  data-tip="Settings"
                  onClick={() => toast.error('Need to have company access')}
                >
                  <Cog6ToothIcon className="h-5 w-5 text-secondary" />
                  <span className="hidden max-sm:inline-block">Settings</span>
                </div>
              )}
            </li>
            <li>
              <Link href="#k" className="tooltip flex max-sm:flex-row" data-tip="Stats">
                <ChartBarIcon className="h-5 w-5 text-secondary" />
                <span className="hidden max-sm:inline-block">Stats</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
}
