'use client';
import BarcodeScannerPage from '@components/Barcode/BarcodeScanner';
import SearchBillForm from '@components/SearchBillForm/SearchBillForm';
import BillDetailsDropdownClear from '@dashboard/work-manage/bill/components/BillDetails';
import { handleSearch } from '@dashboard/work-manage/bill/utils/billUtils';
import OrdersTable from '@dashboard/work-manage/labelling/components/OrdersTable';
import { CheckCircleIcon, MinusCircleIcon, PrinterIcon } from '@heroicons/react/24/solid';
import { IBill } from '@models/klm';
import handleError from '@util/error/handleError';
import { ApiGet } from '@util/makeApiRequest/makeApiRequest';
import { getSearchParam, setSearchParam } from '@util/url/urlUtils';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const LabellingPage: React.FC = () => {
  const [searchBill, setSearchBill] = useState<IBill[] | undefined>(undefined);
  const [bill, setBill] = useState<IBill | undefined>(undefined);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [barcode, setBarcode] = React.useState<string>('');
  const router = useRouter();

  function checkOrderInUrl(orderNumber: string) {
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
      (async () => {
        try {
          const res = await ApiGet.Bill.BillSearch(parseInt(billNumber), 'bill');
          if (res.success && res.bill.length > 0) {
            setBill(res.bill[0]);
            if (orderNumber) checkOrderInUrl(orderNumber);
          } else {
            throw new Error(res.message);
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

    (async () => {
      try {
        if (billNumber === bill?.billNumber?.toString()) {
          toast.success('Bill already loaded');
        } else {
          const res = await ApiGet.Bill.BillSearch(parseInt(billNumber), 'bill');
          if (res.success && res.bill.length > 0) {
            toast.success('Bill found');
            setBill(res.bill[0]);
          } else {
            throw new Error(res.message);
          }
        }

        updateUrlWithBillNumber(billNumber);
        setBarcode('');
      } catch (error) {
        handleError.toastAndLog(error);
      }
    })();
  }, [barcode]);

  const handleOrderSelect = (orderIndex: number) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderIndex)
        ? prevSelected.filter((index) => index !== orderIndex)
        : [...prevSelected, orderIndex],
    );
  };

  const handleSelectAll = () => {
    if (bill) {
      if (selectedOrders.length === bill.order.length) {
        setSelectedOrders([]);
      } else {
        const allOrders = bill.order.map((_, index) => index);
        setSelectedOrders(allOrders);
      }
    }
  };

  const handlePrintPreview = () => {
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

  const updateUrlWithBillNumber = (billNumber: string) => {
    setSearchParam('billNumber', billNumber);
  };

  const handleRowClick = (billId: string) => async () => {
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

  const clearBill = () => {
    setBill(undefined);
    setSearchParam('billNumber', '');
    setSearchParam('orderNumber', '');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-[2] flex flex-row flex-wrap items-center justify-between gap-x-2 gap-y-3 rounded-box bg-neutral px-3 py-1">
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
        <div className="sticky bottom-0 z-[2] flex justify-between rounded-box bg-neutral px-3 py-1">
          {selectedOrders.length === bill?.order.length ? (
            <button className="btn btn-error btn-sm" onClick={handleSelectAll}>
              <MinusCircleIcon className="h-5 w-5 text-error-content" />
              Deselect All
            </button>
          ) : (
            <button className="btn btn-info btn-sm" onClick={handleSelectAll}>
              <CheckCircleIcon className="h-5 w-5 text-info-content" />
              Select All
            </button>
          )}
          <button
            className={`btn btn-info btn-sm ${selectedOrders.length === 0 ? 'btn-neutral cursor-not-allowed opacity-60' : ''}`}
            onClick={handlePrintPreview}
          >
            <PrinterIcon className="h-5 w-5 text-info-content" />
            Print Preview
          </button>
        </div>
      )}
    </div>
  );
};

export default LabellingPage;
