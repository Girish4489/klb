'use client';
import { Modal, showModel } from '@components/Modal/Modal';
import LogoutButton from '@components/logout/LogoutButton';
import { TrashIcon } from '@heroicons/react/24/solid';
import { IUser } from '@models/userModel';
import { userConfirmation } from '@utils/confirmation/confirmationUtil';
import handleError from '@utils/error/handleError';
import { formatD, formatDNT } from '@utils/format/dateUtils';
import { ImageProcessor } from '@utils/image/imageUtils';
import axios from 'axios';
import Image from 'next/image';
import { ChangeEvent, FC, FormEvent, JSX, useCallback, useState } from 'react';
import toast from 'react-hot-toast';

const LoadingSkeleton = (): JSX.Element => (
  <div className="flex flex-col items-center gap-4">
    <div className="avatar placeholder">
      <div className="bg-neutral-focus text-neutral-content w-24 rounded-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    </div>
  </div>
);

const BadgeItem: FC<{ label: string; content: string | boolean; badgeClass?: string }> = ({
  label,
  content,
  badgeClass = 'badge-primary',
}) => (
  <span className="badge w-full justify-between gap-2 p-5">
    <h1 className="font-bold">{label}:</h1>
    <span className={`badge badge-soft py-3 ${badgeClass}`}>
      {typeof content === 'boolean' ? (content ? 'Yes' : 'No') : content}
    </span>
  </span>
);

const getProfileImageSrc = (profileImage?: IUser['profileImage']): string => {
  if (!profileImage?.data || profileImage.__filename === 'USER_PROFILE_404_ERROR') {
    return '/klm.webp';
  }
  return `data:${profileImage.contentType};base64,${profileImage.data}`;
};

export default function SettingsProfile({
  user,
  updateUserAction,
}: {
  user: IUser;
  updateUserAction: (user: Partial<IUser>) => void;
}): JSX.Element {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Format dates once during render, don't use state or useEffect
  const dates = {
    createdAt: formatDNT(user.createdAt),
    updatedAt: formatD(user.updatedAt),
    lastLogin: formatD(user.lastLogin),
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement & { files: FileList };
    setProfileImage(target.files?.[0] || null);
  };

  const clearProfileImageInput = (): void => {
    const profileImageInput = document.getElementById('profileImage') as HTMLInputElement | null;
    if (profileImageInput) {
      profileImageInput.value = '';
    }
  };

  const handleImageUpload = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!profileImage) return;

    try {
      setIsLoading(true);
      const { base64, metadata } = await ImageProcessor.processImage(profileImage);

      const formData = new FormData();
      formData.append('base64', base64);
      formData.append('metadata', JSON.stringify(metadata));

      const { data } = await axios.post('/api/dashboard/settings', formData);
      if (!data.success) throw new Error(data.message);

      updateUserAction({ profileImage: data.profileImage });
      toast.success(data.message);

      setProfileImage(null);
      clearProfileImageInput();
    } catch (error) {
      handleError.toastAndLog(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeProfilePhoto = async (): Promise<void> => {
    try {
      const confirmed = await userConfirmation({
        header: 'Remove Profile Photo',
        message: 'Are you sure you want to remove your profile photo?',
      });

      if (!confirmed) return;

      const res = await axios.delete('/api/dashboard/settings');
      if (!res.data.success) throw new Error(res.data.message);

      updateUserAction({ profileImage: res.data.profileImage });
      toast.success(res.data.message);
    } catch (error) {
      handleError.toastAndLog(error);
    }
  };

  const handleImageClick = useCallback(() => {
    showModel('settingsProfile_modal');
  }, []);

  return (
    <div className="card lg:card-side flex flex-col items-center gap-4">
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div
            id="settingsProfile"
            className="avatar tooltip tooltip-info tooltip-bottom lg:tooltip-right h-fit"
            data-tip="Click to change profile image"
          >
            <div className="ring-primary ring-offset-base-100 h-24 w-24 rounded-full ring ring-offset-2">
              <Image
                src={getProfileImageSrc(user.profileImage)}
                alt="Profile picture"
                className="cursor-pointer rounded-full transition-all duration-500 ease-in-out"
                width="96"
                height="96"
                onClick={handleImageClick}
              />
            </div>
          </div>

          <Modal id="settingsProfile_modal" title="Update Profile Picture" isBackdrop={true}>
            <div className="card lg:card-side flex w-full items-center justify-between py-2 align-middle max-sm:pt-5 lg:items-center">
              <div className="avatar h-full w-full flex-col items-center justify-center gap-2">
                <div className="mask mask-squircle w-48">
                  <Image
                    src={
                      user.profileImage &&
                      user.profileImage.__filename !== 'USER_PROFILE_404_ERROR' &&
                      user.profileImage.data
                        ? `data:${user.profileImage.contentType};base64,${user.profileImage?.data}`
                        : '/klm.webp'
                    }
                    alt="Landscape picture"
                    className="h-48 w-48 cursor-pointer"
                    width="192"
                    height="192"
                  />
                </div>
                {user.profileImage?.__filename !== 'USER_PROFILE_404_ERROR' && user.profileImage?.data && (
                  <span className="btn btn-warning btn-sm" onClick={removeProfilePhoto}>
                    <TrashIcon className="text-warning-content h-5 w-5" />
                    Remove Profile Image
                  </span>
                )}
              </div>
              <div className="card-body w-full items-center">
                <form
                  onSubmit={handleImageUpload}
                  encType="multipart/form-data"
                  className="flex max-w-xs flex-col gap-2"
                >
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Choose file to update/add profile image</span>
                    </div>
                    <input
                      type="file"
                      name="file"
                      id="profileImage"
                      onChange={handleChange}
                      accept=".jpg, .png, .jpeg, .webp, .gif"
                      className="file-input file-input-bordered file-input-primary"
                      required
                    />
                    <div className="label">
                      <span className="label-text-alt">Note: .jpg, .png, .jpeg, .webp, .gif only..</span>
                    </div>
                  </label>
                  <button className="btn btn-primary w-full" type="submit">
                    {user.profileImage && user.profileImage.__filename !== 'USER_PROFILE_404_ERROR' ? 'Update' : 'Add'}{' '}
                    Profile Image
                  </button>
                </form>
              </div>
            </div>
          </Modal>
          <div className="card-body rounded-box border-base-100 my-4 border p-4 shadow-2xl">
            <BadgeItem label="Username" content={user.username} badgeClass="badge-primary" />
            <BadgeItem label="Email" content={user.email} badgeClass="badge-primary" />
            <BadgeItem
              label="Verified"
              content={user.isVerified}
              badgeClass={`${user.isVerified ? 'badge-success' : 'badge-error'}`}
            />
            <BadgeItem
              label="Admin"
              content={user.isAdmin}
              badgeClass={`${user.isAdmin ? 'badge-success' : 'badge-error'}`}
            />
            <BadgeItem label="Created" content={dates.createdAt} badgeClass="badge-primary" />
            <BadgeItem label="Updated" content={dates.updatedAt} badgeClass="badge-primary" />
            <BadgeItem label="Last Login" content={dates.lastLogin} badgeClass="badge-primary" />
            <span className="badge w-full select-none justify-between gap-2 p-5">
              <h1 className="font-bold">Logout:</h1>
              <LogoutButton className="btn-error btn-sm btn-soft rounded-box px-6" />
            </span>
          </div>
        </>
      )}
    </div>
  );
}
