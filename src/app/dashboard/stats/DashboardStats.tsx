import { getComputedStyleValue } from '@utils/Styles';
import axios from 'axios';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { JSX, useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

interface DashboardStatsProps {
  refresh: boolean;
}

interface Stats {
  unpaidBillsCount: number;
  partiallyPaidBillsCount: number;
  paidBillsCount: number;
  pendingDeliveryBillsCount: number;
  deliveredBillsCount: number;
  totalBillsCount: number;
  grandTotalAmount: number;
  paidAmount: number;
  dueAmount: number;
  discountAmount: number;
  discountCount: number;
}

const DashboardStats = ({ refresh }: DashboardStatsProps): JSX.Element => {
  const [stats, setStats] = useState<Stats>({
    unpaidBillsCount: 0,
    partiallyPaidBillsCount: 0,
    paidBillsCount: 0,
    pendingDeliveryBillsCount: 0,
    deliveredBillsCount: 0,
    totalBillsCount: 0,
    grandTotalAmount: 0,
    paidAmount: 0,
    dueAmount: 0,
    discountAmount: 0,
    discountCount: 0,
  });
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchStats = async (): Promise<void> => {
      try {
        const response = await axios.get('/api/dashboard/stats/dashboardStats');
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch stats' + err);
      }
    };
    fetchStats();
  }, [refresh]);

  const data = {
    labels: ['Paid', 'Partially Paid', 'Unpaid Bills', 'Delivered', 'Pending Delivery', 'Discounted', 'Total Bills'],
    datasets: [
      {
        label: 'Count',
        data: [
          stats.paidBillsCount,
          stats.partiallyPaidBillsCount,
          stats.unpaidBillsCount,
          stats.deliveredBillsCount,
          stats.pendingDeliveryBillsCount,
          stats.discountCount,
          stats.totalBillsCount,
        ],
        backgroundColor: [
          getComputedStyleValue('bg-success', 'background-color'),
          getComputedStyleValue('bg-secondary', 'background-color'),
          getComputedStyleValue('bg-error', 'background-color'),
          getComputedStyleValue('bg-success', 'background-color'),
          getComputedStyleValue('bg-warning', 'background-color'),
          getComputedStyleValue('bg-info', 'background-color'),
          getComputedStyleValue('bg-primary', 'background-color'),
        ],
      },
    ],
  };

  const amountData = {
    labels: ['Grand Total', 'Paid Amount', 'Due Amount', 'Discount'],
    datasets: [
      {
        label: 'Amount',
        data: [stats.grandTotalAmount, stats.paidAmount, stats.dueAmount, stats.discountAmount],
        backgroundColor: [
          getComputedStyleValue('bg-primary', 'background-color'),
          getComputedStyleValue('bg-success', 'background-color'),
          getComputedStyleValue('bg-warning', 'background-color'),
          getComputedStyleValue('bg-secondary', 'background-color'),
        ],
      },
    ],
  };

  return (
    <div className="grow">
      {error && <p>{error}</p>}
      <div className="mt-4 flex grow flex-col lg:flex-row lg:space-x-4">
        <div className="flex flex-grow place-items-center items-center">
          <Bar data={data} options={{ maintainAspectRatio: true }} />
        </div>
        <div className="flex w-3/12 flex-1 place-items-center items-center">
          <Pie data={amountData} options={{ maintainAspectRatio: true }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
