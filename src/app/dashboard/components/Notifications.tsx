import { BellIcon, BellSlashIcon } from '@heroicons/react/24/outline';
import { INotification } from '@models/userModel';
import { JSX } from 'react';

const Notifications = ({ notifications }: { notifications: INotification[] }): JSX.Element => {
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-circle btn-ghost">
        {/* Notifications icon */}
        {notifications.length > 1 ? (
          <div className="indicator">
            <BellSlashIcon className="text-primary h-8 w-8" />
          </div>
        ) : (
          <div className="indicator">
            <BellIcon className="text-primary h-6 w-6" />
            {unreadCount > 0 && <span className="badge indicator-item badge-sm">{unreadCount}</span>}
          </div>
        )}
      </div>
      <div
        tabIndex={0}
        className="card dropdown-content card-compact z-1 bg-base-100 ring-primary mt-3 w-52 shadow-sm ring-1"
      >
        <div className="card-body">
          <span className="font-bold text-lg">{notifications.length} Notifications</span>
          <span className="text-info">View all notifications</span>
          <div className="card-actions">
            <button className="btn btn-primary btn-block">View notifications</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
