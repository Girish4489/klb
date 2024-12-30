'use client';
import { useTheme } from '@/app/context/ThemeContext';
import { Theme } from '@data/themes';
import { MoonIcon, SunIcon } from '@heroicons/react/16/solid';
import { JSX } from 'react';

export function ThemeToggle(): JSX.Element {
  const { currentTheme, toggleTheme } = useTheme();

  return (
    <label className="toggle text-base-content h-7">
      <input
        type="checkbox"
        checked={currentTheme === Theme.Dark}
        onChange={toggleTheme}
        className="theme-controller"
      />
      <SunIcon className={`h-5 w-5 text-current`} />
      <MoonIcon className="h-5 w-5 text-current" />
    </label>
  );
}
