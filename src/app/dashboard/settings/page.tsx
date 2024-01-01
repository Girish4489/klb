'use client';
import Logout from '@/app/components/logout/page';
import ThemerPage from '@/app/components/themer/page';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();
  const [data, setData] = useState<{
    username: string;
    email: string;
    theme: string;
    profileImage: string;
    isVerified: boolean;
    isAdmin: boolean;
  }>({
    username: 'User',
    email: 'sample@example.com',
    theme: 'default',
    profileImage: '/vercel.svg',
    isVerified: false,
    isAdmin: false,
  });

  const getUserDetails = async () => {
    try {
      const {
        data: { data: userData },
      } = await axios.get('/api/auth/user');

      const base64Image = userData.profileImage?.data ? Buffer.from(userData.profileImage.data).toString('base64') : '';

      setData({
        username: userData.username,
        email: userData.email,
        theme: userData.theme || 'default',
        profileImage: base64Image ? `data:${userData.profileImage.contentType};base64,${base64Image}` : '',
        isVerified: userData.isVerified,
        isAdmin: userData.isAdmin,
      });
    } catch (error) {
      // console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

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
      getUserDetails();
      setProfileImage(null);
      clearProfileImageInput();
    } catch (error) {
      // toast.error('Error uploading profile photo: ' + error);
      // console.error(error);
    }
  }
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
          <div className="collapse-title text-xl font-medium text-info">User Profile</div>
          <div className="collapse-content">
            <div className="card flex flex-col items-center gap-4 lg:card-side">
              <div className="avatar indicator card-side lg:pt-4">
                <span className="badge indicator-item badge-secondary select-none lg:mt-4">edit..</span>
                <div className="h-24 w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                  <Image
                    src={`${data.profileImage === '' ? '/klm.webp' : data.profileImage}`}
                    alt="Landscape picture"
                    className="cursor-pointer rounded-full p-0.5 transition-all duration-500 ease-in-out hover:bg-accent hover:shadow-2xl"
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
                  <div className="card flex items-center justify-evenly py-2 lg:card-side lg:items-center lg:justify-evenly">
                    <span className="h-48 w-48">
                      <Image
                        src={`${data.profileImage === '' ? '/klm.webp' : data.profileImage}`}
                        alt="Landscape picture"
                        className="h-48 w-48 cursor-pointer rounded-full p-1 transition-all duration-500 ease-in-out hover:bg-primary hover:shadow-2xl"
                        width="192"
                        height="192"
                      />
                    </span>
                    <form
                      onSubmit={uploadProfilePhoto}
                      encType="multipart/form-data"
                      className="form card-body flex-grow-0 gap-4"
                    >
                      <span className="">
                        <p className="py-4">choose file to update/add profile image</p>
                        <input
                          type="file"
                          name="file"
                          id="profileImage"
                          onChange={handleChange}
                          accept=".jpg, .png, .jpeg, .webp, .gif"
                          className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                          required
                        />
                        <p className="pt-1">Note: .jpg, .png, .jpeg, .webp, .gif only..</p>
                      </span>
                      <div className="form-control items-center">
                        <button className="btn btn-primary w-10/12" type="submit">
                          Add | Update
                        </button>
                      </div>
                    </form>
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
                  <h1 className="text-xl font-bold">UserName:</h1>
                  <span className="badge badge-accent badge-outline py-3">{data.username}</span>
                </span>
                <span className="badge w-full justify-between gap-2 p-5">
                  <h1 className="text-xl font-bold">Email:</h1>
                  <span className="badge badge-accent badge-outline py-3">{data.email}</span>
                </span>
                <span className="badge w-full justify-between gap-2 p-5">
                  <h1 className="text-xl font-bold">Verified:</h1>
                  <span className="badge badge-accent badge-outline py-3">{data.isVerified ? 'Yes' : 'No'}</span>
                </span>
                <span className="badge w-full justify-between gap-2 p-5">
                  <h1 className="text-xl font-bold">Admin:</h1>
                  <span className="badge badge-accent badge-outline py-3">{data.isAdmin ? 'Yes' : 'No'}</span>
                </span>
                <span className="badge w-full justify-between gap-2 p-5">
                  <h1 className="text-xl font-bold">Logout:</h1>
                  <span className="badge badge-warning badge-outline border-2 border-error py-3 hover:bg-error">
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
          <div className="collapse-title text-xl font-medium">Theme</div>
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
