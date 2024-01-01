'use client';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LogoutPage from '../logout/page';

const getThemeFromDocument = () => document.documentElement.getAttribute('data-theme');

export default function ProfilePage() {
  const [data, setData] = useState({
    username: 'User',
    email: 'sample@example.com',
    theme: 'default',
    profileImage: '/klm.webp',
  });

  const getUserDetails = async () => {
    try {
      const theme = getThemeFromDocument();
      const {
        data: { data: userData },
      } = await axios.get('/api/auth/user');
      const base64Image = userData.profileImage?.data ? Buffer.from(userData.profileImage.data).toString('base64') : '';

      setData({
        username: userData.username,
        email: userData.email,
        theme: userData.theme || theme || 'default',
        profileImage: base64Image ? `data:${userData.profileImage.contentType};base64,${base64Image}` : '',
      });

      document.documentElement.setAttribute('data-theme', userData.theme);
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
              src={data.profileImage || '/klm.webp'}
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
          <li className="tooltip tooltip-left" data-tip="Settings">
            <Link href="/dashboard/settings">Settings</Link>
          </li>
          <li className="tooltip tooltip-left" data-tip="Logout">
            <LogoutPage />
          </li>
        </ul>
      </div>
    </>
  );
}
