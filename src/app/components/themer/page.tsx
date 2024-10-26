'use client';
import { Theme, useTheme } from '@/app/context/ThemeContext';
import { useUser } from '@/app/context/userContext';
import handleError from '@/app/util/error/handleError';
import axios from 'axios';
import React from 'react';
import toast from 'react-hot-toast';

export default function ThemerPage() {
  const { themes, currentTheme, setTheme } = useTheme();
  const { user, setUser } = useUser();
  const [selectedTheme, setSelectedTheme] = React.useState<string | null>(null);

  const handleThemeChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const saveThemeRequest = async () => {
        if (user.preferences?.theme === selectedTheme) {
          throw new Error('Theme already applied.\n Please select a different theme');
        }
        if (!selectedTheme) {
          throw new Error('Please select a theme');
        }

        const response = await axios.post('/api/auth/theme-save', {
          theme: selectedTheme,
        });
        if (response.data.success) {
          setTheme(selectedTheme as Theme);
          setUser({
            ...user,
            preferences: {
              theme: selectedTheme ?? 'default',
              fonts: user.preferences?.fonts,
            },
          });
          return { message: response.data.message, theme: selectedTheme };
        } else {
          throw new Error(response.data.message);
        }
      };
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
    } catch (error) {
      // toast.error(error.response.data.message);
      handleError.toastAndLog(error);
    }
  };

  return (
    <div className="flex flex-col items-center  rounded-box border border-base-100 p-2 shadow-2xl">
      <form onSubmit={handleThemeChange} className="flex w-full flex-col items-end gap-3 max-sm:items-center">
        <div className="grid w-full grid-cols-2 gap-4 rounded-box sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {themes.map((themeOption) => (
            <div
              key={themeOption}
              onClick={() => {
                setSelectedTheme(themeOption);
                setTheme(themeOption);
              }}
              className="overflow-hidden rounded-lg border-2 border-base-content/10 hover:border-base-content/60"
            >
              <div className={`w-full cursor-pointer bg-base-100 font-sans text-base-content`} data-theme={themeOption}>
                <div className="grid grid-cols-4 grid-rows-4 rounded-box">
                  <div className="indicator col-span-4 col-start-1 row-span-1 row-start-1 w-full rounded-box shadow-xl">
                    <span className="flex w-full flex-row items-center justify-around rounded-b bg-primary/40">
                      {user.preferences?.theme === themeOption && (
                        <span className="badge indicator-item badge-success indicator-center indicator-middle">
                          Applied
                        </span>
                      )}
                      {user.preferences?.theme !== themeOption &&
                        themeOption === currentTheme &&
                        currentTheme === selectedTheme && (
                          <span className="badge indicator-item badge-info indicator-center indicator-middle">
                            Selected (unsaved!)
                          </span>
                        )}
                    </span>
                  </div>

                  <div
                    className="tooltip tooltip-right col-span-1 col-start-1 row-span-1 row-start-2 border-r border-error-content bg-base-100"
                    data-tip="base 100"
                  ></div>
                  <div
                    className="tooltip tooltip-right col-span-1 col-start-1 row-span-1 row-start-3 border-r border-error-content bg-base-200"
                    data-tip="base 200"
                  ></div>
                  <div
                    className="tooltip tooltip-right col-span-1 col-start-1 row-span-1 row-start-4 border-r border-error-content bg-base-300"
                    data-tip="base 300"
                  ></div>
                  <div className="tooltip tooltip-top col-span-3 col-start-2 row-span-3 row-start-2 flex flex-col items-center gap-1 p-2">
                    <div className="font-bold">{themeOption}</div>
                    <div className="flex flex-wrap gap-1">
                      <div className="flex aspect-square w-5 items-center justify-center rounded bg-primary lg:w-6">
                        <div
                          className="tooltip tooltip-top text-sm font-bold text-primary-content"
                          data-tip={'Primary'}
                        >
                          A
                        </div>
                      </div>
                      <div className="flex aspect-square w-5 items-center justify-center rounded bg-secondary lg:w-6">
                        <div
                          className="tooltip tooltip-top text-sm font-bold text-secondary-content"
                          data-tip={'secondary'}
                        >
                          A
                        </div>
                      </div>
                      <div className="flex aspect-square w-5 items-center justify-center rounded bg-accent lg:w-6">
                        <div className="tooltip tooltip-top text-sm font-bold text-accent-content" data-tip={'accent'}>
                          A
                        </div>
                      </div>
                      <div className="flex aspect-square w-5 items-center justify-center rounded bg-neutral lg:w-6">
                        <div
                          className="tooltip tooltip-top text-sm font-bold text-neutral-content"
                          data-tip={'nuetral'}
                        >
                          A
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{' '}
              </div>
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-primary m-2">
          Apply
        </button>
      </form>
    </div>
  );
}
