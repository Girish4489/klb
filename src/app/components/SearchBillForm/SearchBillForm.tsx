import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { IBill } from '@models/klm';
import { formatD } from '@utils/format/dateUtils';
import { FC, FormEvent, JSX } from 'react';

interface SearchFormProps {
  onSearch: (event: FormEvent<HTMLFormElement>) => void;
  searchResults: IBill[] | undefined;
  onRowClick: (billId: string) => () => void;
}

const SearchBillForm: FC<SearchFormProps> = ({ onSearch, searchResults, onRowClick }) => {
  const renderSearchBillDropdown = (bills: IBill[]): JSX.Element => (
    <div
      className={`card-body rounded-box border-base-300 bg-base-100 ring-primary m-0 max-h-96 w-full overflow-x-auto border-2 p-1 ring-1 ${
        bills.length === 0 && 'min-h-24 min-w-24 max-w-24'
      }`}
    >
      <table className="table-zebra table-pin-rows rounded-box bg-base-200 table w-full">
        <caption className="rounded-t-box bg-neutral p-1 font-bold">Bills</caption>
        <thead>
          <tr className="rounded-t-box bg-base-300 text-center">
            <th>Slno</th>
            <th>Bill No</th>
            <th>Mobile</th>
            <th>Date</th>
            <th>Due Date</th>
            <th>U|T</th>
            <th>Total</th>
            {/* <th>Grand</th> */}
            <th>Bill by</th>
          </tr>
        </thead>
        <tbody>
          {bills.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-warning">
                No bills
              </td>
            </tr>
          ) : (
            bills.map((bill, index) => (
              <tr
                key={index}
                className="hover text-center hover:cursor-pointer"
                onClick={onRowClick(bill._id.toString())}
              >
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
                <td>{bill.billBy?.name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <form onSubmit={onSearch} className="join">
      <label
        htmlFor="billSearch"
        className="input input-sm join-item label-text input-bordered input-primary bg-accent/5 flex items-center gap-2 lg:rounded-l-full"
      >
        <MagnifyingGlassIcon className="join-item text-primary h-5 w-5" />
        <input
          name="billSearch"
          id="billSearch"
          onFocus={(e) => e.target.select()}
          className="join-item w-40"
          placeholder="Search"
          required
        />
      </label>
      <select
        name="selectBill"
        aria-label="Search-bill"
        className="join-item select select-bordered select-primary select-sm lg:min-w-28"
      >
        <option value={'bill'}>Bill No</option>
        <option value={'mobile'}>Mobile</option>
      </select>
      <span className="dropdown dropdown-end dropdown-bottom w-fit">
        <button tabIndex={0} role="button" className="btn btn-primary btn-sm rounded-r-full">
          <MagnifyingGlassIcon className="join-item h-5 w-5" />
        </button>
        {searchResults && (
          <div
            tabIndex={0}
            className="card dropdown-content card-compact bg-base-300 shadow-base-300 z-50 w-auto shadow-inner"
          >
            {renderSearchBillDropdown(searchResults)}
          </div>
        )}
      </span>
    </form>
  );
};

export default SearchBillForm;
