import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import { formatDSNT } from '@utils/format/dateUtils';
import axios from 'axios';
import { JSX, useEffect, useState } from 'react';
import Pagination from './Pagination';

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

const AllBills = ({ refresh }: AllBillsProps): JSX.Element => {
  const [bills, setBills] = useState<Bill[]>([]); // Initialize as an empty array
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Bill; direction: 'ascending' | 'descending' }>({
    key: 'billNumber',
    direction: 'descending',
  });
  const [activeIcon, setActiveIcon] = useState<keyof Bill>('billNumber');
  const [currentPage, setCurrentPage] = useState(1);
  const billsPerPage = 15;
  const [totalBills, setTotalBills] = useState(0);

  const sortedBills = [...bills].sort((a, b) => {
    let comparison = 0;
    const { key, direction } = sortConfig;

    switch (key) {
      case 'dueDate':
      case 'date': {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        comparison = dateA.getTime() - dateB.getTime();
        break;
      }
      case 'billNumber':
      case 'totalAmount':
      case 'paidAmount':
      case 'dueAmount':
        comparison = Number(a[key]) - Number(b[key]);
        break;

      case 'paymentStatus':
        comparison = (a[key] || '').localeCompare(b[key] || '');
        break;

      default:
        comparison = 0;
    }

    return direction === 'ascending' ? comparison : -comparison;
  });

  const currentBills = sortedBills;

  const handleHeaderClick = (key: keyof Bill): void => {
    if (activeIcon !== key) {
      setActiveIcon(key);
      setSortConfig({ key, direction: 'descending' });
    }
  };

  const handleSortIconClick = (event: React.MouseEvent, key: keyof Bill): void => {
    event.stopPropagation();
    const direction = sortConfig.key === key && sortConfig.direction === 'descending' ? 'ascending' : 'descending';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Bill): JSX.Element | null => {
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

  const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

  const fetchBills = async (): Promise<void> => {
    try {
      const response = await axios.get(`/api/dashboard/stats/allBills?page=${currentPage}&limit=${billsPerPage}`);
      setBills(response.data.bills || []); // Ensure bills is an array
      setTotalBills(response.data.totalBills);
      setSortConfig({ key: 'billNumber', direction: 'descending' }); // Default sorting
    } catch (err) {
      setError('Failed to fetch bills' + err);
    }
  };

  useEffect(() => {
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
            <caption>
              <span className="badge badge-soft badge-success font-bold">All Bills</span>
            </caption>
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
      {totalBills > billsPerPage && (
        <Pagination totalItems={totalBills} itemsPerPage={billsPerPage} currentPage={currentPage} paginate={paginate} />
      )}
    </div>
  );
};

export default AllBills;