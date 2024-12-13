import Pagination from '@dashboard/stats/Pagination';
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import { formatDSNT } from '@util/format/dateUtils';
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
  const [sortConfig, setSortConfig] = useState<{ key: keyof Order; direction: 'ascending' | 'descending' }>({
    key: 'deliveryStatus',
    direction: 'ascending',
  });
  const [activeIcon, setActiveIcon] = useState<keyof Order>('deliveryStatus');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 15;

  const sortedOrders = [...completedOrders].sort((a, b) => {
    let comparison = 0;
    const { key, direction } = sortConfig;

    switch (key) {
      case 'dueDate':
      case 'date':
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        comparison = dateA.getTime() - dateB.getTime();
        break;

      case 'billNumber':
      case 'totalAmount':
      case 'paidAmount':
      case 'dueAmount':
        comparison = Number(a[key]) - Number(b[key]);
        break;

      case 'paymentStatus':
      case 'deliveryStatus':
        comparison = (a[key] || '').localeCompare(b[key] || '');
        break;

      default:
        comparison = 0;
    }

    return direction === 'ascending' ? comparison : -comparison;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleHeaderClick = (key: keyof Order) => {
    if (activeIcon !== key) {
      setActiveIcon(key);
      setSortConfig({ key, direction: 'descending' });
    }
  };

  const handleSortIconClick = (event: React.MouseEvent, key: keyof Order) => {
    event.stopPropagation();
    const direction = sortConfig.key === key && sortConfig.direction === 'descending' ? 'ascending' : 'descending';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Order) => {
    if (activeIcon !== key) return null;

    return (
      <span className="btn btn-circle btn-info btn-xs">
        {sortConfig.direction === 'ascending' ? (
          <ArrowUpCircleIcon
            className="h-5 w-5 cursor-pointer text-inherit transition-transform duration-300"
            onClick={(e) => handleSortIconClick(e, key)}
          />
        ) : (
          <ArrowDownCircleIcon
            className="h-5 w-5 cursor-pointer text-inherit transition-transform duration-300"
            onClick={(e) => handleSortIconClick(e, key)}
          />
        )}
      </span>
    );
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const response = await axios.get('/api/dashboard/stats/completedOrders');
        setCompletedOrders(response.data.completedOrders);
        setSortConfig({ key: 'deliveryStatus', direction: 'ascending' });
        setActiveIcon('deliveryStatus');
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
              <th onClick={() => handleHeaderClick('billNumber')}>
                <div className="flex items-center justify-between gap-1">
                  <span className="grow">Bill Number</span> {getSortIcon('billNumber')}
                </div>
              </th>
              <th onClick={() => handleHeaderClick('date')}>
                <div className="flex items-center justify-between gap-1">
                  <span className="grow">Date</span> {getSortIcon('date')}
                </div>
              </th>
              <th onClick={() => handleHeaderClick('dueDate')}>
                <div className="flex items-center justify-between gap-1">
                  <span className="grow">Due Date</span> {getSortIcon('dueDate')}
                </div>
              </th>
              <th onClick={() => handleHeaderClick('totalAmount')}>
                <div className="flex items-center justify-between gap-1">
                  <span className="grow">Total Amount</span> {getSortIcon('totalAmount')}
                </div>
              </th>
              <th onClick={() => handleHeaderClick('paidAmount')}>
                <div className="flex items-center justify-between gap-1">
                  <span className="grow">Paid Amount</span> {getSortIcon('paidAmount')}
                </div>
              </th>
              <th onClick={() => handleHeaderClick('dueAmount')}>
                <div className="flex items-center justify-between gap-1">
                  <span className="grow">Due Amount</span> {getSortIcon('dueAmount')}
                </div>
              </th>
              <th onClick={() => handleHeaderClick('paymentStatus')}>
                <div className="flex items-center justify-between gap-1">
                  <span className="grow">Pay Status</span> {getSortIcon('paymentStatus')}
                </div>
              </th>
              <th onClick={() => handleHeaderClick('deliveryStatus')}>
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
      <Pagination
        totalItems={sortedOrders.length}
        itemsPerPage={ordersPerPage}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
};

export default CompletedOrders;
