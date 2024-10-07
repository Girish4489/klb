'use client';
import Logout from '@/app/components/logout/page';
import ThemerPage from '@/app/components/themer/page';
import { useUser } from '@/app/context/userContext';
import handleError from '@/app/util/error/handleError';
import axios from 'axios';
import Image from 'next/image';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateUser } = useUser();
  let createdAt = '';

  if (user.createdAt) {
    const createdAtDate = new Date(user.createdAt);
    createdAt = createdAtDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  let updatedAt = '';

  if (user.updatedAt) {
    const updatedAtDate = new Date(user.updatedAt);
    updatedAt = updatedAtDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  // Create a state for the file input
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & { files: FileList };
    setProfileImage(target.files?.[0] || null);
  };

  async function uploadProfilePhoto(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

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
          profileImage: {
            data: res.data.profileImage?.data,
            __filename: res.data.profileImage?.__filename,
            contentType: res.data.profileImage?.contentType,
            uploadAt: res.data.profileImage?.uploadAt,
          },
        });
        return res.data.message; // Resolve with success message
      } else {
        throw new Error(res.data.message); // Reject with error message
      }
    };
    try {
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
      handleError.log(error);
    }
  }

  const removeProfilePhoto = async () => {
    const removeImage = async () => {
      const res = await axios.delete('/api/dashboard/settings');
      if (res.data.success === true) {
        updateUser({
          profileImage: {
            data: Buffer.from([]),
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
          {/* <input type="radio" name="my-accordion-4" /> */}
          <input type="checkbox" name="collapse" defaultChecked />
          <div className="collapse-title text-xl font-medium">User Profile</div>
          <div className="collapse-content">
            <div className="card flex flex-col items-center gap-4 lg:card-side">
              <div className="avatar indicator card-side lg:pt-4">
                <span className="badge indicator-item badge-secondary select-none lg:mt-4">edit..</span>
                <div className="h-24 w-24 rounded-full ring ring-primary hover:scale-105 hover:ring-offset-2  hover:ring-offset-accent">
                  <Image
                    src={
                      user.profileImage.__filename !== 'USER_PROFILE_404_ERROR'
                        ? `data:${user.profileImage.contentType};base64,${Buffer.from(new Uint8Array(user.profileImage?.data || [])).toString('base64')}`
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
                            user.profileImage.__filename !== 'USER_PROFILE_404_ERROR'
                              ? `data:${user.profileImage.contentType};base64,${Buffer.from(new Uint8Array(user.profileImage?.data || [])).toString('base64')}`
                              : '/klm.webp'
                          }
                          alt="Landscape picture"
                          className="h-48 w-48 cursor-pointer transition-transform duration-300 ease-in-out"
                          width="192"
                          height="192"
                        />
                      </div>
                      {user.profileImage.__filename !== 'USER_PROFILE_404_ERROR' && (
                        <span
                          className="btn btn-warning btn-sm w-40 select-none transition-transform duration-300 ease-in-out hover:btn-error hover:scale-105 hover:font-bold"
                          onClick={removeProfilePhoto}
                        >
                          Remove
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
                          Add | Update
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
                <span className="badge w-full justify-between gap-2 p-5">
                  <h1 className="font-bold">UserName:</h1>
                  <span className="badge badge-primary py-3">{user.username}</span>
                </span>
                <span className="badge w-full justify-between gap-2 p-5">
                  <h1 className="font-bold">Email:</h1>
                  <span className="badge badge-primary py-3">{user.email}</span>
                </span>
                <span className="badge w-full justify-between gap-2 p-5">
                  <h1 className="font-bold">Verified:</h1>
                  <span className={`badge py-3 ${user.isVerified ? 'badge-success' : 'badge-error'}`}>
                    {user.isVerified ? 'Yes' : 'No'}
                  </span>
                </span>
                <span className="badge w-full justify-between gap-2 p-5">
                  <h1 className="font-bold">Admin:</h1>
                  <span className={`badge py-3 ${user.isAdmin ? 'badge-success' : 'badge-error'}`}>
                    {user.isAdmin ? 'Yes' : 'No'}
                  </span>
                </span>
                <span className="badge w-full justify-between gap-2 p-5">
                  <h1 className="font-bold">Created:</h1>
                  <span className="badge badge-primary py-3">{createdAt}</span>
                </span>
                <span className="badge w-full justify-between gap-2 p-5">
                  <h1 className="font-bold">Updated:</h1>
                  <span className="badge badge-primary py-3">{updatedAt}</span>
                </span>
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
        <div className="collapse join-item collapse-arrow border border-base-300">
          {/* <input type="radio" name="my-accordion-4" /> */}
          <input type="checkbox" name="collapse" defaultChecked />
          <div id="themeBlock" className="collapse-title text-xl font-medium">
            Theme
          </div>
          <div className="collapse-content m-2">
            <ThemerPage />
          </div>
        </div>
        <div className="collapse join-item collapse-arrow border border-base-300">
          {/* <input type="radio" name="my-accordion-4" /> */}
          <input type="checkbox" name="collapse" defaultChecked />
          <div className="collapse-title text-xl font-medium">Notification</div>
          <div className="collapse-content">
            <p>hello</p>
          </div>
        </div>
      </div>
    </div>
  );
}
