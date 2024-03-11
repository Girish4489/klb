'use client';
import { formatD } from '@/app/util/format/dateUtils';
import { ApiGet, ApiPost } from '@/app/util/makeApiRequest/makeApiRequest';
import { IBill, IReceipt } from '@/models/klm';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

interface AmtTrack {
  total: number;
  grand: number;
  paid: number;
  due: number;
}

export default function RecieptPage() {
  const [searchBill, setSearchBill] = React.useState<IBill[] | undefined>(undefined);
  const [receipt, setReceipt] = React.useState<IReceipt>();
  const [recentReceipt, setRecentReceipt] = React.useState<IReceipt[] | undefined>(undefined);
  const [searchReceipt, setSearchReceipt] = React.useState<IReceipt[] | undefined>(undefined);
  const router = useRouter();
  const [amtTrack, setAmtTrack] = React.useState<AmtTrack>({
    total: 0,
    grand: 0,
    paid: 0,
    due: 0,
  });

  React.useEffect(() => {
    const fetchLastReceipt = async () => {
      try {
        const res = await ApiGet.Receipt.RecentReceipt();
        if (res.success === true) {
          setRecentReceipt(res.recentReceipt);
        } else {
          throw new Error(res.message);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    fetchLastReceipt();
  }, []);

  const billSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const inputValue: number = (event.target as HTMLFormElement).billSearch.value;
      const typeBillOrMobile: string = (event.target as HTMLFormElement).selectBill.value;

      const res = await ApiGet.Bill.BillSearch(inputValue, typeBillOrMobile);

      if (res.success === true) {
        setSearchBill(res.bill);
      } else {
        setSearchBill(undefined);
        throw new Error(res.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const receiptSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const inputValue: number = (event.target as HTMLFormElement).receiptSearch.value;
      const typeReceiptOrBillOrMobile: string = (event.target as HTMLFormElement).selectReceipt.value;

      const res = await ApiGet.Receipt.ReceiptSearch(inputValue, typeReceiptOrBillOrMobile);

      if (res.success === true) {
        setSearchReceipt(res.receipt);
      } else {
        setSearchReceipt(undefined);
        throw new Error(res.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const saveReceipt = async () => {
    try {
      if (receipt?.amount === 0) {
        throw new Error('Amount cannot be zero');
      }
      if (receipt?.bill?.billNumber === 0) {
        throw new Error('Bill number cannot be zero');
      }
      if (receipt?.paymentMethod === '') {
        throw new Error('Payment method cannot be empty');
      }
      if (receipt?.paymentDate?.toISOString() === '') {
        throw new Error('Payment date cannot be empty');
      }
      if (amtTrack.due < 0) {
        throw new Error('Amount exceeds due');
      }
      const res = await ApiPost.Receipt.SaveReceipt(receipt as IReceipt);
      if (res.success === true) {
        toast.success('Receipt saved');
        setReceipt(undefined);
        setRecentReceipt([res.receipt, ...(recentReceipt ?? [])]);
        setAmtTrack({
          total: 0,
          grand: 0,
          paid: 0,
          due: 0,
        });
      } else {
        throw new Error(res.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  async function createNewReceipt() {
    setSearchBill(undefined);
    const lastReceipt = await ApiGet.Receipt.LastReceipt();
    await setReceipt({
      ...receipt,
      receiptNumber: (lastReceipt?.lastReceipt?.receiptNumber ?? 0) + 1,
      bill: {
        ...receipt?.bill,
      },
      amount: 0,
      paymentDate: new Date(),
      paymentMethod: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IReceipt);
  }

  const searchRowClicked = (billId: string) => async () => {
    try {
      const selectedBill = await (searchBill ?? []).find((bill) => bill._id === billId);
      if (selectedBill) {
        const lastReceipt = await ApiGet.Receipt.LastReceipt();
        setReceipt({
          ...receipt,
          receiptNumber: (lastReceipt?.lastReceipt?.receiptNumber ?? 0) + 1,
          bill: {
            ...receipt?.bill,
            _id: selectedBill._id,
            billNumber: selectedBill.billNumber,
            name: selectedBill.name,
            mobile: selectedBill.mobile,
          },
          paymentDate: new Date(),
          paymentMethod: '',
          updatedAt: new Date(),
        } as IReceipt);
        setAmtTrack({
          total: selectedBill.totalAmount,
          grand: selectedBill.grandTotal,
          paid: selectedBill.paidAmount,
          due: selectedBill.dueAmount,
        });
        setSearchBill(undefined);
      } else {
        toast.error('Bill not found');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const recentReceiptTable = (receipt: IReceipt[], caption: string) => {
    return (
      <table className="table table-zebra table-pin-rows">
        <caption className="px-1 py-2 font-bold">{caption}</caption>
        {receipt?.length === 0 && (
          <tbody>
            <tr>
              <td colSpan={8} className="text-warning">
                No receipts
              </td>
            </tr>
          </tbody>
        )}
        {receipt?.length > 0 && (
          <>
            <thead>
              <tr className="text-center">
                <th>Slno</th>
                <th>Receipt Number</th>
                <th>Bill Number</th>
                <th>Mobile</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Print</th>
              </tr>
            </thead>
            <tbody>
              {receipt?.map((receipt: IReceipt, index: number) => (
                <React.Fragment key={index}>
                  <tr className="hover text-center">
                    <td>{index + 1}</td>
                    <td>{receipt?.receiptNumber}</td>
                    <td>{receipt?.bill?.billNumber}</td>
                    <td>{receipt?.bill?.mobile}</td>
                    <td>{receipt?.paymentDate ? formatD(receipt?.paymentDate) : ''}</td>
                    <td>{receipt?.amount}</td>
                    <td>{receipt?.paymentMethod}</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-xs"
                        onClick={async () => {
                          router.push(`/print-preview?billNumber=${receipt?.receiptNumber}&type=Receipt`);
                        }}
                      >
                        Print
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </>
        )}
      </table>
    );
  };

  return (
    <div className="flex grow flex-col gap-1">
      <span className="flex min-w-fit flex-row flex-wrap items-center justify-between gap-2 rounded-box bg-accent/10 px-3 py-1.5 backdrop-blur-xl max-sm:flex-col">
        <button className="btn btn-primary btn-sm" onClick={createNewReceipt}>
          New Receipt
        </button>
        <form onSubmit={billSearch} className="join flex flex-wrap items-center justify-between max-sm:flex-col">
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
            {searchBill && (
              <div tabIndex={0} className="card dropdown-content card-compact z-[50] w-auto bg-base-300 shadow">
                <div
                  className={`card-body max-h-96 w-full overflow-x-auto rounded-box border-2 border-base-300 bg-base-100 ${searchBill.length === 0 && 'min-h-24 min-w-24 max-w-24'}`}
                >
                  <table className="table table-zebra table-pin-rows">
                    <caption className="px-1 py-2 font-bold">Bills</caption>
                    {searchBill.length === 0 && (
                      <tbody>
                        <tr>
                          <td colSpan={5} className="text-warning">
                            No bills
                          </td>
                        </tr>
                      </tbody>
                    )}
                    {searchBill.length > 0 && (
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
                    )}
                    <tbody>
                      {searchBill.length > 0 && (
                        <>
                          {searchBill.map((bill: IBill, index: number) => (
                            <React.Fragment key={index}>
                              <tr className="hover text-center" onClick={searchRowClicked(bill._id)}>
                                <td>{index + 1}</td>
                                <td>{bill?.billNumber}</td>
                                <td>{bill?.mobile}</td>
                                <td>{bill?.date ? formatD(bill?.date) : ''}</td>
                                <td>{bill?.dueDate ? formatD(bill?.dueDate) : ''}</td>
                                <td className="w-fit items-center font-bold">
                                  {bill?.urgent && <span className={'text-error'}>U</span>}
                                  {bill?.urgent && bill.trail && <span>|</span>}
                                  {bill?.trail && <span className={'text-success'}>T</span>}
                                </td>
                                <td>{bill?.totalAmount}</td>
                                <td>{bill?.grandTotal}</td>
                                <td>{bill?.billBy?.name}</td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </span>
        </form>
      </span>
      <div className="flex grow flex-col gap-1 rounded p-1">
        <div className="flex flex-col gap-px rounded-box bg-base-200 p-2">
          <h1 className="text-center font-bold">Receipt</h1>
          <div className="flex flex-row flex-wrap items-center gap-1 p-1">
            <div className="flex flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
              <label className="label label-text" htmlFor="receiptNo">
                Receipt No
              </label>
              <input
                name="receiptNo"
                placeholder="Receipt No"
                id="receiptNo"
                type="number"
                value={receipt?.receiptNumber ?? ''}
                onChange={(e) => {
                  const limitedValue = e.target.value.slice(0, 7);
                  const parsedValue = limitedValue === '' ? '' : parseInt(limitedValue);
                  setReceipt({ ...receipt, receiptNumber: parsedValue } as IReceipt);
                }}
                className="input input-sm input-bordered input-primary w-32"
                required
              />
            </div>
            <div className="flex flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
              <label className="label label-text" htmlFor="billNo">
                Bill No
              </label>
              <input
                name="billNo"
                id="billNo"
                placeholder="Bill No"
                type="number"
                value={receipt?.bill?.billNumber ?? ''}
                onChange={(e) => {
                  const limitedValue = e.target.value.slice(0, 7);
                  const parsedValue = limitedValue === '' ? '' : parseInt(limitedValue);
                  setReceipt({ ...receipt, bill: { ...receipt?.bill, billNumber: parsedValue } } as IReceipt);
                }}
                className="input input-sm input-bordered input-primary w-32"
                required
              />
            </div>
            <div className="flex flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
              <label className="label label-text" htmlFor="name">
                Name
              </label>
              <input
                name="name"
                id="name"
                placeholder="Name"
                type="text"
                value={receipt?.bill?.name ?? ''}
                onChange={(e) => {
                  setReceipt({ ...receipt, bill: { ...receipt?.bill, name: e.target.value } } as IReceipt);
                }}
                className="input input-sm input-bordered input-primary w-32"
              />
            </div>
            <div className="flex flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
              <label className="label label-text" htmlFor="mobile">
                Mobile
              </label>
              <input
                name="mobile"
                id="mobile"
                placeholder="Mobile"
                type="tel"
                value={receipt?.bill?.mobile ?? ''}
                onChange={(e) => {
                  setReceipt({ ...receipt, bill: { ...receipt?.bill, mobile: parseInt(e.target.value) } } as IReceipt);
                }}
                className="input input-sm input-bordered input-primary w-32"
              />
            </div>
            <div className="flex flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
              <label className="label label-text" htmlFor="receiptDate">
                Date
              </label>
              <input
                name="receiptDate"
                id="receiptDate"
                type="date"
                value={receipt?.paymentDate?.toISOString().split('T')[0] ?? ''}
                onChange={(e) => {
                  setReceipt({ ...receipt, paymentDate: new Date(e.target.value) } as IReceipt);
                }}
                className="input input-sm input-bordered input-primary"
              />
            </div>
            <div className="flex flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
              <label className="label label-text" htmlFor="receiptAmount">
                Amount
              </label>
              <input
                name="receiptAmount"
                id="receiptAmount"
                placeholder="Amount"
                type="number"
                value={receipt?.amount ?? ''}
                onChange={(e) => {
                  const limitedValue = e.target.value.slice(0, 7);
                  const parsedValue = limitedValue === '' ? '' : parseInt(limitedValue);
                  setReceipt({ ...receipt, amount: parsedValue } as IReceipt);
                }}
                className="input input-sm input-bordered input-primary w-32"
                required
              />
            </div>
            <div className="flex flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
              <label className="label label-text" htmlFor="paymentMethod">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                id="paymentMethod"
                value={receipt?.paymentMethod ?? ''}
                onChange={(e) => {
                  setReceipt({ ...receipt, paymentMethod: e.target.value } as IReceipt);
                }}
                className="select select-bordered select-primary select-sm w-32"
              >
                <option value="">Select</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </select>{' '}
            </div>
          </div>
          <div className="rounded bg-warning/15">
            <div className="flex flex-row flex-wrap items-center justify-center gap-2 p-1">
              {Object.entries(amtTrack).map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-row flex-wrap items-center gap-1 max-sm:w-full max-sm:justify-between"
                >
                  <h3 className="label-text font-bold">{key.charAt(0).toUpperCase() + key.slice(1)}: </h3>
                  <h3 className="label-text">{key === 'due' ? value - (receipt?.amount ?? 0) : (value as number)}</h3>
                </div>
              ))}
            </div>
          </div>
          <button className="btn btn-primary btn-sm mx-2" onClick={saveReceipt}>
            Save
          </button>
        </div>
        <div className="receiptTrack flex grow flex-col rounded-box bg-base-300/80 p-2">
          <div className="searchReceipt flex">
            <form onSubmit={receiptSearch} className="join flex flex-wrap items-center justify-between max-sm:flex-col">
              <label htmlFor="receiptSearch" className="join-item label-text">
                <input
                  name="receiptSearch"
                  id="receiptSearch"
                  onFocus={(e) => e.target.select()}
                  className="input input-sm join-item input-bordered input-primary w-40 bg-accent/5"
                  placeholder="Search"
                  required
                />
              </label>
              <select
                name="selectReceipt"
                aria-label="Search-receipt"
                className="join-item select select-bordered select-primary select-sm"
              >
                <option value={'receipt'}>Receipt No</option>
                <option value={'bill'}>Bill No</option>
                <option value={'mobile'}>Mobile</option>
              </select>
              <span className="dropdown dropdown-end dropdown-bottom w-fit">
                <button tabIndex={0} role="button" className="btn btn-primary btn-sm rounded-l-none">
                  Search
                </button>
              </span>
            </form>
          </div>
          {searchReceipt && <span>{recentReceiptTable(searchReceipt ?? [], 'Searched Receipts')}</span>}
          {recentReceipt && <span>{recentReceiptTable(recentReceipt ?? [], 'Recent Receipts')}</span>}
        </div>
      </div>
    </div>
  );
}
