'use client';
import { Modal } from '@/app/components/Modal/Modal';
import Logout from '@/app/components/logout/page';
import { userConfirmation } from '@/app/util/confirmation/confirmationUtil';
import handleError from '@/app/util/error/handleError';
import { formatD, formatDNT } from '@/app/util/format/dateUtils';
import { IUser } from '@/models/userModel';
import { TrashIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const LoadingSkeleton = () => (
  <div className="flex flex-col items-center gap-4">
    <div className="avatar placeholder">
      <div className="bg-neutral-focus w-24 rounded-full text-neutral-content">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    </div>
  </div>
);

const BadgeItem: React.FC<{ label: string; content: string | boolean; badgeClass?: string }> = ({
  label,
  content,
  badgeClass = 'badge-primary',
}) => (
  <span className="badge w-full justify-between gap-2 p-5">
    <h1 className="font-bold">{label}:</h1>
    <span className={`badge py-3 ${badgeClass}`}>
      {typeof content === 'boolean' ? (content ? 'Yes' : 'No') : content}
    </span>
  </span>
);

export default function SettingsProfile({
  user,
  updateUser,
}: {
  user: IUser;
  updateUser: (user: Partial<IUser>) => void;
}) {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dates, setDates] = useState({
    createdAt: '',
    updatedAt: '',
    lastLogin: '',
  });

  useEffect(() => {
    setDates({
      createdAt: formatDNT(user.createdAt),
      updatedAt: formatD(user.updatedAt),
      lastLogin: formatD(user.lastLogin),
    });
    setIsLoading(false);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & { files: FileList };
    setProfileImage(target.files?.[0] || null);
  };

  const clearProfileImageInput = () => {
    const profileImageInput = document.getElementById('profileImage') as HTMLInputElement | null;
    if (profileImageInput) {
      profileImageInput.value = '';
    }
  };

  const myModel = (id: string) => {
    const element = document.getElementById(id) as HTMLDialogElement | null;
    if (element) {
      element.showModal();
    }
  };

  async function uploadProfilePhoto(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const uploadImage = async () => {
        if (!profileImage || !profileImage.type.startsWith('image/')) {
          throw new Error('Please select a valid image');
        }

        if (profileImage.size > 2 * 1024 * 1024) {
          throw new Error('Please select an image less than 2MB');
        }

        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const fileExtension = profileImage?.name.split('.').pop()?.toLowerCase();
        if (!allowedExtensions.includes(fileExtension as string)) {
          throw new Error('Please select a valid image file');
        }

        const formData = new FormData();
        formData.append('profileImage', profileImage);

        const res = await axios.post('/api/dashboard/settings', formData);
        if (res.data.success === true) {
          updateUser({
            profileImage: res.data.profileImage,
          });
          return res.data.message;
        } else {
          throw new Error(res.data.message);
        }
      };
      await toast.promise<string>(uploadImage(), {
        loading: 'Uploading...',
        success: (message: string) => <b>{message}</b>,
        error: (error: Error) => <b>{error.message}</b>,
      });
      setProfileImage(null);
      clearProfileImageInput();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'An error occurred while removing the image');
      } else {
        handleError.toastAndLog(error);
      }
    }
  }

  const removeProfilePhoto = async () => {
    const removeImage = async () => {
      const res = await axios.delete('/api/dashboard/settings');
      if (res.data.success === true) {
        updateUser({
          profileImage: {
            data: Buffer.from([]).toString(),
            __filename: 'USER_PROFILE_404_ERROR',
            contentType: '',
            uploadAt: new Date(),
          },
        });
        return res.data.message;
      } else {
        throw new Error(res.data.message);
      }
    };
    try {
      const confirm = await userConfirmation({
        header: 'Remove Profile Photo',
        message: 'Are you sure you want to remove your profile photo? This action cannot be undone.',
      });
      if (!confirm) return;
      await toast.promise<string>(removeImage(), {
        loading: 'Removing...',
        success: (message: string) => <b>{message}</b>,
        error: (error: Error) => <b>{error.message}</b>,
      });
    } catch (error) {
      handleError.log(error);
    }
  };

  return (
    <div className="card flex flex-col items-center gap-4 lg:card-side">
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="avatar indicator card-side lg:pt-4">
            <span className="badge indicator-item badge-secondary select-none lg:mt-4">edit..</span>
            <div className="h-24 w-24 rounded-full ring ring-primary hover:scale-105 hover:ring-offset-2  hover:ring-offset-accent">
              <Image
                src={
                  user.profileImage?.__filename !== 'USER_PROFILE_404_ERROR' && user.profileImage?.data
                    ? `data:${user.profileImage.contentType};base64,${user.profileImage?.data}`
                    : '/klm.webp'
                }
                alt="Landscape picture"
                className="cursor-pointer rounded-full transition-all duration-500 ease-in-out"
                width="40"
                height="40"
                onClick={() => myModel('profile_modal')}
              />
            </div>
          </div>

          <Modal id="profile_modal">
            <h3 className="text-lg font-bold">Change Profile!</h3>
            <div className="card flex w-full items-center justify-between py-2 align-middle lg:card-side max-sm:pt-5 lg:items-center">
              <div className="avatar h-full w-full flex-col items-center justify-center gap-2">
                <div className="mask w-48 rounded-badge ring ring-primary ring-offset-1 ring-offset-base-100 transition-transform duration-300 ease-in-out hover:scale-105">
                  <Image
                    src={
                      user.profileImage &&
                      user.profileImage.__filename !== 'USER_PROFILE_404_ERROR' &&
                      user.profileImage.data
                        ? `data:${user.profileImage.contentType};base64,${user.profileImage?.data}`
                        : '/klm.webp'
                    }
                    alt="Landscape picture"
                    className="h-48 w-48 cursor-pointer transition-transform duration-300 ease-in-out"
                    width="192"
                    height="192"
                  />
                </div>
                {user.profileImage?.__filename !== 'USER_PROFILE_404_ERROR' && user.profileImage?.data && (
                  <span className="btn btn-warning btn-sm" onClick={removeProfilePhoto}>
                    <TrashIcon className="h-5 w-5 text-warning-content" />
                    Remove Profile Image
                  </span>
                )}
              </div>
              <div className="card-body w-full items-center">
                <form
                  onSubmit={uploadProfilePhoto}
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
          <div className="card-body my-4 rounded-box border border-base-100 p-4 shadow-2xl">
            <BadgeItem label="Username" content={user.username} />
            <BadgeItem label="Email" content={user.email} />
            <BadgeItem
              label="Verified"
              content={user.isVerified}
              badgeClass={user.isVerified ? 'badge-success' : 'badge-error'}
            />
            <BadgeItem
              label="Admin"
              content={user.isAdmin}
              badgeClass={user.isAdmin ? 'badge-success' : 'badge-error'}
            />
            <BadgeItem label="Created" content={dates.createdAt} />
            <BadgeItem label="Updated" content={dates.updatedAt} />
            <BadgeItem label="Last Login" content={dates.lastLogin} />
            <span className="badge w-full select-none justify-between gap-2 p-5">
              <h1 className="font-bold">Logout:</h1>
              <span className="badge badge-warning p-4 outline outline-2 outline-offset-1 outline-error hover:badge-error hover:cursor-pointer hover:font-semibold hover:outline-warning">
                <Logout />
              </span>
            </span>
          </div>
        </>
      )}
    </div>
  );
}