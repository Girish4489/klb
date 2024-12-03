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

  const requestSort = (key: keyof Order) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const response = await axios.get('/api/dashboard/stats/completedOrders');
        setCompletedOrders(response.data.completedOrders);
      } catch (err) {
        setError('Failed to fetch completed orders' + err);
      }
    };
    fetchCompletedOrders();
  }, [refresh]);

  return (
    <div className="w-fit">
      {error && <p>{error}</p>}
      <div className="overflow-auto">
        <table className="table w-full table-auto">
          <caption>Completed Orders</caption>
          <thead>
            <tr>
              <th onClick={() => requestSort('billNumber')}>Bill Number</th>
              <th onClick={() => requestSort('date')}>Date</th>
              <th onClick={() => requestSort('dueDate')}>Due Date</th>
              <th onClick={() => requestSort('totalAmount')}>Total Amount</th>
              <th onClick={() => requestSort('paidAmount')}>Paid Amount</th>
              <th onClick={() => requestSort('dueAmount')}>Due Amount</th>
              <th onClick={() => requestSort('paymentStatus')}>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => (
              <tr key={order._id} className="text-center">
                <td>{order.billNumber}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>{new Date(order.dueDate).toLocaleDateString()}</td>
                <td>{order.totalAmount}</td>
                <td>{order.paidAmount}</td>
                <td>{order.dueAmount}</td>
                <td>{order.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompletedOrders;
