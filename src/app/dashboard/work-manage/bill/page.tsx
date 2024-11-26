'use client';
import { BarcodeScannerPage } from '@/app/components/Barcode/BarcodeScanner';
import ColorPickerButton from '@/app/components/ColorPickerButton/ColorPickerButton';
import SearchBillForm from '@/app/components/SearchBillForm/SearchBillForm';
import BillHeader from '@/app/dashboard/work-manage/bill/components/BillHeader';
import BillTable from '@/app/dashboard/work-manage/bill/components/BillTable';
import IncreaseDecreaseSection from '@/app/dashboard/work-manage/bill/components/IncreaseDecreaseSection';
import ItemsTrack from '@/app/dashboard/work-manage/bill/components/ItemsTrack';
import SaveUpdatePrint from '@/app/dashboard/work-manage/bill/components/SaveUpdatePrint';
import { userConfirmation } from '@/app/util/confirmation/confirmationUtil';
import handleError from '@/app/util/error/handleError';
import { ApiGet, ApiPost, ApiPut } from '@/app/util/makeApiRequest/makeApiRequest';
import { getSearchParam, setSearchParam } from '@/app/util/url/urlUtils';
import { IBill, ICategory, IColor, IDimensionTypes, IDimensions, IStyle, IStyleProcess, ITax } from '@/models/klm';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import {
  BriefcaseIcon,
  CurrencyRupeeIcon,
  InformationCircleIcon,
  QrCodeIcon,
  TagIcon,
} from '@heroicons/react/24/solid';
import { Types } from 'mongoose';
import React, { useMemo } from 'react';
import toast from 'react-hot-toast';

