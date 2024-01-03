// Import the useUser hook
import { useUser } from '@/app/context/userContext';
import Image from 'next/image';
import Link from 'next/link';
import LogoutPage from '../logout/page';

export default function ProfilePage() {
  // Use the useUser hook to get user data
  const { user } = useUser();

  return (
    <>
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="avatar">
          <div className="w-12 transform rounded-full ring-2 ring-primary hover:scale-105 hover:ring-offset-2 hover:ring-offset-accent">
            <Image
              src={user.profileImage || '/klm.webp'}
              alt="profile image"
              className="cursor-pointer rounded-full transition-all duration-500 ease-in-out"
              width="40"
              height="40"
              priority
            />
          </div>
        </div>
        <ul tabIndex={0} className="menu dropdown-content menu-sm z-50 mt-3 w-auto rounded-box bg-base-200 p-2 shadow">
          <li className="tooltip tooltip-left" data-tip="Username">
            <a className="justify-between">
              {user.username}
              {user.createdAt && new Date(user.createdAt) > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) && (
                <span className="badge badge-primary">New</span>
              )}
            </a>
          </li>
          <li className="tooltip tooltip-left" data-tip="Email">
            <a>{user.email}</a>
          </li>
          <li>
            <a className="justify-between">
              Verified
              <span className={`badge ${user.isVerified ? 'badge-success' : 'badge-error'}`}>
                {user.isVerified ? 'Yes' : 'No'}
              </span>
            </a>
          </li>
          <li>
            <a className="justify-between">
              Admin
              <span className={`badge ${user.isAdmin ? 'badge-success' : 'badge-error'}`}>
                {user.isAdmin ? 'Yes' : 'No'}
              </span>
            </a>
          </li>
          <li>
            <span className="justify-between">
              Theme
              <Link
                href="/dashboard/settings#themeBlock"
                className="tooltip tooltip-top flex flex-row gap-2 rounded-box bg-primary pl-2 pr-1 font-medium text-primary-content"
                data-tip="edit theme"
              >
                {user.theme.charAt(0).toUpperCase() + user.theme.slice(1)}
                <span className="badge badge-secondary">
                  <Image src="/icons/svg/note-pencil.svg" alt="edit icon" width="18" height="18" />
                </span>
              </Link>
            </span>
          </li>
          <li className={`tooltip tooltip-left`} data-tip="Settings">
            <Link href="/dashboard/settings">Settings</Link>
          </li>
          <li
            className="tooltip tooltip-left text-warning hover:rounded-lg hover:bg-error hover:font-medium hover:text-warning-content"
            data-tip="Logout"
          >
            <LogoutPage />
          </li>
        </ul>
      </div>
    </>
  );
}
