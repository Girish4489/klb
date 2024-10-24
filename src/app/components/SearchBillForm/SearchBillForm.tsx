import { formatD } from '@/app/util/format/dateUtils';
import { IBill } from '@/models/klm';
import React from 'react';

interface SearchFormProps {
  onSearch: (event: React.FormEvent<HTMLFormElement>) => void;
  searchResults: IBill[] | undefined;
  onRowClick: (billId: string) => () => void;
}

const SearchBillForm: React.FC<SearchFormProps> = ({ onSearch, searchResults, onRowClick }) => {
  const renderSearchBillDropdown = (bills: IBill[]) => (
    <div
      className={`card-body max-h-96 w-full overflow-x-auto rounded-box border-2 border-base-300 bg-base-100 ${
        bills.length === 0 && 'min-h-24 min-w-24 max-w-24'
      }`}
    >
      <table className="table table-zebra table-pin-rows">
        <caption className="px-1 py-2 font-bold">Bills</caption>
        <thead>
          <tr className="text-center">
            <th>Slno</th>
            <th>BillNumber</th>
            <th>Mobile</th>
            <th>Date</th>
            <th>Due Date</th>
            <th>U|T</th>
            <th>Total</th>
            <th>Grand</th>
            <th>Bill by</th>
          </tr>
        </thead>
        <tbody>
          {bills.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-warning">
                No bills
              </td>
            </tr>
          ) : (
            bills.map((bill, index) => (
              <tr key={index} className="hover text-center" onClick={onRowClick(bill._id.toString())}>
                <td>{index + 1}</td>
                <td>{bill.billNumber}</td>
                <td>{bill.mobile}</td>
                <td>{bill.date ? formatD(bill.date) : ''}</td>
                <td>{bill.dueDate ? formatD(bill.dueDate) : ''}</td>
                <td className="w-fit items-center font-bold">
                  {bill.urgent && <span className="text-error">U</span>}
                  {bill.urgent && bill.trail && <span>|</span>}
                  {bill.trail && <span className="text-success">T</span>}
                </td>
                <td>{bill.totalAmount}</td>
                <td>{bill.grandTotal}</td>
                <td>{bill.billBy?.name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <form onSubmit={onSearch} className="join flex flex-wrap items-center justify-between max-sm:flex-col">
      <label htmlFor="billSearch" className="join-item label-text">
        <input
          name="billSearch"
          id="billSearch"
          onFocus={(e) => e.target.select()}
          className="input input-sm join-item input-bordered input-primary w-40 bg-accent/5"
          placeholder="Search"
          required
        />
      </label>
      <select
        name="selectBill"
        aria-label="Search-bill"
        className="join-item select select-bordered select-primary select-sm"
      >
        <option value={'bill'}>Bill No</option>
        <option value={'mobile'}>Mobile</option>
      </select>
      <span className="dropdown dropdown-end dropdown-bottom w-fit">
        <button tabIndex={0} role="button" className="btn btn-primary btn-sm rounded-l-none">
          Search
        </button>
        {searchResults && (
          <div tabIndex={0} className="card dropdown-content card-compact z-[50] w-auto bg-base-300 shadow">
            {renderSearchBillDropdown(searchResults)}
          </div>
        )}
      </span>
    </form>
  );
};

export default SearchBillForm;
