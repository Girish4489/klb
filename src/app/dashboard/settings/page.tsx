'use client';
import SettingsProfile from '@/app/components/profile/SettingsProfile';
import ThemerPage from '@/app/components/themer/ThemerPage';
import { useUser } from '@/app/context/userContext';
import handleError from '@/app/util/error/handleError';
import { IUser } from '@/models/userModel';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useEffect, useState } from 'react';
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

  const updateFontPreferences = async (updatedFonts: Fonts) => {
    await toast
      .promise(
        (async () => {
          const res = await axios.post('/api/auth/fonts', { fonts: updatedFonts });
          if (res.data.success && res.data.fonts) {
            setFonts(res.data.fonts);
            updateUser({
              preferences: {
                fonts: res.data.fonts,
                theme: user.preferences?.theme ?? 'default',
              },
            });
            return res.data.message;
          } else {
            throw new Error(res.data.message);
          }
        })(),
        {
          loading: 'Updating font preferences...',
          success: (message: string) => <b>{message}</b>,
          error: (error: Error) => <b>{error.message}</b>,
        },
      )
      .catch(handleError.toastAndLog);
  };

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
