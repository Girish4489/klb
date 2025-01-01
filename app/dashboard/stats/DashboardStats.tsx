import { Colors } from '@utils/colors';
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
          Colors.success,
          Colors.secondary,
          Colors.error,
          Colors.success,
          Colors.warning,
          Colors.info,
          Colors.primary,
        ],
        borderWidth: 0,
      },
    ],
  };

  const amountData = {
    labels: ['Grand Total', 'Paid Amount', 'Due Amount', 'Discount'],
    datasets: [
      {
        label: 'Amount',
        data: [stats.grandTotalAmount, stats.paidAmount, stats.dueAmount, stats.discountAmount],
        backgroundColor: [Colors.primary, Colors.success, Colors.warning, Colors.secondary],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: Colors.base,
          font: {
            family: "'Roboto', sans-serif",
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: Colors.base,
        },
        grid: {
          color: `${Colors.base}22`,
        },
      },
      x: {
        ticks: {
          color: Colors.base,
        },
        grid: {
          color: `${Colors.base}22`,
        },
      },
    },
  };

  return (
    <div className="grow">
      {error && <p>{error}</p>}
      <div className="mt-4 flex grow flex-col lg:flex-row lg:space-x-4">
        <div className="flex grow place-items-center items-center">
          <Bar data={data} options={chartOptions} />
        </div>
        <div className="flex w-3/12 flex-1 place-items-center items-center">
          <Pie data={amountData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
