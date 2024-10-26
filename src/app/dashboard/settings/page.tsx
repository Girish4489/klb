'use client';
import Logout from '@/app/components/logout/page';
import ThemerPage from '@/app/components/themer/page';
import { useUser } from '@/app/context/userContext';
import { userConfirmation } from '@/app/util/confirmation/confirmationUtil';
import handleError from '@/app/util/error/handleError';
import { formatD, formatDNT } from '@/app/util/format/dateUtils';
import { InformationCircleIcon, TrashIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Fonts {
  name: string;
  weight: number;
}

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

export default function SettingsPage() {
  const { user, updateUser } = useUser();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [fonts, setFonts] = useState<Fonts>(user.preferences?.fonts ?? { name: 'Roboto', weight: 400 });

  useEffect(() => {
    document.body.style.fontFamily = user.preferences?.fonts?.name ?? 'Roboto';
    document.body.style.fontWeight = user.preferences?.fonts?.weight.toString() ?? '400';
  }, [user.preferences?.fonts]);

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
                theme: user.preferences.theme,
              },
            });
            document.body.style.fontFamily = res.data.fonts.name;
            document.body.style.fontWeight = res.data.fonts.weight.toString();
            return res.data.message;
          } else {
            throw new Error(res.data.message);
          }
        })(),
        {
          loading: 'Updating font preferences...',
          success: (message) => <b>{message}</b>,
          error: (error) => <b>{error.message}</b>,
        },
      )
      .catch(handleError.toastAndLog);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & { files: FileList };
    setProfileImage(target.files?.[0] || null);
  };

  async function uploadProfilePhoto(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const uploadImage = async () => {
        if (!profileImage || !profileImage.type.startsWith('image/')) {
          throw new Error('Please select a valid image');
        }

        // check the file size
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
      await toast.promise(uploadImage(), {
        loading: 'Uploading...',
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });
      setProfileImage(null);
      clearProfileImageInput();
    } catch (error) {
      // toast.error('Error uploading profile photo: ' + error);
      // console.error(error);
      handleError.toastAndLog(error);
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
        return res.data.message; // Resolve with success message
      } else {
        throw new Error(res.data.message); // Reject with error message
      }
    };
    try {
      const confirm = await userConfirmation({
        header: 'Remove Profile Photo',
        message: 'Are you sure you want to remove your profile photo? This action cannot be undone.',
      });
      if (!confirm) return;
      await toast.promise(removeImage(), {
        loading: 'Removing...',
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });
    } catch (error) {
      // toast.error('Error removing profile photo: ' + error);
      // console.error(error);
      handleError.log(error);
    }
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

  return (
    <div className=" max-sm:m-2 md:m-5">
      <div className="join join-vertical w-full bg-base-200">
        <div className="collapse join-item collapse-arrow border border-base-300">
          <input type="checkbox" name="collapse" defaultChecked />
          <div className="collapse-title text-xl font-medium">User Profile</div>
          <div className="collapse-content">
            <div className="card flex flex-col items-center gap-4 lg:card-side">
              <div className="avatar indicator card-side lg:pt-4">
                <span className="badge indicator-item badge-secondary select-none lg:mt-4">edit..</span>
                <div className="h-24 w-24 rounded-full ring ring-primary hover:scale-105 hover:ring-offset-2  hover:ring-offset-accent">
                  <Image
                    src={
                      user.profileImage.__filename !== 'USER_PROFILE_404_ERROR' && user.profileImage.data
                        ? `data:${user.profileImage.contentType};base64,${user.profileImage?.data}`
                        : '/klm.webp'
                    }
                    alt="Landscape picture"
                    className="cursor-pointer rounded-full transition-all duration-500 ease-in-out"
                    width="40"
                    height="40"
                    onClick={() => myModel('my_modal_4')}
                  />
                </div>
              </div>
              {/* You can open the modal using document.getElementById('ID').showModal() method */}
              <dialog id="my_modal_4" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                  <h3 className="text-lg font-bold">Change Profile!</h3>
                  <div className="card flex w-full items-center justify-between py-2 align-middle lg:card-side max-sm:pt-5 lg:items-center">
                    <div className="avatar h-full w-full flex-col items-center justify-center gap-2">
                      <div className="mask w-48 rounded-badge ring ring-primary ring-offset-1 ring-offset-base-100 transition-transform duration-300 ease-in-out hover:scale-105">
                        <Image
                          src={
                            user.profileImage.__filename !== 'USER_PROFILE_404_ERROR' && user.profileImage.data
                              ? `data:${user.profileImage.contentType};base64,${user.profileImage?.data}`
                              : '/klm.webp'
                          }
                          alt="Landscape picture"
                          className="h-48 w-48 cursor-pointer transition-transform duration-300 ease-in-out"
                          width="192"
                          height="192"
                        />
                      </div>
                      {user.profileImage.__filename !== 'USER_PROFILE_404_ERROR' && user.profileImage.data && (
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
                          {user.profileImage.__filename !== 'USER_PROFILE_404_ERROR' ? 'Update' : 'Add'} Profile Image
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="modal-action">
                    <form method="dialog">
                      {/* if there is a button, it will close the modal */}
                      <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
                      <button className="btn">Close</button>
                    </form>
                  </div>
                </div>
              </dialog>
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
                <BadgeItem label="Created" content={formatDNT(user.createdAt)} />
                <BadgeItem label="Updated" content={formatDNT(user.updatedAt)} />
                <BadgeItem label="Last Login" content={formatD(user.lastLogin)} />
                <span className="badge w-full select-none justify-between gap-2 p-5">
                  <h1 className="font-bold">Logout:</h1>
                  <span className="badge badge-warning p-4 outline outline-2 outline-offset-1 outline-error hover:badge-error hover:cursor-pointer hover:font-semibold hover:outline-warning">
                    <Logout />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="collapse join-item collapse-arrow border border-base-300">
          <input type="checkbox" name="collapse" defaultChecked />
          <div id="themeBlock" className="collapse-title text-xl font-medium">
            Theme
          </div>
          <div className="collapse-content m-2">
            <ThemerPage />
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
                  value={fonts?.name ?? 'Roboto'}
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
                  value={fonts?.weight ?? 400}
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
