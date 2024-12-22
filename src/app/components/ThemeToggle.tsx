'use client';
import { Theme, useTheme } from '@/app/context/ThemeContext';
import { MoonIcon, SunIcon } from '@heroicons/react/16/solid';
import { JSX } from 'react';

export function ThemeToggle(): JSX.Element {
  const { currentTheme, toggleTheme } = useTheme();

  return (
    <label className="grid h-7 cursor-pointer place-items-center">
      <input
        type="checkbox"
        checked={currentTheme === Theme.Dark}
        onChange={toggleTheme}
        className="theme-controller toggle col-span-2 col-start-1 row-start-1 h-full w-14 items-center rounded-full bg-base-content"
      />
      <SunIcon className={`col-start-1 row-start-1 h-5 w-5 items-center p-px text-base-100`} />
      <MoonIcon className="col-start-2 row-start-1 h-5 w-5 items-center p-px text-base-100" />
    </label>
  );
}
