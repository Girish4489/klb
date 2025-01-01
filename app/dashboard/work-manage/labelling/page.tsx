'use client';
import BarcodeScannerPage from '@components/Barcode/BarcodeScanner';
import SearchBillForm from '@components/SearchBillForm/SearchBillForm';
import { CheckCircleIcon, MinusCircleIcon, PrinterIcon } from '@heroicons/react/24/solid';
import { IBill } from '@models/klm';
import handleError from '@utils/error/handleError';
import { ApiGet, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import { toast } from '@utils/toast/toast';
import { getSearchParam, setSearchParam } from '@utils/url/urlUtils';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import BillDetailsDropdownClear from '../bill/components/BillDetails';
import { handleSearch } from '../bill/utils/billUtils';
import OrdersTable from './components/OrdersTable';

interface BillSearchResponse extends ApiResponse {
  bill: IBill[];
}

const LabellingPage: FC = () => {
  const [searchBill, setSearchBill] = useState<IBill[] | undefined>(undefined);
  const [bill, setBill] = useState<IBill | undefined>(undefined);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [barcode, setBarcode] = useState<string>('');
  const router = useRouter();

  function checkOrderInUrl(orderNumber: string): void {
    const orderElement = document.getElementById(`order_${orderNumber}`);
    if (orderElement) {
      orderElement.scrollIntoView({ behavior: 'smooth' });
      orderElement.focus();
      orderElement.classList.add('animate-bounce');
      setTimeout(() => {
        orderElement.classList.remove('animate-bounce');
      }, 3000);
    }
  }

  useEffect(() => {
    const billNumber = getSearchParam('billNumber');
    const orderNumber = getSearchParam('orderNumber');
    if (billNumber) {
      (async (): Promise<void> => {
        try {
          const res = await ApiGet.Bill.BillSearch<BillSearchResponse>(parseInt(billNumber), 'bill');
          if (!res) {
            throw new Error('No response from server');
          }
          if (res.success && res.bill?.length > 0) {
            setBill(res.bill[0]);
            if (orderNumber) checkOrderInUrl(orderNumber);
          } else {
            throw new Error(res.message ?? 'Bill not found');
          }
        } catch (error) {
          handleError.toastAndLog(error);
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (!barcode) return;

    const billNumberMatch = barcode.match(/billNumber=(\d+)/);
    if (!billNumberMatch) return;

    const billNumber = billNumberMatch[1];
    if (!billNumber) {
      handleError.toast(new Error('No bill number found in barcode'));
      return;
    }

    (async (): Promise<void> => {
      try {
        if (billNumber === bill?.billNumber?.toString()) {
          toast.success('Bill already loaded');
        } else {
          const res = await ApiGet.Bill.BillSearch<BillSearchResponse>(parseInt(billNumber), 'bill');
          if (!res) {
            throw new Error('No response from server');
          }
          if (res.success && res.bill?.length > 0) {
            toast.success('Bill found');
            setBill(res.bill[0]);
          } else {
            throw new Error(res.message ?? 'Bill not found');
          }
        }

        updateUrlWithBillNumber(billNumber);
        setBarcode('');
      } catch (error) {
        handleError.toastAndLog(error);
      }
    })();
  }, [barcode]);

  const handleOrderSelect = (orderIndex: number): void => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderIndex)
        ? prevSelected.filter((index) => index !== orderIndex)
        : [...prevSelected, orderIndex],
    );
  };

  const handleSelectAll = (): void => {
    if (bill) {
      if (selectedOrders.length === bill.order.length) {
        setSelectedOrders([]);
      } else {
        const allOrders = bill.order.map((_, index) => index);
        setSelectedOrders(allOrders);
      }
    }
  };

  const handlePrintPreview = (): void => {
    if (!selectedOrders.length) {
      handleError.toast(new Error('No orders selected'));
      return;
    }
    if (bill) {
      const selectedOrderDetails = selectedOrders.map((index) => bill.order[index]);
      sessionStorage.setItem('selectedOrderDetails', JSON.stringify(selectedOrderDetails));
      const query = `billNumber=${bill.billNumber}`;
      router.push(`/print-preview/label?${query}`);
    }
  };

  const updateUrlWithBillNumber = (billNumber: string): void => {
    setSearchParam('billNumber', billNumber);
  };

  const handleRowClick = (billId: string) => async (): Promise<void> => {
    try {
      const selectedBill = (searchBill ?? []).find((bill) => bill._id.toString() === billId);
      if (selectedBill) {
        setBill(selectedBill);
        updateUrlWithBillNumber(selectedBill.billNumber.toString());
        setSearchBill(undefined);
      } else {
        handleError.toast(new Error('Bill not found'));
      }
    } catch (error) {
      handleError.toastAndLog(error);
    }
  };

  const clearBill = (): void => {
    setBill(undefined);
    setSearchParam('billNumber', '');
    setSearchParam('orderNumber', '');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="z-2 rounded-box bg-neutral sticky top-0 flex flex-row flex-wrap items-center justify-between gap-x-2 gap-y-3 px-3 py-1">
        <BarcodeScannerPage
          onScanComplete={setBarcode}
          scannerId="labellingScanner"
          scanModalId="labellingScanner_modal"
        />
        <h1 className="grow text-center">Labelling</h1>
        <span className="flex flex-row flex-wrap-reverse gap-2">
          {bill && (
            <BillDetailsDropdownClear
              bill={bill}
              clearBill={clearBill}
              link={`/dashboard/work-manage/bill?billNumber=${bill.billNumber}`}
              linkDisabled={true}
            />
          )}
          <SearchBillForm
            onSearch={(e) => handleSearch(e, setSearchBill)}
            searchResults={searchBill}
            onRowClick={handleRowClick}
          />
        </span>
      </div>
      {bill && <OrdersTable bill={bill} selectedOrders={selectedOrders} handleOrderSelect={handleOrderSelect} />}
      {bill && (
        <div className="z-2 rounded-box bg-neutral sticky bottom-0 flex justify-between px-3 py-1">
          {selectedOrders.length === bill?.order.length ? (
            <button className="btn btn-error btn-sm" onClick={handleSelectAll}>
              <MinusCircleIcon className="text-error-content h-5 w-5" />
              Deselect All
            </button>
          ) : (
            <button className="btn btn-info btn-sm" onClick={handleSelectAll}>
              <CheckCircleIcon className="text-info-content h-5 w-5" />
              Select All
            </button>
          )}
          <button
            className={`btn btn-info btn-sm ${selectedOrders.length === 0 ? 'btn-neutral cursor-not-allowed opacity-60' : ''}`}
            onClick={handlePrintPreview}
          >
            <PrinterIcon className="text-info-content h-5 w-5" />
            Print Preview
          </button>
        </div>
      )}
    </div>
  );
};

export default LabellingPage;
