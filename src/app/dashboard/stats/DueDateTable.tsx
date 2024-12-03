import axios from 'axios';
import { useEffect, useState } from 'react';

interface Bill {
  _id: string;
  billNumber: number;
  date: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: string;
}

interface DueDateTableProps {
  refresh: boolean;
}

const DueDateTable = ({ refresh }: DueDateTableProps) => {
  const [dueDateBills, setDueDateBills] = useState<Bill[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Bill; direction: 'ascending' | 'descending' } | null>(null);

  const sortedBills = [...dueDateBills].sort((a, b) => {
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

  const requestSort = (key: keyof Bill) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const fetchDueDateBills = async () => {
      try {
        const response = await axios.get('/api/dashboard/stats/dueDateBills');
        setDueDateBills(response.data.dueDateBills);
      } catch (err) {
        setError('Failed to fetch due date bills' + err);
      }
    };
    fetchDueDateBills();
  }, [refresh]);

  return (
    <div className="w-fit">
      {error && <p>{error}</p>}
      <div className="overflow-auto">
        <table className="table w-full table-auto">
          <caption>Due Date Bills</caption>
          <thead>
            <tr className="text-center">
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
            {sortedBills.map((bill) => (
              <tr key={bill._id} className="text-center">
                <td>{bill.billNumber}</td>
                <td>{new Date(bill.date).toLocaleDateString()}</td>
                <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
                <td>{bill.totalAmount}</td>
                <td>{bill.paidAmount}</td>
                <td>{bill.dueAmount}</td>
                <td>{bill.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DueDateTable;
