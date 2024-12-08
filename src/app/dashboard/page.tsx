'use client';
// import dynamic from 'next/dynamic';
import AllBills from '@dashboard/stats/AllBills';
import CompletedOrders from '@dashboard/stats/CompletedOrders';
import DashboardStats from '@dashboard/stats/DashboardStats';
import DueBills from '@dashboard/stats/DueBills';
import DueDateTable from '@dashboard/stats/DueDateTable';
import UnpaidBills from '@dashboard/stats/UnpaidBills';
import React, { useState } from 'react';

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
          <span className="grow rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
            <DashboardStats refresh={refresh} />
          </span>
          <span className="grow rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
            <DueDateTable refresh={refresh} />
          </span>
          <span className="grow rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
            <AllBills refresh={refresh} />
          </span>
          <span className="grow rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
            <DueBills refresh={refresh} />
          </span>
          <span className="grow rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
            <CompletedOrders refresh={refresh} />
          </span>
          <span className="grow rounded-box border border-primary p-2 shadow-inner shadow-primary transition-shadow">
            <UnpaidBills refresh={refresh} />
          </span>
        </span>
      </div>
    </React.Fragment>
  );
}
