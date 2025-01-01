'use client';
import { IUser } from '@models/userModel';
import { FC, useState } from 'react';

interface ToastPreferencesProps {
  user: IUser;
  updatePreferences: (preferences: Partial<IUser['preferences']>) => Promise<void>;
}

const ToastPreferences: FC<ToastPreferencesProps> = ({ user, updatePreferences }) => {
  const [verticalPosition, setVerticalPosition] = useState(user.preferences?.toast?.position.vertical ?? 'top');
  const [horizontalPosition, setHorizontalPosition] = useState(
    user.preferences?.toast?.position.horizontal ?? 'center',
  );
  const [duration, setDuration] = useState(user.preferences?.toast?.duration ?? 4000);

  const handleUpdatePreferences = async (): Promise<void> => {
    const currentPreferences = user.preferences ?? {};
    await updatePreferences({
      ...currentPreferences,
      toast: {
        position: {
          vertical: verticalPosition,
          horizontal: horizontalPosition,
        },
        duration,
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="textarea-md font-semibold">Toast Settings</h2>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between">
          <label htmlFor="verticalPosition" className="label grow">
            Vertical Position
          </label>
          <select
            id="verticalPosition"
            name="verticalPosition"
            value={verticalPosition}
            onChange={(e) => setVerticalPosition(e.target.value as 'top' | 'bottom')}
            className="select select-bordered select-primary select-sm min-w-40"
          >
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center justify-between">
          <label htmlFor="horizontalPosition" className="label grow">
            Horizontal Position
          </label>
          <select
            id="horizontalPosition"
            name="horizontalPosition"
            value={horizontalPosition}
            onChange={(e) => setHorizontalPosition(e.target.value as 'start' | 'center' | 'end')}
            className="select select-bordered select-primary select-sm min-w-40"
          >
            <option value="start">Start</option>
            <option value="center">Center</option>
            <option value="end">End</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center justify-between">
          <label htmlFor="duration" className="label grow">
            Duration (ms)
          </label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min={1000}
            max={10000}
            step={500}
            className="input input-bordered input-primary input-sm w-40"
          />
        </div>
      </div>
      <button className="btn btn-primary btn-sm" onClick={handleUpdatePreferences}>
        Save Toast Preferences
      </button>
    </div>
  );
};

export default ToastPreferences;
