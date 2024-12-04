'use client';
import BarcodeScannerPage from '@/app/components/Barcode/BarcodeScanner';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import SearchBillForm from '@/app/components/SearchBillForm/SearchBillForm';
import BillDetailsDropdownClear from '@/app/dashboard/work-manage/bill/components/BillDetails';
import BillHeader from '@/app/dashboard/work-manage/bill/components/BillHeader';
import BillTable from '@/app/dashboard/work-manage/bill/components/BillTable';
import IncreaseDecreaseSection from '@/app/dashboard/work-manage/bill/components/IncreaseDecreaseSection';
import ItemsTrack from '@/app/dashboard/work-manage/bill/components/ItemsTrack';
import OrderDetails from '@/app/dashboard/work-manage/bill/components/OrderDetails';
import SaveUpdatePrint from '@/app/dashboard/work-manage/bill/components/SaveUpdatePrint';
import {
  billSearch,
  checkOrderInUrl,
  clearBill,
  fetchInitialData,
  handleColorSelect,
  searchRowClicked,
  updateUrlWithBillNumber,
  validateBill,
} from '@/app/dashboard/work-manage/bill/utils/billUtils';
import { userConfirmation } from '@/app/util/confirmation/confirmationUtil';
import handleError from '@/app/util/error/handleError';
import { ApiGet, ApiPost, ApiPut } from '@/app/util/makeApiRequest/makeApiRequest';
import { getSearchParam } from '@/app/util/url/urlUtils';
import { IBill, ICategory, ITax } from '@/models/klm';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Types } from 'mongoose';
import React, { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

export default function BillPage() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [category, setCategory] = React.useState<ICategory[] | []>([]);
  const [tax, setTax] = React.useState<ITax[]>([]);
  const [bill, setBill] = React.useState<IBill>();
  const [todayBill, setTodayBill] = React.useState<IBill[]>([]);
  const [thisWeekBill, setThisWeekBill] = React.useState<IBill[]>([]);
  const [searchBill, setSearchBill] = React.useState<IBill[] | undefined>(undefined);
  const [newBill, setNewBill] = React.useState<boolean>(true);
  const [barcode, setBarcode] = React.useState<string>('');
  const [printType, setPrintType] = React.useState<string>('customer');

  const calculateGrandTotal = React.useCallback(() => {
    let totalTaxes = 0;
    if (bill?.totalAmount === undefined) return;

    // Check if taxes are selected or present
    if (bill?.tax && bill.tax.length > 0) {
      // Calculate total taxes
      bill.tax.forEach((tax) => {
        if (tax.taxType === 'Percentage') {
          totalTaxes += ((bill.totalAmount - bill?.discount) * (tax.taxPercentage ?? 0)) / 100;
        } else {
          totalTaxes += tax.taxPercentage ?? 0; // Direct amount tax
        }
      });
    }

    if ((bill?.totalAmount ?? 0) >= 0) {
      setBill(
        (prevBill) =>
          ({
            ...prevBill,
            grandTotal: (prevBill?.totalAmount ?? 0) - (prevBill?.discount ?? 0) + totalTaxes,
          }) as IBill,
      );
    }
  }, [bill?.totalAmount, bill?.discount, bill?.tax]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchInitialData(setCategory, setTax, setTodayBill, setThisWeekBill);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    calculateGrandTotal();
  }, [calculateGrandTotal]);

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
    setBill({
      billNumber: (lastBill?.lastBill?.billNumber ?? 0) + 1,
      date: new Date(),
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      urgent: false,
      trail: false,
      name: '',
      email: '',
      paidAmount: 0,
      dueAmount: 0,
      paymentStatus: 'Unpaid',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IBill);
  }

  const handleNewOrder = () => {
    // Create a new order object with default values and empty dimension and styleProcess arrays
    const newOrder = {
      category: {
        catId: new Types.ObjectId(),
        categoryName: '',
      },
      dimension: [],
      styleProcess: [],
      work: false,
      barcode: false,
      measurement: '',
      orderNotes: '',
      color: { _id: new Types.ObjectId(), name: '', code: '' },
      amount: 0,
      status: 'Pending',
    };

    // Create a copy of the existing orders array and add the new order
    const updatedOrders = [...(bill?.order || []), newOrder];

    // Update the bill state with the new orders array
    setBill({
      ...bill,
      order: updatedOrders,
    } as IBill | undefined);
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

  const handleRowClick = (taxId: string) => {
    // Find the tax object with the given ID
    const selectedTax = tax.find((t) => t._id.toString() === taxId);
    if (selectedTax === undefined) {
      toast.error('Selected tax not found');
    }
    if (selectedTax) {
      // If the tax is already selected, remove it from the selectedTax array
      if (bill?.tax?.some((t) => t._id === selectedTax._id)) {
        setBill({ ...bill, tax: bill.tax.filter((t) => t._id !== selectedTax._id) } as IBill);
      } else {
        // If the tax is not already selected, add it to the selectedTax array
        setBill({ ...bill, tax: [...(bill?.tax || []), selectedTax] } as IBill);
      }
    }
  };

  async function handleSaveBill() {
    try {
      await validateBill(bill);

      if (!bill) throw new Error('Bill data is undefined');
      const res = await ApiPost.Bill(bill);
      if (res.success === true) {
        setTodayBill([...todayBill, res.today]);
        setBill(res.bill);
        setNewBill(false);
        toast.success(res.message);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      handleError.toastAndLog(error);
    }
  }

  async function handleUpdateBill() {
    const update = await userConfirmation({
      header: 'Confirm Update',
      message: 'Are you sure you want to update this bill?',
    });
    if (!update) return;

    const updateBill = async () => {
      const res = await ApiPut.Bill(bill?._id?.toString() ?? '', bill as IBill);
      if (res.success === true) {
        setTodayBill([...todayBill, res.today]);
        setBill(res.bill);
        return res.message;
      } else {
        throw new Error(res.message);
      }
    };

    try {
      await validateBill(bill);
      if (!(bill ?? {})._id) throw new Error('No bill ID found to update');
      await toast.promise(updateBill(), {
        loading: 'Updating bill...',
        success: (message: string) => <b>{message}</b>,
        error: (error: Error) => <b>{error.message}</b>,
      });
    } catch (error) {
      handleError.toastAndLog(error);
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
                searchRowClicked(billId, searchBill, setBill, setSearchBill, updateUrlWithBillNumber)
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
              <ItemsTrack bill={bill} tax={tax} handleRowClick={handleRowClick} setBill={setBill} />
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
