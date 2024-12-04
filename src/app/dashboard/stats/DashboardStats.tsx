import { formatDS } from '@/app/util/format/dateUtils';
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { IBill } from '../../../models/klm';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

interface DashboardStatsProps {
  refresh: boolean;
}

interface Stats {
  unpaidBills: IBill[];
  dueBills: IBill[];
  completedOrders: IBill[];
  allBills: IBill[];
}

const DashboardStats = ({ refresh }: DashboardStatsProps) => {
  const [stats, setStats] = useState<Stats>({
    unpaidBills: [],
    dueBills: [],
    completedOrders: [],
    allBills: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof IBill; direction: 'ascending' | 'descending' } | null>(
    null,
  );

  const sortedBills = [...stats.allBills].sort((a, b) => {
    if (sortConfig !== null) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  const requestSort = (key: keyof IBill) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof IBill) => {
    if (!sortConfig) return null;
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? (
        <ArrowUpCircleIcon className="h-6 w-6 cursor-pointer text-inherit transition-transform duration-300" />
      ) : (
        <ArrowDownCircleIcon className="h-6 w-6 cursor-pointer text-inherit transition-transform duration-300" />
      );
    }
    return null;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/dashboard/stats');
        setStats(response.data);
        setSortConfig({ key: 'billNumber', direction: 'ascending' }); // Default sorting
      } catch (err) {
        setError('Failed to fetch stats' + err);
      }
    };
    fetchStats();
  }, [refresh]);

  const data = {
    labels: ['Unpaid Bills', 'Due Bills', 'Completed Orders', 'All Bills'],
    datasets: [
      {
        label: 'Count',
        data: [
          stats.unpaidBills?.length || 0,
          stats.dueBills?.length || 0,
          stats.completedOrders?.length || 0,
          stats.allBills?.length || 0,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className="w-fit">
      {error && <p>{error}</p>}
      <div className="overflow-auto">
        <table className="table w-full table-auto">
          <caption>Dashboard Stats</caption>
          <thead>
            <tr className="cursor-pointer select-none text-center">
              <th onClick={() => requestSort('billNumber')}>
                <div className="flex items-center justify-between gap-1">
                  <span className="grow">Bill No</span> {getSortIcon('billNumber')}
                </div>
              </th>
              <th onClick={() => requestSort('date')}>
                <div className="flex items-center justify-between gap-1">
                  <span className="grow">Date</span> {getSortIcon('date')}
                </div>
              </th>
              <th onClick={() => requestSort('dueDate')}>
                <div className="flex items-center justify-between gap-1">
                  <span className="grow">Due Date</span> {getSortIcon('dueDate')}
                </div>
              </th>
              <th onClick={() => requestSort('totalAmount')}>
                <div className="flex items-center justify-between gap-1">
                  <span className="grow">Total Amount</span> {getSortIcon('totalAmount')}
                </div>
              </th>
              <th onClick={() => requestSort('paidAmount')}>
                <div className="flex items-center justify-between gap-1">
                  <span className="grow">Paid Amount</span> {getSortIcon('paidAmount')}
                </div>
              </th>
              <th onClick={() => requestSort('dueAmount')}>
                <div className="flex items-center justify-between gap-1">
                  <span className="grow">Due Amount</span> {getSortIcon('dueAmount')}
                </div>
              </th>
              <th onClick={() => requestSort('paymentStatus')}>
                <div className="flex items-center justify-between gap-1">
                  <span className="grow">Pay Status</span> {getSortIcon('paymentStatus')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedBills.map((bill) => (
              <tr key={bill._id.toString()} className="text-center">
                <td>{bill.billNumber}</td>
                <td>{bill.date ? formatDS(bill.date) : 'N/A'}</td>
                <td>{bill.dueDate ? formatDS(bill.dueDate) : 'N/A'}</td>
                <td>{bill.totalAmount}</td>
                <td>{bill.paidAmount}</td>
                <td>{bill.dueAmount}</td>
                <td>{bill.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-col lg:flex-row lg:space-x-4">
        <div className="flex-1">
          <Bar data={data} options={{ maintainAspectRatio: true }} />
        </div>
        <div className="flex-1">
          <Pie data={data} options={{ maintainAspectRatio: true }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
