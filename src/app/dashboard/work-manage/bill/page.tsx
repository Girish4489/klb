'use client';
import BarcodeScannerPage from '@components/Barcode/BarcodeScanner';
import LoadingSpinner from '@components/LoadingSpinner';
import SearchBillForm from '@components/SearchBillForm/SearchBillForm';
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
import { IBill, ICategory } from '@models/klm';
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
      if (!bill) throw new Error('Bill data is undefined');

      // Calculate the total amount before validating the bill
      const orderAmount = calculateTotalAmount(bill.order ?? []);
      setBill(
        (prevBill) =>
          ({
            ...prevBill,
            totalAmount: orderAmount,
            grandTotal: orderAmount - (prevBill?.discount ?? 0),
          }) as IBill | undefined,
      );

      await validateBill({
        ...bill,
        totalAmount: orderAmount,
        grandTotal: orderAmount - (bill?.discount ?? 0),
      } as IBill);

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
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-2">
      {/* Header Area */}
      <div className="flex flex-col space-y-2">
        {/* Top Bar with New/Search */}
        <div className="rounded-lg bg-base-200 p-2 shadow">
          <div className="flex items-center justify-between">
            <button className="btn btn-primary btn-sm" onClick={createNewBill}>
              <PlusCircleIcon className="h-5 w-5" />
              New Bill
            </button>
            <div className="flex gap-2">
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
            </div>
          </div>
        </div>

        {/* Bill Header */}
        {bill && (
          <div className="rounded-lg bg-base-200 p-2 shadow">
            <BillHeader bill={bill} setBill={setBill} />
          </div>
        )}
      </div>

      {/* Main Work Area */}
      {bill && (
        <div className="flex flex-1 flex-col space-y-2">
          {/* Add/Remove Order Controls */}
          <div className="rounded-lg bg-base-200 p-2">
            <IncreaseDecreaseSection
              bill={bill}
              handleNewOrder={handleNewOrder}
              handleRemoveOrder={handleRemoveOrder}
            />
          </div>

          {/* Orders and Tracking Area */}
          <div className="grid flex-1 grid-cols-[1fr_auto] gap-2 px-1">
            {/* Left: Orders Section */}
            <div className="flex flex-col gap-1 rounded-lg bg-base-300">
              <div className="flex-1 overflow-y-auto bg-base-100 p-1">
                {/* Orders Content */}
                <div className="space-y-2">
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
                      handleColorSelect={(color) => handleColorSelect(color, orderIndex, setBill)}
                    />
                  ))}
                </div>
              </div>
              {/* Save/Update/Print Bar */}
              <SaveUpdatePrint
                newBill={newBill}
                bill={bill}
                printType={printType}
                setPrintType={setPrintType}
                handleSaveBill={handleSaveBill}
                handleUpdateBill={handleUpdateBill}
              />
            </div>

            {/* Right: Items Track */}
            <div className="w-80 rounded-lg bg-base-100">
              <ItemsTrack bill={bill} />
            </div>
          </div>

          {/* Bottom Tables */}
          <div className="grid grid-rows-2 gap-2 bg-base-100 px-0.5">
            <BillTable caption="Today's Bills" bills={formattedTodayBill as unknown as IBill[]} />
            <BillTable caption="This Week's Bills" bills={formattedThisWeekBill as unknown as IBill[]} />
          </div>
        </div>
      )}
    </div>
  );
}
