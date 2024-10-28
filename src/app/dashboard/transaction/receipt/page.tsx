'use client';
import { BarcodeScannerPage } from '@/app/components/Barcode/BarcodePage/BarcodePage';
import SearchForm from '@/app/components/SearchBillForm/SearchBillForm';
import handleError from '@/app/util/error/handleError';
import { formatD } from '@/app/util/format/dateUtils';
import { ApiGet, ApiPost } from '@/app/util/makeApiRequest/makeApiRequest';
import { getParamsFromQueryString, updateSearchParams } from '@/app/util/url/urlUtils';
import { IBill, IReceipt } from '@/models/klm';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface AmtTrack {
  total: number;
  grand: number;
  paid: number;
  due: number;
}

interface InputFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type = 'text',
  value,
  placeholder,
  onChange,
  required = false,
}) => (
  <div className="flex grow flex-wrap items-center gap-1 max-sm:justify-between">
    <label htmlFor={id} className="input input-sm input-primary flex grow items-center gap-2 max-sm:text-nowrap">
      {label}:
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="grow"
        autoComplete="off"
        required={required}
      />
    </label>
  </div>
);

export default function ReceiptPage() {
  const [searchBill, setSearchBill] = useState<IBill[] | undefined>(undefined);
  const [receipt, setReceipt] = useState<IReceipt>();
  const [recentReceipt, setRecentReceipt] = useState<IReceipt[] | undefined>(undefined);
  const [searchReceipt, setSearchReceipt] = useState<IReceipt[] | undefined>(undefined);
  const [headerBarcode, setHeaderBarcode] = React.useState<string | null>('');
  const router = useRouter();
  const [amtTrack, setAmtTrack] = useState<AmtTrack>({
    total: 0,
    grand: 0,
    paid: 0,
    due: 0,
  });

  useEffect(() => {
    const fetchLastReceipt = async () => {
      try {
        const res = await ApiGet.Receipt.RecentReceipt();
        if (res.success) {
          setRecentReceipt(res.recentReceipt);
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        handleError.toastAndLog(error);
      }
    };
    fetchLastReceipt();
  }, []);

  const billSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const inputValue = parseInt((event.target as HTMLFormElement).billSearch.value);
      const typeBillOrMobile = (event.target as HTMLFormElement).selectBill.value;

      const res = await ApiGet.Bill.BillSearch(inputValue, typeBillOrMobile);

      if (res.success) {
        setSearchBill(res.bill);
      } else {
        setSearchBill(undefined);
        throw new Error(res.message);
      }
    } catch (error) {
      handleError.toastAndLog(error);
    }
  };

  const receiptSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const inputValue = parseInt((event.target as HTMLFormElement).receiptSearch.value);
      const typeReceiptOrBillOrMobile = (event.target as HTMLFormElement).selectReceipt.value;

      const res = await ApiGet.Receipt.ReceiptSearch(inputValue, typeReceiptOrBillOrMobile);

      if (res.success) {
        setSearchReceipt(res.receipt);
      } else {
        setSearchReceipt(undefined);
        throw new Error(res.message);
      }
    } catch (error) {
      handleError.toastAndLog(error);
    }
  };

  const saveReceipt = async () => {
    try {
      if (!receipt) throw new Error('Receipt is undefined');
      const { amount, bill, paymentMethod, paymentDate } = receipt;
      if (!amount) throw new Error('Amount cannot be zero');
      if (!bill?.billNumber) throw new Error('Bill number cannot be zero');
      if (!paymentMethod) throw new Error('Payment method cannot be empty');
      if (!paymentDate) throw new Error('Payment date cannot be empty');
      if (!bill?.name) throw new Error('Name cannot be empty');
      if (amtTrack.paid >= amtTrack.grand || amtTrack.due <= 0) throw new Error('Bill already paid');
      if (amount > amtTrack.due) throw new Error('Amount cannot be greater than bill amount');

      const res = await ApiPost.Receipt.SaveReceipt(receipt);
      if (res.success) {
        toast.success('Receipt saved');
        setReceipt(undefined);
        setRecentReceipt([res.receipt, ...(recentReceipt ?? [])]);
        setAmtTrack({ total: 0, grand: 0, paid: 0, due: 0 });
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      handleError.toastAndLog(error);
    }
  };

  const createNewReceipt = async () => {
    setSearchBill(undefined);
    const lastReceipt = await ApiGet.Receipt.LastReceipt();
    setReceipt({
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
  };

  const searchRowClicked = (billId: string) => async () => {
    try {
      const selectedBill = searchBill?.find((bill) => bill._id.toString() === billId);
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
    } catch (error) {
      handleError.toastAndLog(error);
    }
  };

  useEffect(() => {
    const fetchReceipt = async (receiptNumber: number) => {
      try {
        const res = await ApiGet.Receipt.ReceiptSearch(receiptNumber, 'receipt');
        if (res.success && res.receipt.length > 0) {
          const fetchedReceipt = res.receipt[0];
          const lastReceipt = await ApiGet.Receipt.LastReceipt();
          setReceipt({
            ...fetchedReceipt,
            amount: '',
            paymentMethod: '',
            receiptNumber: (lastReceipt?.lastReceipt?.receiptNumber ?? 0) + 1,
          });
          const billNumber = fetchedReceipt?.bill?.billNumber;
          if (billNumber) {
            const billRes = await ApiGet.Bill.BillSearch(billNumber, 'bill');
            if (billRes.success && billRes.bill.length > 0) {
              const bill = billRes.bill[0];
              setAmtTrack({
                total: bill.totalAmount,
                grand: bill.grandTotal,
                paid: bill.paidAmount,
                due: bill.dueAmount,
              });
            } else {
              throw new Error('Bill not found');
            }
          }
        } else {
          throw new Error('Receipt not found');
        }
      } catch (error) {
        handleError.toastAndLog(error);
      }
    };

    const urlParams = getParamsFromQueryString(window.location.search);
    const receiptNumber = urlParams.receiptNumber;
    if (receiptNumber) {
      fetchReceipt(parseInt(receiptNumber));
    }
  }, [router]);

  useEffect(() => {
    if (headerBarcode) {
      const fetchBillAndReceipt = async () => {
        try {
          const { billNumber, receiptNumber } = getParamsFromQueryString(headerBarcode);
          if (billNumber || receiptNumber) {
            updateSearchParams({
              billNumber: billNumber || null,
              receiptNumber: receiptNumber || null,
            });
          }

          const fetchBill = async (billNumber: string) => {
            const billRes = await ApiGet.Bill.BillSearch(parseInt(billNumber), 'bill');
            if (billRes.success && billRes.bill.length > 0) {
              const bill = billRes.bill[0];
              if (bill.dueAmount <= 0) {
                toast.error('No due amount for this bill');
                return null;
              }
              setAmtTrack({
                total: bill.totalAmount,
                grand: bill.grandTotal,
                paid: bill.paidAmount,
                due: bill.dueAmount,
              });
              return bill;
            } else {
              throw new Error('Bill not found');
            }
          };

          const fetchReceipt = async (receiptNumber: string) => {
            const receiptRes = await ApiGet.Receipt.ReceiptSearch(parseInt(receiptNumber), 'receipt');
            if (receiptRes.success && receiptRes.receipt.length > 0) {
              return receiptRes.receipt[0];
            } else {
              throw new Error('Receipt not found');
            }
          };

          const lastReceipt = await ApiGet.Receipt.LastReceipt();
          const newReceiptNumber = (lastReceipt?.lastReceipt?.receiptNumber ?? 0) + 1;

          if (billNumber && receiptNumber) {
            const [bill, fetchedReceipt] = await Promise.all([fetchBill(billNumber), fetchReceipt(receiptNumber)]);
            if (bill && fetchedReceipt) {
              setReceipt({
                ...fetchedReceipt,
                receiptNumber: newReceiptNumber,
                amount: '',
                bill: {
                  ...fetchedReceipt.bill,
                  _id: bill._id,
                  billNumber: bill.billNumber,
                  name: bill.name,
                  mobile: bill.mobile,
                },
                paymentDate: new Date(),
                paymentMethod: '',
                updatedAt: new Date(),
              });
            }
          } else if (billNumber) {
            const bill = await fetchBill(billNumber);
            if (bill) {
              setReceipt({
                ...receipt,
                receiptNumber: newReceiptNumber,
                bill: {
                  ...receipt?.bill,
                  _id: bill._id,
                  billNumber: bill.billNumber,
                  name: bill.name,
                  mobile: bill.mobile,
                },
                paymentDate: new Date(),
                paymentMethod: '',
                updatedAt: new Date(),
              } as IReceipt);
            }
          } else if (receiptNumber) {
            const fetchedReceipt = await fetchReceipt(receiptNumber);
            if (fetchedReceipt) {
              const billNumber = fetchedReceipt?.bill?.billNumber;
              if (billNumber) {
                await fetchBill(billNumber);
              }
              setReceipt({
                ...fetchedReceipt,
                receiptNumber: newReceiptNumber,
                amount: '',
                paymentDate: new Date(),
                paymentMethod: '',
                updatedAt: new Date(),
              });
            }
          }
        } catch (error) {
          handleError.toastAndLog(error);
        }
      };
      fetchBillAndReceipt();
      setHeaderBarcode(null);
    }
  }, [headerBarcode]);

  const recentReceiptTable = (receipts: IReceipt[], caption: string) => (
    <table className="table table-zebra table-pin-rows">
      <caption className="px-1 py-2 font-bold">{caption}</caption>
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
        {receipts.length === 0 ? (
          <tr>
            <td colSpan={8} className="text-warning">
              No receipts
            </td>
          </tr>
        ) : (
          receipts.map((receipt, index) => (
            <tr key={index} className="hover text-center">
              <td>{index + 1}</td>
              <td>{receipt.receiptNumber}</td>
              <td>{receipt.bill?.billNumber}</td>
              <td>{receipt.bill?.mobile}</td>
              <td>{receipt.paymentDate ? formatD(receipt.paymentDate) : ''}</td>
              <td>{receipt.amount}</td>
              <td>{receipt.paymentMethod}</td>
              <td>
                <button
                  className="btn btn-secondary btn-xs"
                  onClick={() => router.push(`/print-preview?billNumber=${receipt.receiptNumber}&type=Receipt`)}
                >
                  Print
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  return (
    <div className="flex grow flex-col gap-1">
      <span className="flex min-w-fit flex-row flex-wrap items-center justify-between gap-2 rounded-box bg-accent/10 px-3 py-1.5 backdrop-blur-xl max-sm:flex-col">
        <span className="select-disabled rounded-box">
          <button className="btn btn-primary btn-sm" disabled onClick={createNewReceipt}>
            New Receipt
          </button>
        </span>
        <BarcodeScannerPage onScanComplete={setHeaderBarcode} />
        <SearchForm onSearch={billSearch} searchResults={searchBill} onRowClick={searchRowClicked} />
      </span>
      <div className="flex grow flex-col gap-1 rounded p-1">
        <div className="flex flex-col gap-px rounded-box bg-base-200 p-2">
          <h1 className="text-center font-bold">Receipt</h1>
          <div className="flex flex-row flex-wrap items-center gap-1 p-1">
            <InputField
              label="Receipt No"
              id="receiptNo"
              type="number"
              value={receipt?.receiptNumber?.toString() ?? ''}
              onChange={(e) => {
                const limitedValue = e.target.value.slice(0, 7);
                const parsedValue = limitedValue === '' ? '' : parseInt(limitedValue);
                setReceipt({ ...receipt, receiptNumber: parsedValue } as IReceipt);
              }}
              placeholder="Receipt No"
            />
            <InputField
              label="Bill No"
              id="billNo"
              type="number"
              value={receipt?.bill?.billNumber?.toString() ?? ''}
              onChange={(e) => {
                const limitedValue = e.target.value.slice(0, 7);
                const parsedValue = limitedValue === '' ? '' : parseInt(limitedValue);
                setReceipt({ ...receipt, bill: { ...receipt?.bill, billNumber: parsedValue } } as IReceipt);
              }}
              placeholder="Bill No"
            />
            <InputField
              label="Name"
              id="name"
              value={receipt?.bill?.name ?? ''}
              onChange={(e) => {
                setReceipt({ ...receipt, bill: { ...receipt?.bill, name: e.target.value } } as IReceipt);
              }}
              placeholder="Name"
            />
            <InputField
              label="Mobile"
              id="mobile"
              type="tel"
              value={receipt?.bill?.mobile?.toString() ?? ''}
              onChange={(e) => {
                setReceipt({
                  ...receipt,
                  bill: { ...receipt?.bill, mobile: parseInt(e.target.value) },
                } as IReceipt);
              }}
              placeholder="Mobile"
            />
            <InputField
              label="Date"
              id="receiptDate"
              type="date"
              value={receipt?.paymentDate ? new Date(receipt.paymentDate).toISOString().split('T')[0] : ''}
              onChange={(e) => {
                setReceipt({ ...receipt, paymentDate: new Date(e.target.value) } as IReceipt);
              }}
            />
            <InputField
              label="Amount"
              id="receiptAmount"
              type="number"
              value={receipt?.amount?.toString() ?? ''}
              onChange={(e) => {
                const limitedValue = e.target.value.slice(0, 7);
                const parsedValue = limitedValue === '' ? '' : parseInt(limitedValue);
                setReceipt({ ...receipt, amount: parsedValue } as IReceipt);
              }}
              placeholder="Amount"
              required
            />
            <div className="flex grow flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
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
                className="select select-bordered select-primary select-sm grow"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </select>
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
                  <h3
                    className={`label-text ${key === 'due' && amtTrack.due <= 0 ? 'text-warning' : ''} ${key === 'paid' && amtTrack.paid === amtTrack.grand ? 'text-success' : ''}`}
                  >
                    {key === 'due' ? value - (receipt?.amount ?? 0) : value}
                  </h3>
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
                <option value="receipt">Receipt No</option>
                <option value="bill">Bill No</option>
                <option value="mobile">Mobile</option>
              </select>
              <span className="dropdown dropdown-end dropdown-bottom w-fit">
                <button tabIndex={0} role="button" className="btn btn-primary btn-sm rounded-l-none">
                  Search
                </button>
              </span>
            </form>
          </div>
          {searchReceipt && <span>{recentReceiptTable(searchReceipt, 'Searched Receipts')}</span>}
          {recentReceipt && <span>{recentReceiptTable(recentReceipt, 'Recent Receipts')}</span>}
        </div>
      </div>
    </div>
  );
}
