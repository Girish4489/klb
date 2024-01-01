'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Theme, themes, useTheme } from '../ThemeContext';

export default function ThemerPage() {
  const { theme, setTheme } = useTheme();
  const [appliedTheme, setAppliedTheme] = useState<string>('dark');
  const [currentTheme, setCurrentTheme] = useState<string>('');

  const changeTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme);
    setTheme(theme as Theme);
  };

  const handleThemeChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const saveTheme = currentTheme;
    const saveThemeRequest = async () => {
      if (saveTheme === appliedTheme) {
        throw new Error('Theme already applied.\n Please select a different theme');
      }
      if (!saveTheme) {
        throw new Error('Please select a theme');
      }

      const response = await axios.post('/api/auth/theme-save', {
        theme: saveTheme,
      });

      if (response.data.success === true) {
        return { message: response.data.message, theme: response.data.user.theme };
      } else {
        throw new Error(response.data.message); // Reject with error message
      }
    };
    try {
      await toast.promise(saveThemeRequest(), {
        loading: 'Applying the selected theme...',
        success: (message) => (
          <div>
            <h3>Theme: {message.theme}</h3>
            <b>{message.message}</b>
          </div>
        ),
        error: (error) => <b>{error.message}</b>,
      });
      setAppliedTheme(currentTheme);
    } catch (error: any) {
      // toast.error(error.response.data.message);
    }
  };

  const getTheme = async () => {
    try {
      const response = await axios.get('/api/auth/theme-save');
      document.documentElement.setAttribute('data-theme', response.data.user.theme);
      setAppliedTheme(response.data.user.theme || 'dark');
    } catch (error: any) {
      // console.log(error);
    }
  };
  useEffect(() => {
    getTheme();
  }, []);

  return (
    <div className="flex flex-col items-center  rounded-box border border-base-100 p-2 shadow-2xl">
      <form onSubmit={handleThemeChange} className="flex w-full flex-col items-end gap-3 max-sm:items-center">
        <div className="grid w-full grid-cols-2 gap-4 rounded-box sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {themes.map((themeOption) => (
            <div
              key={themeOption}
              className={`overflow-hidden rounded-lg border-base-content/20  outline outline-2 outline-offset-2 outline-transparent`}
              data-theme={themeOption}
              data-act-class="!outline-base-content"
            >
              <input
                type="hidden"
                id={themeOption}
                name={themeOption}
                onChange={() => {
                  setCurrentTheme(themeOption);
                }}
                required
                className="invisible h-0 w-0"
              />
              <div
                className={`w-full cursor-pointer bg-base-100 font-sans text-base-content`}
                onClick={() => {
                  changeTheme(themeOption);
                  setCurrentTheme(themeOption);
                }}
              >
                <div className="indicator w-full">
                  {appliedTheme === themeOption && (
                    <span className="badge indicator-item badge-success indicator-center indicator-top -mt-1.5">
                      Applied
                    </span>
                  )}
                  {currentTheme === themeOption && appliedTheme !== themeOption && (
                    <span className="badge indicator-item badge-primary indicator-center indicator-top -mt-1.5">
                      Selected(unsaved!)
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-5 grid-rows-3" data-set-theme={themeOption}>
                  <div className="col-start-1 row-span-2 row-start-1 bg-base-200"></div>{' '}
                  <div className="col-start-1 row-start-3 bg-base-300"></div>{' '}
                  <div className="col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 bg-base-100 p-2">
                    <div className="font-bold">{themeOption}</div>{' '}
                    <div className="flex flex-wrap gap-1">
                      <div className="flex aspect-square w-5 items-center justify-center rounded bg-primary lg:w-6">
                        <div className="text-sm font-bold text-primary-content">A</div>
                      </div>{' '}
                      <div className="flex aspect-square w-5 items-center justify-center rounded bg-secondary lg:w-6">
                        <div className="text-sm font-bold text-secondary-content">A</div>
                      </div>{' '}
                      <div className="flex aspect-square w-5 items-center justify-center rounded bg-accent lg:w-6">
                        <div className="text-sm font-bold text-accent-content">A</div>
                      </div>{' '}
                      <div className="flex aspect-square w-5 items-center justify-center rounded bg-neutral lg:w-6">
                        <div className="text-sm font-bold text-neutral-content">A</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>{' '}
            </div>
          ))}
        </div>
        <button className="btn btn-primary m-2">Apply</button>
      </form>
    </div>
  );
}
