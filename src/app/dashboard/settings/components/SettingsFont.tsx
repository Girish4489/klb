'use client';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { IUser } from '@models/userModel';
import { JSX, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Fonts {
  name: string;
  weight: number;
}

export default function SettingsFont({
  user,
  updatePreferences,
}: {
  user: IUser;
  updatePreferences: (preferences: Partial<IUser['preferences']>) => Promise<void>;
}): JSX.Element {
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

  const updateFontPreferences = async (updatedFonts: Fonts): Promise<void> => {
    await updatePreferences({
      fonts: updatedFonts,
    });
  };

  return (
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
              icon: <InformationCircleIcon className="text-info h-5 w-5" />,
            });
          }
        }}
      >
        Reset to Default
      </button>
    </div>
  );
}
