'use client';
import { BarcodeScannerPage } from '@/app/components/Barcode/BarcodeScanner';
import SearchForm from '@/app/components/SearchBillForm/SearchBillForm';
import ReceiptTable from '@/app/components/tables/transaction/receipt/ReceiptTable';
import handleError from '@/app/util/error/handleError';
import { ApiGet, ApiPost } from '@/app/util/makeApiRequest/makeApiRequest';
import { getParamsFromQueryString, updateSearchParams } from '@/app/util/url/urlUtils';
import { IBill, IReceipt } from '@/models/klm';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { CloudArrowUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
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
  const [headerBarcode, setHeaderBarcode] = useState<string | null>('');
  const [tableBarcode, setTableBarcode] = useState<string | null>('');
  const router = useRouter();
  const [amtTrack, setAmtTrack] = useState<AmtTrack>({
    total: 0,
    grand: 0,
    paid: 0,
    due: 0,
  });

  // helper function to set amount tracking
  const setAmountTrack = (bill: IBill) => {
    setAmtTrack({
      total: bill.totalAmount,
      grand: bill.grandTotal,
      paid: bill.paidAmount,
      due: bill.dueAmount,
    });
  };

  // Helper function to reset amount tracking
  const resetAmtTrack = () => {
    setAmtTrack({ total: 0, grand: 0, paid: 0, due: 0 });
  };

  const fetchBill = async (billNumber: string): Promise<IBill | null> => {
    try {
      const billRes = await ApiGet.Bill.BillSearch(parseInt(billNumber), 'bill');
      if (billRes.success && billRes.bill.length > 0) {
        const bill = billRes.bill[0];
        if (bill.dueAmount <= 0) {
          toast.error('No due amount for this bill');
          return null;
        }
        setAmountTrack(bill);
        return bill;
      } else {
        throw new Error('Bill not found');
      }
    } catch (error) {
      handleError.toastAndLog(error);
      return null;
    }
  };

  const fetchReceipt = async (receiptNumber: string): Promise<IReceipt | null> => {
    try {
      const receiptRes = await ApiGet.Receipt.ReceiptSearch(parseInt(receiptNumber), 'receipt');
      if (receiptRes.success && receiptRes.receipt.length > 0) {
        return receiptRes.receipt[0];
      } else {
        throw new Error('Receipt not found');
      }
    } catch (error) {
      handleError.toastAndLog(error);
      return null;
    }
  };

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

  const receiptSearch = async (inputValue: number, typeReceiptOrBillOrMobile: string) => {
    try {
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

  const handleReceiptSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const inputValue = parseInt((event.target as HTMLFormElement).receiptSearch.value);
      const typeReceiptOrBillOrMobile = (event.target as HTMLFormElement).selectReceipt.value;
      await receiptSearch(inputValue, typeReceiptOrBillOrMobile);
    } catch (error) {
      handleError.toastAndLog(error);
    }
  };

  const saveReceipt = async () => {
    try {
      if (!receipt) throw new Error('Receipt is undefined');

      const { amount, bill, paymentMethod, paymentDate } = receipt;
      if (!amount || amount <= 0) throw new Error('Invalid amount');
      if (!bill?.billNumber) throw new Error('Bill number is required');
      if (!paymentMethod) throw new Error('Payment method is required');
      if (!paymentDate) throw new Error('Payment date is required');
      if (!bill?.name) throw new Error('Name is required');
      if (amtTrack.paid >= amtTrack.grand || amtTrack.due <= 0) throw new Error('Bill already paid');
      if (amount > amtTrack.due) throw new Error('Amount exceeds due amount');

      const res = await ApiPost.Receipt.SaveReceipt(receipt);
      if (res.success) {
        toast.success('Receipt saved');
        setReceipt(undefined);
        setRecentReceipt([res.receipt, ...(recentReceipt ?? [])]);
        resetAmtTrack();
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
        setAmountTrack(selectedBill);
        setSearchBill(undefined);
      } else {
        toast.error('Bill not found');
      }
    } catch (error) {
      handleError.toastAndLog(error);
    }
  };

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

  useEffect(() => {
    const fetchReceipt = async (receiptNumber: number) => {
      try {
        const res = await ApiGet.Receipt.ReceiptSearch(receiptNumber, 'receipt');
        if (res.success && res.receipt.length > 0) {
          const fetchedReceipt = res.receipt[0];
          const lastReceipt = await ApiGet.Receipt.LastReceipt();
          setReceipt({
            ...fetchedReceipt,
            amount: 0,
            paymentMethod: '',
            receiptNumber: (lastReceipt?.lastReceipt?.receiptNumber ?? 0) + 1,
          });
          const billNumber = fetchedReceipt?.bill?.billNumber;
          if (billNumber) {
            const billRes = await ApiGet.Bill.BillSearch(billNumber, 'bill');
            if (billRes.success && billRes.bill.length > 0) {
              const bill = billRes.bill[0];
              setAmountTrack(bill);
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

          const lastReceipt = await ApiGet.Receipt.LastReceipt();
          const newReceiptNumber = (lastReceipt?.lastReceipt?.receiptNumber ?? 0) + 1;

          if (billNumber && receiptNumber) {
            const [bill, fetchedReceipt] = await Promise.all([fetchBill(billNumber), fetchReceipt(receiptNumber)]);
            if (bill && fetchedReceipt) {
              setReceipt({
                ...fetchedReceipt,
                receiptNumber: newReceiptNumber,
                amount: 0,
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
              } as IReceipt);
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
                await fetchBill(billNumber.toString());
              }
              setReceipt({
                ...fetchedReceipt,
                receiptNumber: newReceiptNumber,
                amount: 0,
                paymentDate: new Date(),
                paymentMethod: '',
                updatedAt: new Date(),
              } as IReceipt);
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

  useEffect(() => {
    if (tableBarcode) {
      const fetchBillAndReceipt = async () => {
        try {
          const { billNumber, receiptNumber } = getParamsFromQueryString(tableBarcode);
          if (billNumber || receiptNumber) {
            updateSearchParams({
              billNumber: billNumber || null,
              receiptNumber: receiptNumber || null,
            });
          }

          if (billNumber) {
            await receiptSearch(parseInt(billNumber), 'bill');
          } else if (receiptNumber) {
            await receiptSearch(parseInt(receiptNumber), 'receipt');
          } else {
            setSearchReceipt([]);
          }
        } catch (error) {
          handleError.toastAndLog(error);
        }
      };
      fetchBillAndReceipt();
      setTableBarcode(null);
    }
  }, [tableBarcode]);

  return (
    <div className="flex grow flex-col gap-1">
      <span className="flex min-w-fit flex-row flex-wrap items-center justify-between gap-2 rounded-box bg-accent/10 px-3 py-1.5 backdrop-blur-xl max-sm:flex-col">
        <span className="select-disabled rounded-box">
          <button className="btn btn-primary btn-sm" disabled onClick={createNewReceipt}>
            <PlusCircleIcon className="h-5 w-5" />
            New Receipt
          </button>
        </span>
        <BarcodeScannerPage
          onScanComplete={setHeaderBarcode}
          scannerId={'receiptHeaderScanner'}
          scanModalId="receiptHeaderScanner_modal"
        />
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
                  <h3 className="label-text font-bold">{key.charAt(0).toUpperCase() + key.slice(1)}:</h3>
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
            <CloudArrowUpIcon className="h-5 w-5" />
            Save
          </button>
        </div>
        <div className="receiptTrack flex grow flex-col rounded-box bg-base-300/80 p-2">
          <div className="searchReceipt flex gap-2">
            <form
              onSubmit={handleReceiptSearch}
              className="join flex flex-wrap items-center justify-between max-sm:flex-col"
            >
              <label
                htmlFor="receiptSearch"
                className="input input-sm join-item label-text input-bordered input-primary flex items-center gap-2 bg-accent/5"
              >
                <MagnifyingGlassIcon className="join-item h-5 w-5 text-info" />
                <input
                  name="receiptSearch"
                  id="receiptSearch"
                  onFocus={(e) => e.target.select()}
                  className="join-item w-40 grow"
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
                  <MagnifyingGlassIcon className="join-item h-5 w-5" />
                </button>
              </span>
            </form>
            <BarcodeScannerPage
              onScanComplete={setTableBarcode}
              scannerId="receiptSearchScanner"
              scanModalId="receiptSearchScanner_modal"
            />
          </div>
          {searchReceipt && <ReceiptTable receipts={searchReceipt} caption="Searched Receipts" />}
          {recentReceipt && <ReceiptTable receipts={recentReceipt} caption="Recent Receipts" />}
        </div>
      </div>
    </div>
  );
}
