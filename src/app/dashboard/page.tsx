'use client';
import React, { useState } from 'react';
import AllBills from './stats/AllBills';
import CompletedOrders from './stats/CompletedOrders';
import DashboardStats from './stats/DashboardStats';
import DueBills from './stats/DueBills';
import DueDateTable from './stats/DueDateTable';
import UnpaidBills from './stats/UnpaidBills';

export default function DashboardPage() {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <React.Fragment>
      <div className="flex flex-col gap-1 pb-2">
        <span className="flex items-center justify-between gap-2 rounded-box bg-neutral px-4 py-0.5">
          <h1 className="grow text-center">Dashboard</h1>
          <button className="btn btn-info btn-sm" onClick={handleRefresh}>
            Refresh
          </button>
        </span>
        <span className="flex flex-wrap gap-2 rounded-box">
          <span className="rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
            <DashboardStats refresh={refresh} />
          </span>
          <span className="rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
            <DueDateTable refresh={refresh} /> {/* Add the new component */}
          </span>
          <span className="rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
            <DueBills refresh={refresh} />
          </span>
          <span className="rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
            <AllBills refresh={refresh} />
          </span>
          <span className="rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
            <CompletedOrders refresh={refresh} />
          </span>
          <span className="rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
            <UnpaidBills refresh={refresh} />
          </span>
        </span>
      </div>
    </React.Fragment>
  );
}
