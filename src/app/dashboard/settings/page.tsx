'use client';
import SettingsProfile from '@components/profile/SettingsProfile';
import ThemerPage from '@components/themer/ThemerPage';
import { useUser } from '@context/userContext';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { IUser } from '@models/userModel';
import handleError from '@util/error/handleError';
import { ApiPost } from '@util/makeApiRequest/makeApiRequest';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Fonts {
  name: string;
  weight: number;
}

export default function SettingsPage() {
  const { user, updateUser, setUser } = useUser() as {
    user: IUser;
    updateUser: (user: Partial<IUser>) => void;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
  };
  const [fonts, setFonts] = useState<Fonts>({ name: 'Roboto', weight: 400 });

  useEffect(() => {
    if (user.preferences?.fonts) {
      setFonts(user.preferences.fonts);
    }
  }, [user.preferences?.fonts]);

  useEffect(() => {
    document.body.style.fontFamily = fonts.name;
    document.body.style.fontWeight = fonts.weight.toString();
  }, [fonts]);

  const updatePreferences = async (updatedPreferences: Partial<IUser['preferences']>) => {
    await toast
      .promise(
        (async () => {
          const res = await ApiPost.User.updatePreferences(updatedPreferences);
          if (res.success && res.preferences) {
            updateUser({
              preferences: res.preferences,
            });
            return res.message;
          } else {
            throw new Error(res.message);
          }
        })(),
        {
          loading: 'Updating preferences...',
          success: (message: string) => <b>{message}</b>,
          error: (error: Error) => <b>{error.message}</b>,
        },
      )
      .catch(handleError.toastAndLog);
  };

  const updateFontPreferences = async (updatedFonts: Fonts) => {
    await updatePreferences({
      fonts: updatedFonts,
    });
  };

  const updateAnimationPreferences = async (enabled: boolean, intensity: number) => {
    await updatePreferences({
      animations: { enabled, intensity },
    });
  };

  const debouncedUpdateAnimation = useCallback(
    debounce((enabled: boolean, intensity: number) => {
      updateAnimationPreferences(enabled, intensity);
    }, 500),
    [],
  );

  return (
    <div className=" max-sm:m-2 md:m-5">
      <div className="join join-vertical w-full bg-base-200">
        <div className="collapse join-item collapse-arrow border border-base-300">
          <input type="checkbox" name="collapse" defaultChecked />
          <div className="collapse-title text-xl font-medium">User Profile</div>
          <div className="collapse-content">
            <SettingsProfile user={user} updateUser={updateUser} />
          </div>
        </div>

        {/* Theme Settings */}
        <div className="collapse join-item collapse-arrow border border-base-300">
          <input type="checkbox" name="collapse" defaultChecked />
          <div id="themeBlock" className="collapse-title text-xl font-medium">
            Theme
          </div>
          <div className="collapse-content m-2">
            <ThemerPage user={user} setUser={setUser} />
          </div>
        </div>

        {/* Font Settings */}
        <div id="font" className="collapse join-item collapse-arrow border border-base-300">
          <input type="checkbox" name="collapse" defaultChecked />
          <div className="collapse-title text-xl font-medium">Font Settings</div>
          <div className="collapse-content m-2">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between">
                <label htmlFor="fontNameSelect" className="label grow">
                  Select Font
                </label>
                <select
                  id="fontNameSelect"
                  name="fontNameSelect"
                  value={fonts.name}
                  onChange={(e) => updateFontPreferences({ name: e.target.value, weight: fonts.weight })}
                  className="select select-bordered select-primary select-sm min-w-40"
                >
                  <option value="Roboto">Roboto</option>
                  {/* Add other font options here */}
                </select>
              </div>
              <div className="flex flex-wrap items-center justify-between">
                <label htmlFor="fontWeightSelect" className="label grow">
                  Select Weight
                </label>
                <select
                  id="fontWeightSelect"
                  name="fontWeightSelect"
                  value={fonts.weight}
                  onChange={(e) => updateFontPreferences({ name: fonts.name, weight: parseInt(e.target.value) })}
                  className="select select-bordered select-primary select-sm min-w-40"
                >
                  {[100, 300, 400, 500, 700, 900].map((weight) => (
                    <option key={weight} value={weight}>
                      {weight}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => {
                  if (fonts.name !== 'Roboto' || fonts.weight !== 400) {
                    updateFontPreferences({ name: 'Roboto', weight: 400 });
                  } else {
                    toast('Already in default mode', {
                      icon: <InformationCircleIcon className="h-5 w-5 text-info" />,
                    });
                  }
                }}
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>

        {/* Animation Settings */}
        <div id="animation" className="collapse join-item collapse-arrow border border-base-300">
          <input type="checkbox" name="collapse" defaultChecked />
          <div className="collapse-title text-xl font-medium">Animation Settings</div>
          <div className="collapse-content m-2">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between">
                <label htmlFor="animationEnabled" className="label grow">
                  Enable Animations
                </label>
                <input
                  id="animationEnabled"
                  type="checkbox"
                  checked={user.preferences?.animations?.enabled ?? false}
                  onChange={(e) =>
                    updateAnimationPreferences(e.target.checked, user.preferences?.animations?.intensity ?? 10)
                  }
                  className="toggle toggle-primary"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between">
                <label htmlFor="animationIntensity" className="label grow">
                  Animation Intensity
                </label>
                <input
                  id="animationIntensity"
                  type="range"
                  min="1"
                  max="10"
                  value={user.preferences?.animations?.intensity ?? 1}
                  onChange={(e) => {
                    e.preventDefault();
                    const newIntensity = parseInt(e.target.value);
                    if (newIntensity !== user.preferences?.animations?.intensity) {
                      debouncedUpdateAnimation(user.preferences?.animations?.enabled ?? true, newIntensity);
                    }
                  }}
                  className="range range-primary"
                />
                <div className="flex w-full justify-between px-2 text-xs">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                  <span>8</span>
                  <span>9</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="collapse join-item collapse-arrow border border-base-300">
          <input type="checkbox" name="collapse" defaultChecked />
          <div className="collapse-title text-xl font-medium">Notification</div>
          <div className="collapse-content">
            <p>hello</p>
          </div>
        </div>
        <div className="collapse join-item collapse-arrow border border-base-300">
          <input type="checkbox" name="collapse" defaultChecked />
          <div className="collapse-title text-xl font-medium">Preferences</div>
          <div className="collapse-content">
            <p>hello</p>
          </div>
        </div>
      </div>
    </div>
  );
}
