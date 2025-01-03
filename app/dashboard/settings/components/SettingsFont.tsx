'use client';
import { IUser } from '@models/userModel';
import { userConfirmation } from '@utils/confirmation/confirmationUtil';
import { fontWeightMap, type FontWeight } from '@utils/fonts/fontConfig';
import { toast } from '@utils/toast/toast';
import { JSX, useEffect, useState } from 'react';

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
    // Apply font weight using CSS variable
    const weightName = fontWeightMap[fonts.weight as FontWeight];
    if (weightName) {
      document.body.style.fontFamily = `var(--font-roboto-${weightName})`;
    }
  }, [fonts]);

  const updateFontPreferences = async (updatedFonts: Fonts): Promise<void> => {
    const currentPreferences = user.preferences ?? {};
    await updatePreferences({
      ...currentPreferences,
      fonts: updatedFonts,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="textarea-md font-semibold">Font Settings</h2>
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
        onClick={async () => {
          if (fonts.name !== 'Roboto' || fonts.weight !== 400) {
            const confirmed = await userConfirmation({
              header: 'Reset Font Settings',
              message: 'Are you sure you want to reset font settings to default?',
            });
            if (!confirmed) return;
            await updateFontPreferences({ name: 'Roboto', weight: 400 });
          } else {
            toast.info('Already in default mode');
          }
        }}
      >
        Reset to Default
      </button>
    </div>
  );
}
