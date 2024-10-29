'use client';
import navigationData, { NavItem, SubNavItem } from '@/../../data/navigationData';
import { ChartBarIcon, Cog6ToothIcon, HomeIcon } from '@heroicons/react/24/solid';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const SidebarLink = ({
  href,
  title,
  isActive,
  icon,
  iconClass,
}: {
  href: string;
  title: string;
  isActive: boolean;
  icon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  iconClass?: string;
}) => (
  <Link href={href} className={`tooltip flex w-full flex-row ${isActive ? 'active' : ''}`} data-tip={title}>
    {icon && React.createElement(icon, { className: iconClass })}
    <span className="text-left">{title}</span>
  </Link>
);

const SidebarItem = ({ nav, currentPathname }: { nav: NavItem; currentPathname: string }) => (
  <li className={`${nav.enable ? '' : 'disabled hidden disabled:cursor-not-allowed'}`}>
    <details>
      <summary>
        {nav.icon && <nav.icon className={nav.iconClass} />}
        {nav.title}
      </summary>
      <ul>
        {nav.subNav.map((subNav: SubNavItem, index) => (
          <li key={index} className={`${subNav.enable ? '' : 'disabled hidden disabled:cursor-not-allowed'}`}>
            {subNav.enable && nav.enable ? (
              <SidebarLink
                href={subNav.href ?? '#'}
                title={subNav.title}
                isActive={currentPathname === subNav.href}
                icon={subNav.icon}
                iconClass={subNav.iconClass}
              />
            ) : (
              <span>
                {subNav.icon && <subNav.icon className={subNav.iconClass} />}
                <span className="text-left">{subNav.title}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </details>
  </li>
);

export default function SidebarPage() {
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
            {navigationData.map((nav: NavItem, index) => (
              <SidebarItem key={index} nav={nav} currentPathname={currentPathname} />
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
              <Link href="/dashboard/settings" className="tooltip flex max-sm:flex-row" data-tip="Settings">
                <Cog6ToothIcon className="h-5 w-5 text-secondary" />
                <span className="hidden max-sm:inline-block">Settings</span>
              </Link>
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
