'use client';
import React, { useEffect, useState } from 'react';
import { themes, Theme, useTheme } from '../ThemeContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ThemerPage() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [saveTheme, setSaveTheme] = useState<string | null>(null);
  const changeTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme);
    setTheme(theme as Theme);
  };
  const handleThemeChange = async () => {
    const saveT = async () => {
      const response = await axios.post('/api/auth/theme-save', {
        theme: saveTheme,
      });
      setSelectedTheme(response.data.user.theme);
      if (response.data.success === true) {
        return response.data.message; // Resolve with success message
      } else {
        throw new Error(response.data.message); // Reject with error message
      }
    };
    try {
      await toast.promise(saveT(), {
        loading: 'Applying the selected theme...',
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });
    } catch (error: any) {
      // toast.error(error.response.data.message);
    }
  };

  const getTheme = async () => {
    try {
      const response = await axios.get('/api/auth/theme-save');
      setSelectedTheme(response.data.user.theme);
      document.documentElement.setAttribute('data-theme', response.data.user.theme);
    } catch (error: any) {
      // console.log(error);
    }
  };
  useEffect(() => {
    getTheme();
  }, []);

  return (
    <div className="flex flex-col items-center  rounded-box border border-base-100 p-2 shadow-2xl">
      <span className="m-2 p-2">Current Theme: {selectedTheme}</span>
      <form className="flex w-full flex-col items-end gap-3 max-sm:items-center">
        <div className="grid w-full grid-cols-2 gap-4 rounded-box sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {themes.map((themeOption) => (
            <div
              key={themeOption}
              className={`overflow-hidden rounded-lg border-base-content/20  outline outline-2 outline-offset-2 outline-transparent ${
                selectedTheme === themeOption
                  ? 'border-4 border-info bg-success p-1'
                  : 'border-4 hover:border-success/100 hover:bg-success/10 hover:shadow-2xl hover:transition-all hover:duration-300'
              }`}
              data-set-theme={themeOption}
              data-act-class="!outline-base-content"
            >
              <input
                type="hidden"
                name="theme"
                value={themeOption}
                onChange={(e) => setSaveTheme(e.target.value)}
                className="invisible h-0 w-0"
              />
              <div
                data-theme={themeOption}
                className="w-full cursor-pointer bg-base-100 font-sans text-base-content"
                onClick={() => {
                  changeTheme(themeOption);
                  setSaveTheme(themeOption);
                }}
              >
                <div className="grid grid-cols-5 grid-rows-3">
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
        <button className="btn btn-primary m-2" onClick={handleThemeChange}>
          Apply
        </button>
      </form>
    </div>
  );
}
