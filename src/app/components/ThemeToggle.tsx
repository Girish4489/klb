'use client';
import { useTheme } from '@context/ThemeContext';
import { Theme } from '@data/themes';
import { MoonIcon, SunIcon } from '@heroicons/react/16/solid';
import { JSX } from 'react';

export function ThemeToggle(): JSX.Element {
  const { currentTheme } = useTheme();

  return (
    <label className="toggle text-base-content h-7">
      <input
        type="checkbox"
        className="theme-controller"
        data-toggle-theme="dark,light"
        data-act-class="active"
        checked={currentTheme === Theme.Dark}
      />
      <SunIcon className="h-5 w-5 text-current" />
      <MoonIcon className="h-5 w-5 text-current" />
    </label>
  );
}
