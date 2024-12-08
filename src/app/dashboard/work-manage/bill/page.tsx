'use client';
import BarcodeScannerPage from '@/app/components/Barcode/BarcodeScanner';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import SearchBillForm from '@/app/components/SearchBillForm/SearchBillForm';
import { IBill, ICategory } from '@/models/klm';
import BillDetailsDropdownClear from '@dashboard/work-manage/bill/components/BillDetails';
import BillHeader from '@dashboard/work-manage/bill/components/BillHeader';
import BillTable from '@dashboard/work-manage/bill/components/BillTable';
import IncreaseDecreaseSection from '@dashboard/work-manage/bill/components/IncreaseDecreaseSection';
import ItemsTrack from '@dashboard/work-manage/bill/components/ItemsTrack';
import OrderDetails from '@dashboard/work-manage/bill/components/OrderDetails';
import SaveUpdatePrint from '@dashboard/work-manage/bill/components/SaveUpdatePrint';
import {
  billSearch,
  calculateTotalAmount,
  checkOrderInUrl,
  clearBill,
  createEmptyOrder,
  createInitialBill,
  fetchInitialData,
  handleColorSelect,
  searchRowClicked,
  updateBillAmounts,
  updateUrlWithBillNumber,
  validateBill,
} from '@dashboard/work-manage/bill/utils/billUtils';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { userConfirmation } from '@util/confirmation/confirmationUtil';
import handleError from '@util/error/handleError';
import { ApiGet, ApiPost, ApiPut } from '@util/makeApiRequest/makeApiRequest';
import { getSearchParam } from '@util/url/urlUtils';
import React, { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

export default function BillPage() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [category, setCategory] = React.useState<ICategory[] | []>([]);
  const [bill, setBill] = React.useState<IBill>();
  const [todayBill, setTodayBill] = React.useState<IBill[]>([]);
  const [thisWeekBill, setThisWeekBill] = React.useState<IBill[]>([]);
  const [searchBill, setSearchBill] = React.useState<IBill[] | undefined>(undefined);
  const [newBill, setNewBill] = React.useState<boolean>(true);
  const [barcode, setBarcode] = React.useState<string>('');
  const [printType, setPrintType] = React.useState<string>('customer');

  useEffect(() => {
    const fetchData = async () => {
      await fetchInitialData(setCategory, setTodayBill, setThisWeekBill);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const billNumber = getSearchParam('billNumber');
    const orderNumber = getSearchParam('orderNumber');

    if (billNumber) {
      (async () => {
        try {
          const res = await ApiGet.Bill.BillSearch(parseInt(billNumber), 'bill');
          if (res.success && res.bill.length > 0) {
            setNewBill(false);
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
            setNewBill(false);
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

  const formattedTodayBill = useMemo(() => todayBill, [todayBill]);
  const formattedThisWeekBill = useMemo(() => thisWeekBill, [thisWeekBill]);

  if (loading) {
    return <LoadingSpinner />;
  }

  async function createNewBill() {
    setNewBill(true);
    setSearchBill(undefined);
    setBill(undefined);
    const lastBill = await ApiGet.Bill.LastBill();
    setBill(createInitialBill(lastBill?.lastBill?.billNumber ?? 0) as IBill);
  }

  const handleNewOrder = () => {
    setBill(
      (prevBill) =>
        ({
          ...prevBill,
          order: [...(prevBill?.order || []), createEmptyOrder()],
        }) as IBill,
    );
  };

  async function handleDimensionChange(
    dimensionTypeName: string,
    dimensionName: string,
    note: string,
    orderIndex: number,
    dimIndex: number,
    dimLength: number,
  ) {
    setBill((prevBill) => {
      if (!prevBill) return prevBill;

      const updatedOrder = [...prevBill.order];
      const order = updatedOrder[orderIndex];
      if (!order) return prevBill;

      const updatedDimension = [...order.dimension];
      const existingDimension = updatedDimension[dimIndex];

      // Update the existing dimension fields
      updatedDimension[dimIndex] = {
        ...existingDimension,
        dimensionTypeName: dimensionTypeName === 'none' || dimensionTypeName === undefined ? '' : dimensionTypeName,
        dimensionName: dimensionName === 'none' || dimensionName === undefined ? '' : dimensionName,
        note: note === 'none' || note === undefined ? '' : note,
      };

      // filter the dimensions array which index greater than dimLength
      const filteredDimension = updatedDimension.filter((_, index) => index < dimLength);

      updatedOrder[orderIndex] = {
        ...order,
        dimension: filteredDimension,
      };

      return {
        ...prevBill,
        order: updatedOrder,
      } as IBill | undefined;
    });
  }

  async function handleStyleProcessChange(
    styleName: string,
    styleProcessName: string,
    orderIndex: number,
    styleProcessIndex: number,
    styleProcessLength: number,
  ) {
    setBill((prevBill) => {
      if (!prevBill) return prevBill;

      const updatedOrder = [...prevBill.order];
      const order = updatedOrder[orderIndex];
      if (!order) return prevBill;

      const updatedStyleProcess = [...order.styleProcess];

      updatedStyleProcess[styleProcessIndex] = {
        styleProcessName: styleProcessName,
        styleName: styleName === 'none' ? '' : styleName,
      };

      // filter the styleProcess array which index greater than styleProcessLength
      const filteredStyleProcess = updatedStyleProcess.filter((_, index) => index < styleProcessLength);

      updatedOrder[orderIndex] = {
        ...order,
        styleProcess: filteredStyleProcess,
      };
      return {
        ...(prevBill as IBill),
        order: updatedOrder,
      } as IBill | undefined;
    });
  }

  function handleRemoveOrder(orderIndex: number): React.MouseEventHandler<HTMLButtonElement> | undefined {
    return async () => {
      const Confirmed = await userConfirmation({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this order?',
      });
      if (!Confirmed) return;

      try {
        if (orderIndex >= 0 && (bill?.order?.length ?? 0) > 0) {
          // Remove the order at the specified orderIndex and update the total amount
          const updatedOrder = bill?.order.slice();
          if (updatedOrder) {
            updatedOrder.splice(orderIndex, 1);
          }
          const newTotalAmount = updatedOrder ? updatedOrder.reduce((total, item) => total + (item.amount || 0), 0) : 0;
          setBill({
            ...bill,
            order: updatedOrder,
            totalAmount: newTotalAmount,
          } as IBill);
        }
      } catch (error) {
        handleError.log(error);
      }
    };
  }

  async function handleSaveBill() {
    try {
      await validateBill(bill);
      if (!bill) throw new Error('Bill data is undefined');

      const updatedBill: Partial<IBill> = updateBillAmounts({
        ...bill,
        order: bill.order.map((order) => ({ ...order, status: 'Pending' })),
        paymentStatus: 'Unpaid',
        deliveryStatus: 'Pending',
      });

      // Type assertion here since we know the bill has all required fields
      const res = await ApiPost.Bill(updatedBill as IBill);
      if (res.success) {
        setTodayBill([...todayBill, res.today]);
        setBill(res.bill);
        setNewBill(false);
        toast.success(res.message);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      handleError.toast(error);
    }
  }

  async function handleUpdateBill() {
    const update = await userConfirmation({
      header: 'Confirm Update',
      message: 'Are you sure you want to update this bill?',
    });
    if (!update) return;

    try {
      const orderAmount = calculateTotalAmount(bill?.order ?? []);
      setBill(
        (prevBill) =>
          ({
            ...prevBill,
            totalAmount: orderAmount ?? 0,
            grandTotal: (orderAmount ?? 0) - (prevBill?.discount ?? 0),
          }) as IBill | undefined,
      );
      await validateBill(bill);
      if (!(bill ?? {})._id) throw new Error('No bill ID found to update');

      const res = await ApiPut.Bill(bill?._id?.toString() ?? '', bill as IBill);
      if (res.success === true) {
        setTodayBill([...todayBill, res.today]);
        setBill(res.bill);
        toast.success(res.message);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      handleError.toast(error);
    }
  }

  return (
    <span className="table-column h-full">
      <div className="flex h-full w-full flex-col shadow max-sm:table-cell">
        <span className="flex min-w-fit flex-row flex-wrap items-center justify-between gap-2 rounded-box bg-accent/10 px-3 py-1.5 backdrop-blur-xl max-sm:flex-col">
          <button className="btn btn-primary btn-sm" onClick={createNewBill}>
            <PlusCircleIcon className="h-5 w-5" />
            New
          </button>
          <h1 className="grow text-center">Bill</h1>
          <span className="flex flex-row flex-wrap-reverse gap-2">
            <BarcodeScannerPage
              onScanComplete={setBarcode}
              scannerId="billHeaderScanner"
              scanModalId="billHeaderScanner_modal"
            />
            {bill && (
              <BillDetailsDropdownClear
                bill={bill}
                clearBill={() => clearBill(setBill)}
                link={`/dashboard/work-manage/bill?billNumber=${bill.billNumber}`}
                linkDisabled={false}
              />
            )}
            <SearchBillForm
              onSearch={(e) => billSearch(e, setBill, setSearchBill)}
              searchResults={searchBill}
              onRowClick={(billId) =>
                searchRowClicked(billId, searchBill, setBill, setSearchBill, updateUrlWithBillNumber, setNewBill)
              }
            />
          </span>
        </span>

        {/* new bill */}
        {bill && (
          <span className="contents">
            {/* Bill header */}
            <BillHeader bill={bill} setBill={setBill} />
            {/* increase or decrease */}
            <IncreaseDecreaseSection
              bill={bill}
              handleNewOrder={handleNewOrder}
              handleRemoveOrder={handleRemoveOrder}
            />
            {/* items and track in row */}
            <div className="flex h-full w-full flex-row items-start gap-1 rounded-box bg-base-300 p-1 max-sm:flex-col max-sm:items-center">
              <div className="flex min-h-full grow flex-col justify-between rounded-box border border-base-300">
                <div className="flex max-h-[45rem] min-h-full w-full grow flex-col gap-1 overflow-auto rounded-box bg-base-200">
                  {/* orders */}
                  {bill?.order?.map((order, orderIndex) => (
                    <OrderDetails
                      key={orderIndex}
                      order={order}
                      orderIndex={orderIndex}
                      bill={bill}
                      setBill={setBill}
                      category={category}
                      handleRemoveOrder={handleRemoveOrder}
                      handleDimensionChange={handleDimensionChange}
                      handleStyleProcessChange={handleStyleProcessChange}
                      handleColorSelect={(color, orderIndex) => handleColorSelect(color, orderIndex, setBill)}
                    />
                  ))}
                </div>
                <SaveUpdatePrint
                  newBill={newBill}
                  bill={bill}
                  printType={printType}
                  setPrintType={setPrintType}
                  handleSaveBill={handleSaveBill}
                  handleUpdateBill={handleUpdateBill}
                />
              </div>
              <ItemsTrack bill={bill} />
            </div>
          </span>
        )}
      </div>
      <div className="my-0.5 flex w-full flex-col rounded-box bg-base-300 p-2">
        <BillTable caption="Today" bills={formattedTodayBill as unknown as IBill[]} />
        <BillTable caption="This Week (excluding today)" bills={formattedThisWeekBill as unknown as IBill[]} />
      </div>
    </span>
  );
}
