import { CalendarIcon, CurrencyRupeeIcon, MagnifyingGlassIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/solid';
import { IBill } from '@models/klm';
import { formatD } from '@utils/format/dateUtils';
import { FC, FormEvent, JSX, useRef } from 'react';

interface SearchFormProps {
  onSearch: (event: FormEvent<HTMLFormElement>) => void;
  searchResults: IBill[] | undefined;
  onRowClick: (billId: string) => () => void;
}

const SearchBillForm: FC<SearchFormProps> = ({ onSearch, searchResults, onRowClick }) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (formRef.current) {
      const event = new SubmitEvent('submit', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'target', { value: formRef.current });
      onSearch(event as unknown as FormEvent<HTMLFormElement>);
    }
  };

  const renderSearchList = (bills: IBill[]): JSX.Element => (
    <ul className="bg-base-200 rounded-box ring-primary flex max-h-[80vh] w-96 flex-col overflow-y-auto p-2 ring">
      <li className="p-4 pb-2 text-center text-xs tracking-wide opacity-60">Search Results</li>
      <div className="divider my-0"></div>
      {bills.length === 0 ? (
        <li className="text-warning list-row">No bills found</li>
      ) : (
        bills.map((bill, index) => (
          <li key={bill._id.toString()}>
            {index > 0 && <div className="divider my-0"></div>}
            <div
              className="hover:bg-neutral rounded-selector grid items-center gap-y-1 p-2 hover:cursor-pointer"
              onClick={onRowClick(bill._id.toString())}
            >
              <div className="row-span-4 items-center bg-opacity-60 text-center text-4xl font-thin tabular-nums">
                {bill.billNumber}
              </div>
              <div className="badge badge-secondary badge-soft col-start-2 w-full bg-opacity-70 text-sm">
                <PhoneIcon className="h-4 w-4" />
                {bill.mobile}
              </div>
              <div className="col-start-3 flex grow items-center justify-center gap-1">
                {bill.urgent && <div className="badge badge-error badge-sm">U</div>}
                {bill.trail && <div className="badge badge-success badge-sm">T</div>}
              </div>
              <div className="badge badge-soft badge-secondary col-start-4 w-full text-sm">
                <CurrencyRupeeIcon className="h-4 w-4" />
                {bill.totalAmount}
              </div>
              <div className="badge badge-soft badge-secondary col-span-3 col-start-2 row-start-2 h-full w-full text-sm">
                <CalendarIcon className="h-4 w-4" />
                <span className="text-wrap">{bill.date ? formatD(bill.date) : '-'}</span>
              </div>
              <div className="badge badge-soft badge-secondary col-span-3 col-start-2 row-start-3 h-full w-full text-sm">
                <CalendarIcon className="h-4 w-4" />
                <span className="text-wrap">{bill.dueDate ? formatD(bill.dueDate) : '-'}</span>
              </div>
              {bill.billBy?._id && (
                <div className="badge badge-soft badge-secondary col-span-3 col-start-2 row-start-4 text-sm">
                  <UserIcon className="h-4 w-4" />
                  {bill.billBy?.name}
                </div>
              )}
            </div>
          </li>
        ))
      )}
    </ul>
  );

  return (
    <form ref={formRef} className="join">
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
        <option value="bill">Bill No</option>
        <option value="mobile">Mobile</option>
      </select>
      <div className="dropdown dropdown-open dropdown-end">
        <div className="flex">
          <button
            type="button"
            className="btn btn-primary btn-sm rounded-r-full"
            onClick={handleSearch}
            data-popover-target="search-results"
          >
            <MagnifyingGlassIcon className="join-item h-5 w-5" />
          </button>
        </div>
        {searchResults && (
          <div
            id="search-results"
            className="dropdown-content z-[5] mt-2"
            data-popover="search-results"
            data-popover-placement="bottom-end"
          >
            {renderSearchList(searchResults)}
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBillForm;
