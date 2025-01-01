'use client';
import ThemerPage from '@components/themer/ThemerPage';
import { useUser } from '@context/userContext';
import { IUser } from '@models/userModel';
import handleError from '@utils/error/handleError';
import { ApiPost, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import { toast } from '@utils/toast/toast';
import { JSX } from 'react';
import SettingsFont from './components/SettingsFont';
import SettingsProfile from './components/SettingsProfile';

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
        <div className="collapse-content">{children}</div>
      </div>
    );
  };

  return (
    <div className="max-sm:m-2 md:m-5">
      <div className="join join-vertical **:rounded-box w-full gap-3">
        <div className="flex w-full justify-center">
          <span className="badge badge-soft badge-success font-medium">Settings</span>
        </div>
        <CollapseComponent title="User Profile">
          <SettingsProfile user={user} updateUserAction={updateUser} />
        </CollapseComponent>

        <CollapseComponent title="Theme">
          <ThemerPage user={user} setUserAction={setUser} />
        </CollapseComponent>

        <CollapseComponent title="Font Settings">
          <SettingsFont user={user} updatePreferences={updatePreferences} />
        </CollapseComponent>

        <CollapseComponent title="Notification">
          <p>hello</p>
        </CollapseComponent>

        <CollapseComponent title="Preferences">
          <p>hello</p>
        </CollapseComponent>
      </div>
    </div>
  );
}
