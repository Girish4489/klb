'use client';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Logout from '../../components/logout/page';
import ThemerPage from '@/app/components/themer/page';

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
      const res = await axios.get('/api/auth/user');
      if (!res.data.data.profileImage.data) {
        setData({
          username: res.data.data.username,
          email: res.data.data.email,
          theme: res.data.data.theme,
          profileImage: '',
          isVerified: res.data.data.isVerified,
          isAdmin: res.data.data.isAdmin,
        });
      } else {
        const base64Image = Buffer.from(res.data.data.profileImage.data).toString('base64');
        setData({
          username: res.data.data.username,
          email: res.data.data.email,
          theme: res.data.data.theme,
          profileImage: `data:${res.data.data.profileImage.contentType};base64,${base64Image}`,
          isVerified: res.data.data.isVerified,
          isAdmin: res.data.data.isAdmin,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  // Create a state for the file input
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };
    setProfileImage(target.files![0]);
  };

  async function uploadProfilePhoto(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (profileImage === undefined || !profileImage || !profileImage.type.startsWith('image/')) {
        toast.error('Please select an image');
        return;
      }
      // check the file size
      if (profileImage.size > 2 * 1024 * 1024) {
        toast.error('Please select an image less than 1MB');
        return;
      }
      // check the file extention to be image
      if (!profileImage.type.startsWith('image/')) {
        alert('Please select an image');
        return;
      }
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      const fileExtension = profileImage.name.split('.').pop()?.toLowerCase();
      if (!allowedExtensions.includes(fileExtension as string)) {
        alert('Please select a valid image file');
        return;
      }

      const formData = new FormData();
      if (profileImage) {
        formData.append('profileImage', profileImage);
      } else {
        toast.error('Please select an image');
        return;
      }

      const res = await axios.post('/api/dashboard/settings', formData);
      getUserDetails();
      setProfileImage(null);

      // Reload the page
      router.refresh();

      toast.success('Profile photo uploaded successfully!');
    } catch (error) {
      toast.error('Error uploading profile photo' + error);
      console.error('Error uploading profile photo:', error);
    }
  }

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
          <input type="checkbox" defaultChecked />
          <div className="collapse-title text-xl font-medium text-info">User Profile</div>
          <div className="collapse-content">
            <div className="card flex flex-col items-center gap-4 lg:card-side">
              <div className="avatar indicator card-side lg:pt-4">
                <span className="badge indicator-item badge-secondary lg:mt-4">edit</span>
                <div className="h-24 w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                  <Image
                    src={`${data.profileImage === '' ? '/vercel.svg' : data.profileImage}`}
                    alt="Landscape picture"
                    className="cursor-pointer rounded-full p-1  transition-all duration-500 ease-in-out hover:bg-primary hover:shadow-2xl"
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
                        src={`${data.profileImage === '' ? '/vercel.svg' : data.profileImage}`}
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
                  <span className="badge badge-accent badge-outline">{data.username}</span>
                </span>
                <span className="badge w-full justify-between gap-2 p-5">
                  <h1 className="text-xl font-bold">Email:</h1>
                  <span className="badge badge-accent badge-outline">{data.email}</span>
                </span>
                <span className="badge w-full justify-between gap-2 p-5">
                  <h1 className="text-xl font-bold">Verified:</h1>
                  <span className="badge badge-accent badge-outline">{data.isVerified ? 'Yes' : 'No'}</span>
                </span>
                <span className="badge w-full justify-between gap-2 p-5">
                  <h1 className="text-xl font-bold">Admin:</h1>
                  <span className="badge badge-accent badge-outline">{data.isAdmin ? 'Yes' : 'No'}</span>
                </span>
                <span className="badge w-full justify-between gap-2 p-5">
                  <h1 className="text-xl font-bold">Logout:</h1>
                  <div className="btn my-2 h-9">
                    <Logout />
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="collapse join-item collapse-arrow border border-base-300">
          {/* <input type="radio" name="my-accordion-4" /> */}
          <input type="checkbox" defaultChecked />
          <div className="collapse-title text-xl font-medium">Theme</div>
          <div className="collapse-content m-2">
            <ThemerPage />
          </div>
        </div>
        <div className="collapse join-item collapse-arrow border border-base-300">
          {/* <input type="radio" name="my-accordion-4" /> */}
          <input type="checkbox" defaultChecked />
          <div className="collapse-title text-xl font-medium">Notification</div>
          <div className="collapse-content">
            <p>hello</p>
          </div>
        </div>
      </div>
    </div>
  );
}
