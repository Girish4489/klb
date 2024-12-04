import { formatDSNT } from '@/app/util/format/dateUtils';
import { FunnelIcon as FunnelIconOutline } from '@heroicons/react/24/outline';
import { ArrowDownCircleIcon, ArrowUpCircleIcon, FunnelIcon } from '@heroicons/react/24/solid';
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
  const [tolerance, setTolerance] = useState<number>(2);
  const [showToleranceInput, setShowToleranceInput] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const billsPerPage = 15;

  const toggleToleranceInput = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowToleranceInput(!showToleranceInput);
  };

  const sortedBills = [...dueDateBills].sort((a, b) => {
    const adjustedDueDateA = new Date(a.dueDate);
    adjustedDueDateA.setDate(adjustedDueDateA.getDate() - tolerance);
    const adjustedDueDateB = new Date(b.dueDate);
    adjustedDueDateB.setDate(adjustedDueDateB.getDate() - tolerance);

    if (sortConfig !== null) {
      if (adjustedDueDateA < adjustedDueDateB) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (adjustedDueDateA > adjustedDueDateB) {
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

  const handleToleranceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchDueDateBills = async () => {
      try {
        const response = await axios.get('/api/dashboard/stats/dueDateBills');
        setDueDateBills(response.data.dueDateBills);
        setSortConfig({ key: 'dueDate', direction: 'descending' }); // Default sort by due date
      } catch (err) {
        setError('Failed to fetch due date bills' + err);
      }
    };
    fetchDueDateBills();
  }, [refresh]);

  return (
    <div className="w-full">
      {error && <p>{error}</p>}
      <div className="overflow-auto">
        <table className="table w-full table-auto">
          <caption>Due Date Bills</caption>
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
            {currentBills.map((bill) => {
              const dueDate = new Date(bill.dueDate);
              const today = new Date();
              const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
              const isDueSoon = diffDays >= 0 && diffDays <= (tolerance ?? 2) && bill.paymentStatus !== 'Paid';
              const isOverdue = diffDays < 0;
              return (
                <tr
                  key={bill._id}
                  className={`text-center ${isOverdue ? 'bg-error' : ''} ${isDueSoon ? 'bg-warning' : ''}`}
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
        <span className="flex w-full justify-center">
          <div className="join pt-1.5">
            {Array.from({ length: Math.ceil(filteredBills.length / billsPerPage) }, (_, index) => (
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
    </div>
  );
};

export default DueDateTable;
