import { BellIcon, BellSlashIcon } from '@heroicons/react/24/outline';
import { INotification } from '@models/userModel';
import { JSX } from 'react';

const Notifications = ({ notifications }: { notifications: INotification[] }): JSX.Element => {
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-circle btn-ghost btn-sm">
        {/* Notifications icon */}
        {notifications.length > 1 ? (
          <div className="indicator">
            <BellSlashIcon className="h-6 w-6 text-primary" />
          </div>
        ) : (
          <div className="indicator">
            <BellIcon className="h-6 w-6 text-primary" />
            {unreadCount > 0 && <span className="badge indicator-item badge-sm">{unreadCount}</span>}
          </div>
        )}
      </div>
      <div
        tabIndex={0}
        className="card dropdown-content card-compact z-[1] mt-3 w-52 bg-base-100 shadow ring-1 ring-primary"
      >
        <div className="card-body">
          <span className="text-lg font-bold">{notifications.length} Notifications</span>
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
