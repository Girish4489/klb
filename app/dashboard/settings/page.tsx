'use client';
import { useUser } from '@context/userContext';
import ThemerPage from '@dashboard/settings/components/ThemerPage';
import { IUser } from '@models/userModel';
import handleError from '@utils/error/handleError';
import { ApiPost, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import { toast } from '@utils/toast/toast';
import { JSX } from 'react';
import SettingsFont from './components/SettingsFont';
import SettingsProfile from './components/SettingsProfile';
import ToastPreferences from './components/ToastPreferences';

interface PreferencesResponse extends ApiResponse {
  preferences?: IUser['preferences'];
}

export default function SettingsPage(): JSX.Element {
  const { user, updateUser, setUser } = useUser() as {
    user: IUser;
    updateUser: (user: Partial<IUser>) => void;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
  };

  const updatePreferences = async (updatedPreferences: Partial<IUser['preferences']>): Promise<void> => {
    await toast
      .promise(
        (async (): Promise<string> => {
          const res = await ApiPost.User.updatePreferences<PreferencesResponse>(updatedPreferences);
          if (!res) {
            throw new Error('No response from server');
          }
          if (res.success && res.preferences) {
            updateUser({
              preferences: res.preferences,
            });
            return res.message ?? 'Preferences updated successfully';
          }
          throw new Error(res.message ?? res.error ?? 'Failed to update preferences');
        })(),
        {
          loading: 'Updating preferences...',
          success: (message: string) => <b>{message}</b>,
          error: (error: Error) => <b>{error.message}</b>,
        },
      )
      .catch(handleError.toastAndLog);
  };

  interface CollapseComponentProps {
    title: string;
    children: React.ReactNode;
    defaultChecked?: boolean;
  }

  const CollapseComponent = ({ title, children, defaultChecked = true }: CollapseComponentProps): JSX.Element => {
    return (
      <div className="join-item collapse-arrow bg-base-200 border-base-300 collapse border">
        <input type="checkbox" name="collapse" defaultChecked={defaultChecked} />
        <div className="collapse-title bg-base-300 font-medium">{title}</div>
        <div className="collapse-content py-4">{children}</div>
      </div>
    );
  };

  return (
    <div className="p-5 max-sm:p-2 md:p-3 lg:p-4">
      <div className="join join-vertical **:rounded-box w-full gap-3">
        <div className="flex w-full justify-center">
          <span className="badge badge-soft badge-success font-medium">Settings</span>
        </div>
        <CollapseComponent title="User Profile">
          <SettingsProfile user={user} updateUserAction={updateUser} />
        </CollapseComponent>

        <CollapseComponent title="Preferences">
          <div className="flex flex-col">
            <ThemerPage user={user} setUserAction={setUser} />
            <div className="divider" />
            <SettingsFont user={user} updatePreferences={updatePreferences} />
            <div className="divider" />
            <ToastPreferences user={user} updatePreferences={updatePreferences} />
          </div>
        </CollapseComponent>

        <CollapseComponent title="Notification">
          <p>hello</p>
        </CollapseComponent>
      </div>
    </div>
  );
}