export default function BillPage() {
  const [category, setCategory] = React.useState<ICategory[] | []>([]);
  const [tax, setTax] = React.useState<ITax[]>([]);
  const [bill, setBill] = React.useState<IBill>();
  const [todayBill, setTodayBill] = React.useState<IBill[]>([]);
  const [thisWeekBill, setThisWeekBill] = React.useState<IBill[]>([]);
  const [searchBill, setSearchBill] = React.useState<IBill[] | undefined>(undefined);
  const [newBill, setNewBill] = React.useState<boolean>(true);
  const [barcode, setBarcode] = React.useState<string>('');

  const [printType, setPrintType] = React.useState<string>('customer');
  React.useEffect(() => {
    (async () => {
      try {
        const catResponse = await ApiGet.Category();
        const taxResponse = await ApiGet.Tax();
        const BillResponse = await ApiGet.Bill.BillToday();

        if (catResponse.success === true) {
          if (catResponse.categories.length === 0) {
            toast('No category found. Please add a category to continue.', { icon: '📦' });
          }
          setCategory(catResponse.categories);
        } else {
          toast.error('An error occurred while fetching category data. Please try again later.');
          throw new Error(catResponse.message);
        }

        if (taxResponse.success === true || taxResponse) {
          if (taxResponse.length === 0) {
            toast('No tax found. Please add a tax to continue.', { icon: '📦' });
          }
          setTax(taxResponse);
        } else {
          toast.error('An error occurred while fetching tax data. Please try again later.');
          throw new Error(taxResponse.message);
        }

        if (BillResponse.success === true) {
          setTodayBill(BillResponse.todayBill);
          setThisWeekBill(BillResponse.weekBill);
        } else {
          toast.error("An error occurred while fetching today's bill data. Please try again later.");
          throw new Error(BillResponse.message);
        }
      } catch (error) {
        // toast.error(error.message);
        handleError.toastAndLog(error);
      }
    })();
  }, []);

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
    } as IBill);
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
      } as IBill;
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
      } as IBill;
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

  React.useEffect(() => {
    calculateGrandTotal();
  }, [calculateGrandTotal]);

  async function validateBill(bill: IBill | undefined) {
    if (!bill) throw new Error('No bill data found');
    if (!bill.billNumber) throw new Error('Bill number is required');
    if (!bill.order) throw new Error('No orders added');
    if (!bill.date) throw new Error('Date is required');
    if (!bill.dueDate) throw new Error('Due date is required');
    if (!bill.mobile) throw new Error('Mobile number is required');

    // for each order check amount is greater than 0
    const invalidOrderIndex = bill.order.findIndex((order) => (order.amount ?? 0) <= 0);
    if (invalidOrderIndex !== -1) {
      throw new Error(`Amount should be greater than 0 for order Sl No ${invalidOrderIndex + 1}`);
    }
  }

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

  const formattedTodayBill = useMemo(() => todayBill, [todayBill]);
  const formattedThisWeekBill = useMemo(() => thisWeekBill, [thisWeekBill]);

  const billSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setBill(undefined);
      const inputValue: number = (event.target as HTMLFormElement).billSearch.value;
      const typeBillOrMobile: string = (event.target as HTMLFormElement).selectBill.value;

      const res = await ApiGet.Bill.BillSearch(inputValue, typeBillOrMobile);

      if (res.success === true) {
        setSearchBill(res.bill);
      } else {
        setSearchBill(undefined);
        throw new Error(res.message);
      }
    } catch (error) {
      // toast.error(error.message);
      handleError.toastAndLog(error);
    }
  };

  const searchRowClicked = (billId: string) => async () => {
    try {
      const selectedBill = (searchBill ?? []).find((bill) => bill._id.toString() === billId);
      if (selectedBill) {
        setNewBill(false);
        setBill(selectedBill);
        updateUrlWithBillNumber(selectedBill.billNumber.toString());
        setSearchBill(undefined);
      } else {
        toast.error('Bill not found');
      }
    } catch (error) {
      // toast.error(error.message);
      handleError.toastAndLog(error);
    }
  };

  React.useEffect(() => {
    const billNumber = getSearchParam('billNumber');

    if (billNumber) {
      (async () => {
        try {
          const res = await ApiGet.Bill.BillSearch(parseInt(billNumber), 'bill');
          if (res.success && res.bill.length > 0) {
            setNewBill(false);
            setBill(res.bill[0]);
          } else {
            throw new Error(res.message);
          }
        } catch (error) {
          handleError.toastAndLog(error);
        }
      })();
    }
  }, []);

  React.useEffect(() => {
    if (!barcode) return;

    const billNumberMatch = barcode.match(/billNumber=(\d+)/);
    if (!billNumberMatch) return;

    const billNumber = billNumberMatch[1];
    if (!billNumber) {
      handleError.toastAndLog(new Error('No bill number found in barcode'));
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

  const updateUrlWithBillNumber = (billNumber: string) => {
    setSearchParam('billNumber', billNumber);
  };

  const handleColorSelect = async (color: IColor, orderIndex: number) => {
    await setBill((prevBill) => {
      if (!prevBill) return prevBill;

      const updatedOrder = [...prevBill.order];
      const order = updatedOrder[orderIndex];
      if (!order) return prevBill;

      updatedOrder[orderIndex] = {
        ...order,
        color: color,
      };

      return {
        ...prevBill,
        order: updatedOrder,
      } as IBill;
    });
  };

  return (
    <span className="table-column h-full">
      <div className="flex h-full w-full flex-col shadow max-sm:table-cell">
        <span className="flex min-w-fit flex-row flex-wrap items-center justify-between gap-2 rounded-box bg-accent/10 px-3 py-1.5 backdrop-blur-xl max-sm:flex-col">
          <button className="btn btn-primary btn-sm" onClick={createNewBill}>
            <PlusCircleIcon className="h-5 w-5" />
            New
          </button>
          <BarcodeScannerPage
            onScanComplete={setBarcode}
            scannerId="billHeaderScanner"
            scanModalId="billHeaderScanner_modal"
          />
          <SearchBillForm onSearch={billSearch} searchResults={searchBill} onRowClick={searchRowClicked} />
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
                    <div
                      key={orderIndex}
                      className="flex w-full justify-between gap-1 rounded-box border border-base-300 bg-base-100 p-1 shadow max-sm:flex-wrap max-sm:justify-around"
                    >
                      <div className="flex grow flex-col gap-1 rounded-box border-2 border-base-300 bg-base-200 p-2 shadow">
                        {/* 1st row */}
                        <div className="flex w-full flex-row items-center justify-between gap-1 max-sm:flex-col-reverse">
                          <div className="flex w-full flex-row flex-wrap justify-start gap-1">
                            <div className="flex flex-row items-center justify-between gap-1 max-sm:w-full">
                              <label
                                htmlFor={`slNo_${orderIndex}`}
                                className="input input-sm label-text input-bordered input-primary flex grow items-center gap-2"
                              >
                                Sl No:
                                <input
                                  type="text"
                                  name={`slNo_${orderIndex}`}
                                  id={`slNo_${orderIndex}`}
                                  placeholder="Sl No"
                                  className="w-10 grow select-none text-center"
                                  value={orderIndex + 1}
                                  readOnly
                                />
                              </label>
                            </div>
                            <div className="flex flex-row items-center justify-between gap-1 rounded-box bg-neutral p-1 max-sm:w-full">
                              <TagIcon className="h-5 w-5 text-info" />
                              <label htmlFor={`category_${orderIndex}`} className="label label-text">
                                Category
                              </label>
                              <select
                                name={`category_${orderIndex}`}
                                id={`category_${orderIndex}`}
                                className="select select-primary select-sm w-32 max-w-sm"
                                value={order.category?.categoryName || ''}
                                onChange={(e) => {
                                  const selectedCategoryId = e.target.selectedOptions[0]?.getAttribute('itemID');
                                  if (selectedCategoryId) {
                                    setBill({
                                      ...bill,
                                      order: bill.order?.map((o, i) =>
                                        i === orderIndex
                                          ? {
                                              ...o,
                                              category: {
                                                catId: new Types.ObjectId(selectedCategoryId),
                                                categoryName: e.target.value,
                                              },
                                            }
                                          : o,
                                      ),
                                    } as IBill);
                                  } else {
                                    setBill({
                                      ...bill,
                                      order: bill.order?.map((o, i) =>
                                        i === orderIndex
                                          ? {
                                              ...o,
                                              category: undefined,
                                            }
                                          : o,
                                      ),
                                    } as IBill);
                                  }
                                }}
                              >
                                <option value="" disabled>
                                  Select category
                                </option>
                                {category?.map((category, categoryIndex) => (
                                  <option
                                    key={categoryIndex}
                                    value={category.categoryName}
                                    itemID={category._id.toString()}
                                  >
                                    {category.categoryName}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex flex-row items-center justify-between gap-1 max-sm:w-full">
                              <label
                                htmlFor={`work_${orderIndex}`}
                                className="btn btn-neutral btn-sm flex h-full grow items-center gap-2"
                              >
                                <BriefcaseIcon className="h-5 w-5 text-info" />
                                Work:
                                <input
                                  type="checkbox"
                                  name={`work_${orderIndex}`}
                                  id={`work_${orderIndex}`}
                                  className="checkbox-primary checkbox checkbox-sm"
                                  checked={order.work}
                                  onChange={(e) =>
                                    setBill({
                                      ...bill,
                                      order: bill.order?.map((o, i) =>
                                        i === orderIndex ? { ...o, work: e.target.checked } : o,
                                      ),
                                    } as IBill)
                                  }
                                />
                              </label>
                            </div>
                            <div className="flex flex-row items-center justify-between gap-1 max-sm:w-full">
                              <label
                                htmlFor={`barcode_${orderIndex}`}
                                className="btn btn-neutral btn-sm flex h-full grow items-center gap-2"
                              >
                                <QrCodeIcon className="h-5 w-5 text-info" />
                                Barcode:
                                <input
                                  type="checkbox"
                                  name={`barcode_${orderIndex}`}
                                  id={`barcode_${orderIndex}`}
                                  className="checkbox-primary checkbox checkbox-sm"
                                  checked={order.barcode}
                                  onChange={(e) =>
                                    setBill({
                                      ...bill,
                                      order: bill.order?.map((o, i) =>
                                        i === orderIndex ? { ...o, barcode: e.target.checked } : o,
                                      ),
                                    } as IBill)
                                  }
                                />
                              </label>
                            </div>
                          </div>
                          {/* remove secific order */}
                          <div className="flex items-center justify-end max-sm:w-full">
                            <span
                              className="btn btn-secondary btn-xs tooltip tooltip-left tooltip-warning flex select-none font-bold"
                              onClick={handleRemoveOrder(orderIndex)}
                              data-tip="Remove this order"
                            >
                              <MinusCircleIcon className="h-5 w-5 text-secondary-content" />
                              <span>Remove</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-row justify-between gap-1 max-sm:flex-wrap">
                          {/*2nd row  Render dropdown select options for dimensions based on the selected category */}
                          {category.map((cat) => {
                            if (cat._id.toString() === bill?.order?.[orderIndex]?.category?.catId?.toString()) {
                              return cat.dimensionTypes?.map((typ: IDimensionTypes, typIndex: number) => (
                                <div
                                  key={typIndex}
                                  className="flex w-full flex-row flex-wrap items-center gap-1 max-sm:justify-between"
                                >
                                  <label
                                    htmlFor={`${typ.dimensionTypeName}_${orderIndex}_${typIndex}`}
                                    className="label label-text"
                                  >
                                    {typ.dimensionTypeName}
                                  </label>
                                  <div className="flex- col  flex flex-wrap gap-1">
                                    <select
                                      name={`${typ.dimensionTypeName}_${orderIndex}_${typIndex}`}
                                      id={`${typ.dimensionTypeName}_${orderIndex}_${typIndex}`}
                                      className="select select-primary select-sm max-w-sm"
                                      value={
                                        typ.dimensions?.find(
                                          (dim) => dim.dimensionName === order.dimension?.[typIndex]?.dimensionName,
                                        )?.dimensionName ?? ''
                                      }
                                      onChange={(e) => {
                                        const selectedDimensionTypeName = typ.dimensionTypeName;
                                        handleDimensionChange(
                                          selectedDimensionTypeName,
                                          e.target.value,
                                          order.dimension?.[typIndex]?.note ?? '',
                                          orderIndex,
                                          typIndex,
                                          cat.dimensionTypes?.length ?? 0,
                                        );
                                      }}
                                    >
                                      <option value="" disabled>
                                        Select dimension
                                      </option>
                                      {typ.dimensions &&
                                        typ.dimensions.map((dim: IDimensions, dimIndex: number) => (
                                          <option key={dimIndex} value={dim.dimensionName}>
                                            {dim.dimensionName}
                                          </option>
                                        ))}
                                    </select>
                                    <input
                                      type="text"
                                      name={`${typ.dimensionTypeName}_note_${orderIndex}_${typIndex}`}
                                      id={`${typ.dimensionTypeName}_note_${orderIndex}_${typIndex}`}
                                      placeholder={`${typ.dimensionTypeName} Note`}
                                      className="input input-sm input-primary"
                                      value={order.dimension?.[typIndex]?.note || ''}
                                      onChange={(e) => {
                                        const selectedDimensionTypeName = typ.dimensionTypeName;
                                        handleDimensionChange(
                                          selectedDimensionTypeName,
                                          order.dimension?.[typIndex]?.dimensionName ?? 'none',
                                          e.target.value,
                                          orderIndex,
                                          typIndex,
                                          cat.dimensionTypes?.length ?? 0,
                                        );
                                      }}
                                    />
                                  </div>
                                </div>
                              ));
                            }
                            return null;
                          })}
                        </div>
                        <div className="flex flex-row justify-between">
                          {/* 3rd row */}
                          <div className="flex grow flex-row flex-wrap items-center gap-1 max-sm:flex-col">
                            <span className="flex flex-col items-center gap-2">
                              <span className="flex w-full flex-row items-center justify-around rounded-box border border-base-content/50 bg-base-100 p-2 max-sm:w-full">
                                <ColorPickerButton
                                  onColorSelect={(color) => {
                                    handleColorSelect(color, orderIndex);
                                  }}
                                  modalId={`colorPickerBillModal_${orderIndex}`}
                                  selectedColor={order.color}
                                  labelHtmlFor={`colorPickerLabel_${orderIndex}`}
                                  inputId={`colorPickerLabel_${orderIndex}`}
                                />
                              </span>
                              <span className="flex flex-row flex-wrap justify-between max-sm:w-full">
                                <label
                                  htmlFor={`orderNotes_${orderIndex}`}
                                  className="input input-sm label-text input-bordered input-primary tooltip tooltip-top tooltip-info flex items-center gap-2"
                                  data-tip="Order Notes"
                                >
                                  <span className="flex items-center gap-1">
                                    <InformationCircleIcon className="h-5 w-5 text-info" />
                                    <p>Order:</p>
                                  </span>
                                  <input
                                    name={`orderNotes_${orderIndex}`}
                                    id={`orderNotes_${orderIndex}`}
                                    placeholder="Enter Order Notes"
                                    className="grow"
                                    value={order.orderNotes || ''}
                                    onChange={(e) =>
                                      setBill({
                                        ...bill,
                                        order: bill.order?.map((o, i) =>
                                          i === orderIndex ? { ...o, orderNotes: e.target.value } : o,
                                        ),
                                      } as IBill)
                                    }
                                  />
                                </label>
                              </span>
                            </span>
                            <span className="flex grow flex-row justify-between max-sm:w-full">
                              <label htmlFor={`measure_${orderIndex}`} className="label label-text">
                                Measure
                              </label>
                              <textarea
                                name={`measure_${orderIndex}`}
                                id={`measure_${orderIndex}`}
                                placeholder="Measure"
                                className="textarea textarea-bordered textarea-primary textarea-sm grow"
                                value={order.measurement || ''}
                                onChange={(e) =>
                                  setBill({
                                    ...bill,
                                    order: bill.order?.map((o, i) =>
                                      i === orderIndex ? { ...o, measurement: e.target.value } : o,
                                    ),
                                  } as IBill)
                                }
                              />
                            </span>
                            <span className="flex flex-col justify-between max-sm:w-full">
                              <label
                                htmlFor={`amount_${orderIndex}`}
                                className="input input-sm label-text input-bordered input-primary tooltip tooltip-top tooltip-info flex items-center gap-2"
                                data-tip="Amount"
                              >
                                <CurrencyRupeeIcon className="h-5 w-5 text-info" />
                                Amount:
                                <input
                                  name={`amount_${orderIndex}`}
                                  id={`amount_${orderIndex}`}
                                  placeholder="Amount"
                                  type="number"
                                  className="max-w-32"
                                  value={order.amount || ''}
                                  onChange={(e) => {
                                    const amount = parseFloat(e.currentTarget.value) || 0;
                                    const updatedOrder = bill.order.map((o, i) =>
                                      i === orderIndex ? { ...o, amount: amount } : o,
                                    );
                                    const newTotalAmount = updatedOrder.reduce(
                                      (total, item) => total + (item.amount || 0),
                                      0,
                                    );

                                    setBill(
                                      (prevBill) =>
                                        ({
                                          ...prevBill,
                                          order: updatedOrder,
                                          totalAmount: newTotalAmount,
                                        }) as IBill,
                                    );
                                  }}
                                />
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* style */}
                      <div className="flex flex-col items-center gap-1 rounded-box border-2 border-base-300 bg-base-200 p-2 max-sm:w-full max-sm:items-start">
                        <h2 className="label label-text p-0 text-center">Style</h2>
                        <div className="flex w-full flex-col flex-wrap justify-between gap-1 max-sm:flex-row">
                          {(category || []).map((cat) => {
                            if (cat._id.toString() === bill?.order?.[orderIndex]?.category?.catId?.toString()) {
                              return cat.styleProcess?.map((styleProcess: IStyleProcess, styleProcessIndex: number) => (
                                <div
                                  key={styleProcessIndex}
                                  className="flex w-full flex-row flex-wrap items-center gap-1 rounded-box bg-base-300 p-2 max-sm:justify-between"
                                >
                                  <label
                                    className="label label-text pb-0.5"
                                    htmlFor={`${styleProcess.styleProcessName}_${orderIndex}_${styleProcessIndex}`}
                                  >
                                    {styleProcess.styleProcessName}
                                  </label>
                                  <select
                                    name={`${styleProcess.styleProcessName}_${orderIndex}_${styleProcessIndex}`}
                                    id={`${styleProcess.styleProcessName}_${orderIndex}_${styleProcessIndex}`}
                                    className="select select-primary select-sm"
                                    onChange={(e) => {
                                      handleStyleProcessChange(
                                        e.target.value,
                                        styleProcess.styleProcessName,
                                        orderIndex,
                                        styleProcessIndex,
                                        cat.styleProcess?.length ?? 0,
                                      );
                                    }}
                                    value={
                                      styleProcess.styles?.find(
                                        (sty) => sty.styleName === order.styleProcess?.[styleProcessIndex]?.styleName,
                                      )?.styleName ?? ''
                                    }
                                  >
                                    <option value="" disabled>
                                      Select style
                                    </option>
                                    {styleProcess.styles?.map((styles: IStyle, stylesIndex: number) => (
                                      <option key={stylesIndex} value={styles.styleName}>
                                        {styles.styleName}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              ));
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    </div>
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
