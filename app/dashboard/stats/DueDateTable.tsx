import { FunnelIcon as FunnelIconOutline } from '@heroicons/react/24/outline';
import { ArrowDownCircleIcon, ArrowUpCircleIcon, FunnelIcon } from '@heroicons/react/24/solid';
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

interface DueDateTableProps {
  refresh: boolean;
}

const DueDateTable = ({ refresh }: DueDateTableProps): JSX.Element => {
  const [dueDateBills, setDueDateBills] = useState<Bill[]>([]); // Initialize as an empty array
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Bill; direction: 'ascending' | 'descending' }>({
    key: 'dueDate',
    direction: 'ascending',
  }); // Initialize with default sort config
  const [tolerance, setTolerance] = useState<number>(2);
  const [showToleranceInput, setShowToleranceInput] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const billsPerPage = 15;
  const [activeIcon, setActiveIcon] = useState<keyof Bill>('dueDate'); // Set default active icon

  const toggleToleranceInput = (event: React.MouseEvent): void => {
    event.stopPropagation();
    setShowToleranceInput(!showToleranceInput);
  };

  const sortedBills = [...dueDateBills].sort((a, b) => {
    if (sortConfig === null) return 0;

    let comparison = 0;
    const { key, direction } = sortConfig;

    // Handle different column types
    switch (key) {
      case 'dueDate':
      case 'date': {
        // Date comparison with tolerance for dueDate
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        if (key === 'dueDate') {
          dateA.setDate(dateA.getDate() - tolerance);
          dateB.setDate(dateB.getDate() - tolerance);
        }
        comparison = dateA.getTime() - dateB.getTime();
        break;
      }

      case 'billNumber':
      case 'totalAmount':
      case 'paidAmount':
      case 'dueAmount':
        // Number comparison
        comparison = Number(a[key]) - Number(b[key]);
        break;

      case 'paymentStatus':
        // String comparison
        comparison = (a[key] || '').localeCompare(b[key] || '');
        break;

      default:
        comparison = 0;
    }

    return direction === 'ascending' ? comparison : -comparison;
  });

  const handleHeaderClick = (key: keyof Bill): void => {
    // When switching to a new column, set its initial sort direction to descending
    if (activeIcon !== key) {
      setActiveIcon(key);
      setSortConfig({ key, direction: 'descending' });
    }
  };

  const handleSortIconClick = (event: React.MouseEvent, key: keyof Bill): void => {
    event.stopPropagation();
    // Toggle direction only if we're clicking the same column
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

  const handleToleranceChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTolerance(Number(event.target.value));
  };

  const filteredBills = sortedBills.filter((bill) => {
    const dueDate = new Date(bill.dueDate);
    const today = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diffDays <= tolerance;
  });

  const indexOfLastBill = currentPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstBill, indexOfLastBill);

  const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

  const fetchDueDateBills = async (): Promise<void> => {
    try {
      const response = await axios.get(`/api/dashboard/stats/dueDateBills?page=${currentPage}&limit=${billsPerPage}`);
      setDueDateBills(response.data.dueDateBills);
      setSortConfig({ key: 'dueDate', direction: 'ascending' }); // Default sort by due date
    } catch (err) {
      setError('Failed to fetch due date bills' + err);
    }
  };

  useEffect(() => {
    fetchDueDateBills();
  }, [refresh, currentPage]);

  return (
    <div className="w-full">
      {error && <p>{error}</p>}
      <div className="overflow-auto">
        <table className="table w-full table-auto">
          <caption>
            <span className="badge badge-soft badge-success font-bold">Due Date Bills</span>
          </caption>
          <thead>
            <tr className="cursor-pointer select-none text-center">
              <th onClick={() => handleHeaderClick('billNumber')}>
                <div className="flex items-center justify-between gap-1">
                  <span className="grow">Bill No</span> {getSortIcon('billNumber')}
                </div>
              </th>
              <th onClick={() => handleHeaderClick('date')}>
                <div className="flex items-center justify-between gap-1">
                  <span className="grow">Date</span> {getSortIcon('date')}
                </div>
              </th>
              <th onClick={() => handleHeaderClick('dueDate')}>
                <div className="flex flex-col items-center gap-y-1">
                  <div className="flex w-full items-center justify-between gap-1">
                    <span className="grow">Due Date</span>
                    {/* Tolerance input */}
                    <span className="flex items-center gap-4">
                      <div className="indicator">
                        <span className="badge indicator-item badge-secondary indicator-top rounded-full px-1">
                          {tolerance}
                        </span>
                        {showToleranceInput ? (
                          <FunnelIcon
                            className={`h-5 w-5 cursor-pointer text-inherit`}
                            onClick={toggleToleranceInput}
                          />
                        ) : (
                          <FunnelIconOutline
                            className={`h-5 w-5 cursor-pointer text-inherit`}
                            onClick={toggleToleranceInput}
                          />
                        )}{' '}
                      </div>
                      {getSortIcon('dueDate')}
                    </span>
                  </div>
                  {showToleranceInput && (
                    <input
                      type="number"
                      value={tolerance}
                      className="input input-xs input-primary w-fit min-w-10"
                      onChange={handleToleranceChange}
                      placeholder="Tolerance in days"
                      autoCorrect="off"
                      onClick={(event) => event.stopPropagation()}
                    />
                  )}
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
            {currentBills.map((bill) => {
              const dueDate = new Date(bill.dueDate);
              const today = new Date();
              const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
              const isDueSoon = diffDays >= 0 && diffDays <= (tolerance ?? 2) && bill.paymentStatus !== 'Paid';
              const isOverdue = diffDays < 0;
              return (
                <tr
                  key={bill._id}
                  className={`text-center ${isOverdue ? 'bg-error text-error-content' : ''} ${isDueSoon ? 'bg-warning text-warning-content' : ''}`}
                >
                  <td>{bill.billNumber}</td>
                  <td className="grow">{formatDSNT(new Date(bill.date))}</td>
                  <td>
                    {formatDSNT(new Date(new Date(bill.dueDate).setDate(new Date(bill.dueDate).getDate() - tolerance)))}
                  </td>
                  <td>{bill.totalAmount}</td>
                  <td>{bill.paidAmount}</td>
                  <td>{bill.dueAmount}</td>
                  <td>{bill.paymentStatus}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredBills.length > billsPerPage && (
          <Pagination
            totalItems={filteredBills.length}
            itemsPerPage={billsPerPage}
            currentPage={currentPage}
            paginate={paginate}
          />
        )}
      </div>
    </div>
  );
};

export default DueDateTable;
