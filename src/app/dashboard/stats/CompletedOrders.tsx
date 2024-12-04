import { formatDSNT } from '@/app/util/format/dateUtils';
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Order {
  _id: string;
  billNumber: number;
  date: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: string;
  deliveryStatus: string; // Add this line
}

interface CompletedOrdersProps {
  refresh: boolean;
}

const CompletedOrders = ({ refresh }: CompletedOrdersProps) => {
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Order; direction: 'ascending' | 'descending' } | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 15;

  const sortedOrders = [...completedOrders].sort((a, b) => {
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

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const requestSort = (key: keyof Order) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Order) => {
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

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const response = await axios.get('/api/dashboard/stats/completedOrders');
        setCompletedOrders(response.data.completedOrders);
        setSortConfig({ key: 'deliveryStatus', direction: 'ascending' }); // Default sorting
      } catch (err) {
        setError('Failed to fetch completed orders' + err);
      }
    };
    fetchCompletedOrders();
  }, [refresh]);

  return (
    <div className="w-full">
      {error && <p>{error}</p>}
      <div className="overflow-auto">
        <table className="table w-full table-auto">
          <caption>Pending Deliveries</caption>
          <thead>
            <tr className="cursor-pointer select-none text-center">
              <th onClick={() => requestSort('billNumber')}>
                <div className="flex items-center justify-between gap-1">
                  <span className="grow">Bill Number</span> {getSortIcon('billNumber')}
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
              <th onClick={() => requestSort('deliveryStatus')}>
                <div className="flex items-center justify-between gap-1">
                  <span className="grow">Delivery Status</span> {getSortIcon('deliveryStatus')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order._id} className="text-center">
                <td>{order.billNumber}</td>
                <td>{formatDSNT(new Date(order.date))}</td>
                <td>{formatDSNT(new Date(order.dueDate))}</td>
                <td>{order.totalAmount}</td>
                <td>{order.paidAmount}</td>
                <td>{order.dueAmount}</td>
                <td>{order.paymentStatus}</td>
                <th>{order.deliveryStatus}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <span className="flex w-full justify-center">
        <div className="join pt-1.5">
          {Array.from({ length: Math.ceil(sortedOrders.length / ordersPerPage) }, (_, index) => (
            <button
              key={index + 1}
              className={`btn btn-square join-item btn-sm ${currentPage === index + 1 ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </span>
    </div>
  );
};

export default CompletedOrders;
