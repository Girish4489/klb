'use client';
import { useTheme } from '@context/ThemeContext';
import { Theme } from '@data/themes';
import { CheckCircleIcon, MagnifyingGlassCircleIcon } from '@heroicons/react/24/solid';
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
  const { themes, setTheme } = useTheme();
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
            <h3>Theme: {message.theme.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</h3>
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
    <form onSubmit={handleThemeChange} className="flex w-full flex-col items-end gap-3 pt-4 max-sm:items-center">
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {themes.map((themeOption) => {
          const isApplied = user.preferences?.theme === themeOption;
          const isSelected = themeOption === selectedTheme;

          return (
            <div
              key={themeOption}
              onClick={() => {
                setSelectedTheme(themeOption);
                setTheme(themeOption);
              }}
              data-theme={themeOption}
              data-set-theme={themeOption}
              data-act-class="active"
              className={`
                transform overflow-hidden rounded-lg border-2 transition-all duration-200
                ${isSelected ? 'ring-primary scale-105 ring-2' : 'hover:scale-102'}
                ${isApplied ? 'border-success/50' : 'border-base-content/10 hover:border-base-content/60'}
              `}
            >
              <div className={`bg-base-100 text-base-content w-full cursor-pointer font-sans`} data-theme={themeOption}>
                <div className="rounded-box grid grid-cols-4 grid-rows-4">
                  <div className="badge-primary badge badge-sm badge-soft indicator rounded-box col-span-4 col-start-1 row-span-1 row-start-1 flex min-h-[2rem] w-full items-center justify-center shadow-sm">
                    {isApplied || isSelected ? (
                      <span className="flex w-full flex-row items-center justify-around rounded-b">
                        {isApplied && (
                          <span className="badge badge-success badge-sm gap-1 py-3">
                            <CheckCircleIcon className="h-4 w-4" />
                            Applied
                          </span>
                        )}
                        {!isApplied && isSelected && (
                          <span className="badge badge-primary badge-sm gap-1 py-3">
                            <MagnifyingGlassCircleIcon className="h-4 w-4" />
                            Preview
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="h-[2rem]" />
                    )}
                  </div>
                  <div
                    className="tooltip tooltip-right tooltip-info bg-base-100 col-span-1 col-start-1 row-span-1 row-start-2"
                    data-tip="base 100"
                  />
                  <div
                    className="tooltip tooltip-right tooltip-info bg-base-200 col-span-1 col-start-1 row-span-1 row-start-3"
                    data-tip="base 200"
                  />
                  <div
                    className="tooltip tooltip-right tooltip-info bg-base-300 col-span-1 col-start-1 row-span-1 row-start-4"
                    data-tip="base 300"
                  />
                  <div className="tooltip tooltip-top col-span-3 col-start-2 row-span-3 row-start-2 flex flex-col items-center justify-center gap-1 p-2">
                    <div className={`font-bold ${isApplied ? 'text-success' : ''}`}>
                      {themeOption.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <div className="bg-primary flex aspect-square w-5 items-center justify-center rounded-sm lg:w-6">
                        <div
                          className="tooltip tooltip-top tooltip-info text-primary-content font-bold text-sm"
                          data-tip={'Primary'}
                        >
                          A
                        </div>
                      </div>
                      <div className="bg-secondary flex aspect-square w-5 items-center justify-center rounded-sm lg:w-6">
                        <div
                          className="tooltip tooltip-top tooltip-info text-secondary-content font-bold text-sm"
                          data-tip={'secondary'}
                        >
                          A
                        </div>
                      </div>
                      <div className="bg-accent flex aspect-square w-5 items-center justify-center rounded-sm lg:w-6">
                        <div
                          className="tooltip tooltip-top tooltip-info text-accent-content font-bold text-sm"
                          data-tip={'accent'}
                        >
                          A
                        </div>
                      </div>
                      <div className="bg-neutral flex aspect-square w-5 items-center justify-center rounded-sm lg:w-6">
                        <div
                          className="tooltip tooltip-top tooltip-info text-neutral-content font-bold text-sm"
                          data-tip={'nuetral'}
                        >
                          A
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="divider my-1" />
      <div className="flex gap-2 self-end">
        <button
          type="button"
          className={`btn ${selectedTheme ? 'btn-warning' : 'btn-disabled'}`}
          onClick={() => {
            setTheme((user.preferences?.theme as Theme) || 'default');
            setSelectedTheme(null);
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`btn ${!selectedTheme || selectedTheme === user.preferences?.theme ? 'btn-disabled' : 'btn-error'}`}
        >
          {selectedTheme === user.preferences?.theme ? 'Already Applied' : 'Apply Theme'}
        </button>
      </div>
    </form>
  );
}
