import { formatDSNT } from '@/app/util/format/dateUtils';
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/solid';
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

interface AllBillsProps {
  refresh: boolean;
}

const AllBills = ({ refresh }: AllBillsProps) => {
  const [bills, setBills] = useState<Bill[]>([]); // Initialize as an empty array
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Bill; direction: 'descending' | 'ascending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const billsPerPage = 15;
  const [totalBills, setTotalBills] = useState(0);

  const sortedBills = [...bills].sort((a, b) => {
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

  const currentBills = sortedBills;

  const requestSort = (key: keyof Bill) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Bill) => {
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
    const fetchBills = async () => {
      try {
        const response = await axios.get(`/api/dashboard/stats/allBills?page=${currentPage}&limit=${billsPerPage}`);
        setBills(response.data.bills || []); // Ensure bills is an array
        setTotalBills(response.data.totalBills);
        setSortConfig({ key: 'billNumber', direction: 'descending' }); // Default sorting
      } catch (err) {
        setError('Failed to fetch bills' + err);
      }
    };
    fetchBills();
  }, [refresh, currentPage]);

  return (
    <div className="w-full">
      {error && <p>{error}</p>}
      {bills.length === 0 ? (
        <p>No bills to load</p>
      ) : (
        <div className="overflow-auto">
          <table className="table w-full table-auto">
            <caption>All Bills</caption>
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
                    <span className="grow">Status</span> {getSortIcon('paymentStatus')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentBills.map((bill) => (
                <tr key={bill._id} className="text-center">
                  <td>{bill.billNumber}</td>
                  <td>{formatDSNT(new Date(bill.date))}</td>
                  <td>{formatDSNT(new Date(bill.dueDate))}</td>
                  <td>{bill.totalAmount}</td>
                  <td>{bill.paidAmount}</td>
                  <td>{bill.dueAmount}</td>
                  <td>{bill.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <span className="flex w-full justify-center">
        <div className="join pt-1.5">
          {Array.from({ length: Math.ceil(totalBills / billsPerPage) }, (_, index) => (
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

export default AllBills;