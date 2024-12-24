'use client';
import BarcodeScannerPage from '@components/Barcode/BarcodeScanner';
import LoadingSpinner from '@components/LoadingSpinner';
import SearchForm from '@components/SearchBillForm/SearchBillForm';
import ReceiptHeader from '@dashboard/transaction/receipt/components/ReceiptHeader';
import ReceiptTable from '@dashboard/transaction/receipt/components/ReceiptTable';
import { fetchAllInitialData, validateReceipt } from '@dashboard/transaction/receipt/utils/receiptUtils';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { CloudArrowUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { IBill, IReceipt, IReceiptTax, ITax } from '@models/klm';
import handleError from '@utils/error/handleError';
import { ApiGet, ApiPost, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import { getParamsFromQueryString, updateSearchParams } from '@utils/url/urlUtils';
import { useRouter } from 'next/navigation';
import React, { JSX, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface AmtTrack {
  total: number;
  grand: number;
  discount: number;
  paid: number;
  due: number;
  taxAmount: number; // Add this field
}

interface BillSearchResponse extends ApiResponse {
  success: boolean;
  bill: IBill[];
}

interface ReceiptSearchResponse extends ApiResponse {
  success: boolean;
  receipt: IReceipt[];
}

interface LastReceiptResponse extends ApiResponse {
  success: boolean;
  lastReceipt: {
    receiptNumber: number;
  };
}

interface SaveReceiptResponse extends ApiResponse {
  success: boolean;
  receipt: IReceipt;
}

export default function ReceiptPage(): JSX.Element {
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
    discount: 0,
    paid: 0,
    due: 0,
    taxAmount: 0, // Add this field
  });

  const [tax, setTax] = React.useState<ITax[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  // helper function to set amount tracking
  const setAmountTrack = async (bill: IBill): Promise<void> => {
    const response = await ApiGet.Receipt.ReceiptSearch<ReceiptSearchResponse>(bill.billNumber, 'bill');
    if (!response || !response.success) {
      throw new Error('Failed to fetch receipts');
    }
    const receipts = response.receipt || [];
    const totalPaidAmount = receipts.reduce((sum: number, receipt: IReceipt) => sum + receipt.amount, 0);
    const totalDiscount = receipts.reduce((sum: number, receipt: IReceipt) => sum + receipt.discount, 0);
    const totalTaxAmount = receipts.reduce((sum: number, receipt: IReceipt) => sum + receipt.taxAmount, 0);
    const grandTotal = bill.totalAmount + totalTaxAmount - totalDiscount;
    const dueAmount = grandTotal - totalPaidAmount;

    setAmtTrack({
      total: bill.totalAmount,
      grand: grandTotal,
      discount: totalDiscount,
      paid: totalPaidAmount,
      due: dueAmount,
      taxAmount: totalTaxAmount,
    });
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        await fetchAllInitialData(setTax, setRecentReceipt);
      } catch (error) {
        handleError.toast(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const { receiptNumber } = getParamsFromQueryString(window.location.search);
    if (receiptNumber) {
      const fetchReceiptData = async (receiptNumber: number): Promise<void> => {
        try {
          const [receiptRes, lastReceiptRes] = await Promise.all([
            ApiGet.Receipt.ReceiptSearch<ReceiptSearchResponse>(receiptNumber, 'receipt'),
            ApiGet.Receipt.LastReceipt<LastReceiptResponse>(),
          ]);

          if (!receiptRes?.success || !lastReceiptRes?.success) {
            throw new Error('Failed to fetch receipt data');
          }

          const fetchedReceipt = receiptRes.receipt[0] as IReceipt;
          setReceipt({
            ...fetchedReceipt,
            amount: 0,
            discount: 0,
            paymentMethod: 'advance',
            tax: [] as IReceiptTax[],
            receiptNumber: (lastReceiptRes.lastReceipt?.receiptNumber ?? 0) + 1,
          } as IReceipt);

          if (fetchedReceipt?.bill?.billNumber) {
            const billRes = await ApiGet.Bill.BillSearch<BillSearchResponse>(fetchedReceipt.bill.billNumber, 'bill');
            if (!billRes?.success || !billRes.bill?.length) {
              throw new Error('Bill not found');
            }
            await setAmountTrack(billRes.bill[0]);
          }
        } catch (error) {
          handleError.toast(error);
        }
      };
      fetchReceiptData(parseInt(receiptNumber));
    }
  }, [router]);

  useEffect(() => {
    if (headerBarcode) {
      const fetchBillAndReceipt = async (): Promise<void> => {
        try {
          const { billNumber, receiptNumber } = getParamsFromQueryString(headerBarcode);
          if (billNumber || receiptNumber) {
            updateSearchParams({
              billNumber: billNumber || null,
              receiptNumber: receiptNumber || null,
            });
          }

          const lastReceipt = await ApiGet.Receipt.LastReceipt<LastReceiptResponse>();
          if (!lastReceipt) {
            throw new Error('Failed to fetch last receipt number');
          }
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
          handleError.toast(error);
        }
      };
      fetchBillAndReceipt();
      setHeaderBarcode(null);
    }
  }, [headerBarcode]);

  useEffect(() => {
    if (tableBarcode) {
      const fetchBillAndReceipt = async (): Promise<void> => {
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

  if (loading) {
    return <LoadingSpinner />;
  }

  // Helper function to reset amount tracking
  const resetAmtTrack = (): void => {
    setAmtTrack({ total: 0, grand: 0, discount: 0, paid: 0, due: 0, taxAmount: 0 }); // Add this field
  };

  const fetchBill = async (billNumber: string): Promise<IBill | null> => {
    try {
      const billRes = await ApiGet.Bill.BillSearch<BillSearchResponse>(parseInt(billNumber), 'bill');
      if (!billRes || !billRes.success || !billRes.bill?.length) {
        throw new Error('Bill not found');
      }
      const bill = billRes.bill[0];
      await setAmountTrack(bill);
      return bill;
    } catch (error) {
      handleError.toast(error);
      return null;
    }
  };

  const fetchReceipt = async (receiptNumber: string): Promise<IReceipt | null> => {
    try {
      const receiptRes = await ApiGet.Receipt.ReceiptSearch<ReceiptSearchResponse>(parseInt(receiptNumber), 'receipt');
      if (!receiptRes || !receiptRes.success || !receiptRes.receipt?.length) {
        throw new Error('Receipt not found');
      }
      return receiptRes.receipt[0];
    } catch (error) {
      handleError.toast(error);
      return null;
    }
  };

  const billSearch = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      const inputValue = parseInt((event.target as HTMLFormElement).billSearch.value);
      const typeBillOrMobile = (event.target as HTMLFormElement).selectBill.value;

      const res = await ApiGet.Bill.BillSearch<BillSearchResponse>(inputValue, typeBillOrMobile);

      if (!res) {
        throw new Error('No response from server');
      }

      if (res.success) {
        setSearchBill(res.bill);
      } else {
        setSearchBill(undefined);
        throw new Error(res.message);
      }
    } catch (error) {
      handleError.toast(error);
    }
  };

  const receiptSearch = async (inputValue: number, typeReceiptOrBillOrMobile: string): Promise<void> => {
    try {
      const res = await ApiGet.Receipt.ReceiptSearch<ReceiptSearchResponse>(inputValue, typeReceiptOrBillOrMobile);

      if (!res) {
        throw new Error('No response from server');
      }

      if (res.success) {
        setSearchReceipt(res.receipt);
      } else {
        setSearchReceipt(undefined);
        throw new Error(res.message);
      }
    } catch (error) {
      handleError.toast(error);
    }
  };

  const handleReceiptSearch = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      const inputValue = parseInt((event.target as HTMLFormElement).receiptSearch.value);
      const typeReceiptOrBillOrMobile = (event.target as HTMLFormElement).selectReceipt.value;
      await receiptSearch(inputValue, typeReceiptOrBillOrMobile);
    } catch (error) {
      handleError.toast(error);
    }
  };

  const saveReceipt = async (): Promise<void> => {
    try {
      if (!receipt) throw new Error('Receipt is undefined');

      validateReceipt(receipt, amtTrack);

      const res = await ApiPost.Receipt.SaveReceipt<SaveReceiptResponse>(receipt);
      if (!res) {
        throw new Error('No response from server');
      }
      if (res.success) {
        toast.success('Receipt saved');
        setReceipt(undefined);
        setRecentReceipt([res.receipt, ...(recentReceipt ?? [])]);
        resetAmtTrack();
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      handleError.toast(error);
    }
  };

  const createNewReceipt = async (): Promise<void> => {
    setSearchBill(undefined);
    const lastReceipt = await ApiGet.Receipt.LastReceipt<LastReceiptResponse>();
    if (!lastReceipt) {
      throw new Error('Failed to fetch last receipt number');
    }
    setReceipt({
      ...receipt,
      receiptNumber: (lastReceipt?.lastReceipt?.receiptNumber ?? 0) + 1,
      bill: {
        ...receipt?.bill,
      },
      amount: 0,
      paymentDate: new Date(),
      paymentMethod: '',
      paymentType: 'advance', // Default value
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IReceipt);
  };

  const searchRowClicked = (billId: string) => async (): Promise<void> => {
    try {
      const selectedBill = searchBill?.find((bill) => bill._id.toString() === billId);
      if (selectedBill) {
        const lastReceipt = await ApiGet.Receipt.LastReceipt<LastReceiptResponse>();
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
      handleError.toast(error);
    }
  };

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
        <div className="flex flex-col gap-1 rounded-box bg-base-200 p-2">
          <h1 className="text-center font-bold">Receipt</h1>
          <ReceiptHeader
            receipt={receipt}
            setReceipt={setReceipt}
            amtTrack={amtTrack}
            setAmtTrack={setAmtTrack}
            tax={tax}
          />
          <button className="btn btn-primary btn-sm" onClick={saveReceipt}>
            <CloudArrowUpIcon className="h-5 w-5" />
            Save
          </button>
        </div>
        {/* Receipts details table */}
        <div className="flex grow flex-col gap-2 p-2">
          <div className="flex flex-col gap-1">
            <div className="flex justify-center gap-2 rounded-box bg-base-300/80 py-2">
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
                <button tabIndex={0} role="button" className="btn btn-primary btn-sm rounded-l-none">
                  <MagnifyingGlassIcon className="join-item h-5 w-5" />
                </button>
              </form>
              <BarcodeScannerPage
                onScanComplete={setTableBarcode}
                scannerId="receiptSearchScanner"
                scanModalId="receiptSearchScanner_modal"
              />
            </div>
            {searchReceipt && (
              <div className="rounded-box bg-base-300/80">
                <ReceiptTable receipts={searchReceipt} caption="Searched Receipts" />
              </div>
            )}
          </div>
          {recentReceipt && (
            <div className="rounded-box bg-base-300/80">
              <ReceiptTable receipts={recentReceipt} caption="Recent Receipts" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
