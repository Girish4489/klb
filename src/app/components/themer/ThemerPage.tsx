'use client';
import { Theme, useTheme } from '@context/ThemeContext';
import { IUser } from '@models/userModel';
import handleError from '@utils/error/handleError';
import { toast } from '@utils/toast/toast';
import axios from 'axios';
import React, { Dispatch, JSX } from 'react';

export default function ThemerPage({
  user,
  setUserAction,
}: {
  user: IUser;
  setUserAction: Dispatch<React.SetStateAction<IUser>>;
}): JSX.Element {
  const { themes, currentTheme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = React.useState<string | null>(null);

  const handleThemeChange = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const saveThemeRequest = async (): Promise<ThemeResponse> => {
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
          setUserAction(
            (prevUser: IUser) =>
              ({
                ...prevUser,
                preferences: {
                  ...prevUser.preferences,
                  theme: selectedTheme ?? 'default',
                  fonts: prevUser.preferences?.fonts ?? { name: 'Roboto', weight: 400 },
                },
              }) as IUser,
          );
          return { message: response.data.message, theme: selectedTheme };
        } else {
          throw new Error(response.data.message);
        }
      };
      interface ThemeResponse {
        theme: string;
        message: string;
      }

      await toast.promise<ThemeResponse>(saveThemeRequest(), {
        loading: 'Applying the selected theme...',
        success: (message: ThemeResponse) => (
          <div>
            <h3>Theme: {message.theme}</h3>
            <b>{message.message}</b>
          </div>
        ),
        error: (error: Error) => <b>{error.message}</b>,
      });
    } catch (error) {
      handleError.toastAndLog(error);
    }
  };

  return (
    <div className="rounded-box border-base-100 flex  flex-col items-center border p-2 shadow-2xl">
      <form onSubmit={handleThemeChange} className="flex w-full flex-col items-end gap-3 max-sm:items-center">
        <div className="rounded-box grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {themes.map((themeOption) => (
            <div
              key={themeOption}
              onClick={() => {
                setSelectedTheme(themeOption);
                setTheme(themeOption);
              }}
              className="border-base-content/10 hover:border-base-content/60 overflow-hidden rounded-lg border-2"
            >
              <div className={`bg-base-100 text-base-content w-full cursor-pointer font-sans`} data-theme={themeOption}>
                <div className="rounded-box grid grid-cols-4 grid-rows-4">
                  <div className="indicator rounded-box col-span-4 col-start-1 row-span-1 row-start-1 w-full shadow-xl">
                    <span className="bg-primary/40 flex w-full flex-row items-center justify-around rounded-b">
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
                    className="tooltip tooltip-right border-error-content bg-base-100 col-span-1 col-start-1 row-span-1 row-start-2 border-r"
                    data-tip="base 100"
                  ></div>
                  <div
                    className="tooltip tooltip-right border-error-content bg-base-200 col-span-1 col-start-1 row-span-1 row-start-3 border-r"
                    data-tip="base 200"
                  ></div>
                  <div
                    className="tooltip tooltip-right border-error-content bg-base-300 col-span-1 col-start-1 row-span-1 row-start-4 border-r"
                    data-tip="base 300"
                  ></div>
                  <div className="tooltip tooltip-top col-span-3 col-start-2 row-span-3 row-start-2 flex flex-col items-center gap-1 p-2">
                    <div className="font-bold">{themeOption}</div>
                    <div className="flex flex-wrap gap-1">
                      <div className="bg-primary flex aspect-square w-5 items-center justify-center rounded-sm lg:w-6">
                        <div
                          className="tooltip tooltip-top text-primary-content font-bold text-sm"
                          data-tip={'Primary'}
                        >
                          A
                        </div>
                      </div>
                      <div className="bg-secondary flex aspect-square w-5 items-center justify-center rounded-sm lg:w-6">
                        <div
                          className="tooltip tooltip-top text-secondary-content font-bold text-sm"
                          data-tip={'secondary'}
                        >
                          A
                        </div>
                      </div>
                      <div className="bg-accent flex aspect-square w-5 items-center justify-center rounded-sm lg:w-6">
                        <div className="tooltip tooltip-top text-accent-content font-bold text-sm" data-tip={'accent'}>
                          A
                        </div>
                      </div>
                      <div className="bg-neutral flex aspect-square w-5 items-center justify-center rounded-sm lg:w-6">
                        <div
                          className="tooltip tooltip-top text-neutral-content font-bold text-sm"
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
