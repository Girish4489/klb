'use client';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LogoutPage from '../logout/page';

export default function ProfilePage() {
  const [data, setData] = useState<{
    username: string;
    email: string;
    theme: string;
    profileImage: string;
  }>({
    username: 'User',
    email: 'sample@example.com',
    theme: 'default',
    profileImage: '/vercel.svg',
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
        });
      } else {
        const base64Image = Buffer.from(res.data.data.profileImage.data).toString('base64');
        setData({
          username: res.data.data.username,
          email: res.data.data.email,
          theme: res.data.data.theme,
          profileImage: `data:${res.data.data.profileImage.contentType};base64,${base64Image}`,
        });
      }
      document.documentElement.setAttribute('data-theme', res.data.data.theme);
    } catch (error) {
      // console.error(error);
    }
  };
  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <>
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="avatar btn btn-circle btn-ghost">
          <div className="w-28 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
            <Image
              src={`${data.profileImage === '' ? '/vercel.svg' : data.profileImage}`}
              alt="Landscape picture"
              className="cursor-pointer rounded-full p-0.5  transition-all duration-500 ease-in-out hover:bg-secondary hover:shadow-2xl"
              width="40"
              height="40"
              priority
            />
          </div>
        </div>
        <ul tabIndex={0} className="menu dropdown-content menu-sm z-50 mt-3 w-auto rounded-box bg-base-200 p-2 shadow">
          <li>
            <a className="justify-between">
              {data.username}
              <span className="badge">New</span>
            </a>
          </li>
          <li>
            <a>{data.email}</a>
          </li>
          <li>
            <a className="justify-between">Theme: {data.theme.charAt(0).toUpperCase() + data.theme.slice(1)}</a>
          </li>
          <li>
            <Link href="/dashboard/settings">Settings</Link>
            {/* <a>Settings</a> */}
          </li>
          <li className="tooltip tooltip-left" data-tip="Logout">
            <LogoutPage />
          </li>
        </ul>
      </div>
    </>
  );
}
