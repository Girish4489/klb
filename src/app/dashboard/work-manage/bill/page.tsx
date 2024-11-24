'use client';
import { BarcodeScannerPage } from '@/app/components/Barcode/BarcodeScanner';
import BillHeader from '@/app/components/BillHeader/BillHeader';
import ColorPickerButton from '@/app/components/ColorPickerButton/ColorPickerButton';
import SearchBillForm from '@/app/components/SearchBillForm/SearchBillForm';
import BillTable from '@/app/components/tables/work-manage/bill/BillTable';
import { userConfirmation } from '@/app/util/confirmation/confirmationUtil';
import handleError from '@/app/util/error/handleError';
import { ApiGet, ApiPost, ApiPut } from '@/app/util/makeApiRequest/makeApiRequest';
import { getSearchParam, setSearchParam } from '@/app/util/url/urlUtils';
import { IBill, ICategory, IColor, IDimensionTypes, IDimensions, IStyle, IStyleProcess, ITax } from '@/models/klm';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import {
  BriefcaseIcon,
  CloudArrowUpIcon,
  CurrencyRupeeIcon,
  InformationCircleIcon,
  PrinterIcon,
  QrCodeIcon,
  TagIcon,
} from '@heroicons/react/24/solid';
import { Types } from 'mongoose';
import Link from 'next/link';
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
            <div className="mx-2 flex h-fit flex-row gap-2 rounded-box bg-accent/15 px-2 py-1">
              <span className="btn btn-primary btn-xs select-none font-extrabold" onClick={handleNewOrder}>
                <PlusCircleIcon className="h-5 w-5 text-primary-content" />
                Add
              </span>
              <span
                className="btn btn-secondary btn-xs select-none font-extrabold"
                onClick={handleRemoveOrder((bill?.order?.length ?? 0) - 1)}
              >
                <MinusCircleIcon className="h-5 w-5 text-secondary-content" />
                Remove
              </span>
            </div>
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
                {/* save, update, print */}
                <div className="z-10 mx-1 flex items-center justify-between gap-1 rounded-box border-t-2 border-base-300 bg-base-200 p-2">
                  <span className="flex gap-2 pl-2">
                    {newBill ? (
                      <button className="btn btn-primary btn-sm" onClick={handleSaveBill}>
                        <CloudArrowUpIcon className="h-5 w-5" />
                        Save
                      </button>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={handleUpdateBill}>
                        <CloudArrowUpIcon className="h-5 w-5" />
                        Update
                      </button>
                    )}
                    <span className="join">
                      <select
                        name="printType"
                        aria-label="Print Type"
                        className="join-item select select-bordered select-accent select-sm"
                        value={printType}
                        onChange={(e) => setPrintType(e.target.value)}
                      >
                        {/* <option tabIndex={0} value="both">
                          Both
                        </option> */}
                        <option tabIndex={1} value="customer">
                          Customer Bill
                        </option>
                        <option tabIndex={2} value="worker">
                          Worker Bill
                        </option>
                      </select>
                      <Link
                        className="btn btn-accent join-item btn-sm"
                        href={`/print-preview/bill/${printType}?billNumber=${bill.billNumber}`}
                        prefetch={false}
                      >
                        <PrinterIcon className="h-5 w-5" />
                        Print
                      </Link>
                    </span>
                  </span>
                  <div className="flex flex-row justify-between gap-1 max-sm:flex-col">
                    <div className="flex flex-row items-center justify-between">
                      <b className="label-text">Paid:</b>
                      <p className="label label-text">{bill.paidAmount}</p>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <b className="label-text">Due:</b>
                      <p className="label label-text">{bill.dueAmount}</p>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <b className="label-text">Status:</b>
                      <p className="label label-text">{bill.paymentStatus}</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* items track row */}
              <div className="flex h-full flex-col justify-between gap-1 overflow-hidden rounded-box border-2 border-base-100 bg-base-200 max-sm:w-[90%]">
                <div className="grow overflow-auto rounded-box border-4 border-base-300 bg-base-100">
                  <div className="m-0 flex h-full max-h-96 w-full flex-col p-0">
                    <table className="z-5 table table-zebra table-pin-rows table-pin-cols">
                      <caption className="w-full caption-top text-center">
                        <h2 className="underline underline-offset-4">Items Track</h2>
                      </caption>
                      {/* head */}
                      <thead>
                        <tr className="text-center">
                          <th>Sn</th>
                          <th>Amt</th>
                          <th>Tax</th>
                          <th>Net</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* row 1 */}
                        {/* Initialize the running total variable */}
                        {bill?.order?.map((order, orderIndex) => {
                          let runningTotal: number = 0;
                          return (
                            <tr key={orderIndex} className="text-center">
                              <th>{orderIndex + 1}</th>
                              <td>{order.amount}</td>
                              <td>0</td>
                              <td>
                                {/* Calculate the running total */}
                                {bill.order.slice(0, orderIndex + 1).map((o) => {
                                  runningTotal += o.amount ?? 0;
                                  return null;
                                })}
                                {runningTotal}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex flex-col gap-1 overflow-auto rounded-box border-4 border-base-300 bg-base-200 p-2">
                  <div className="flex flex-row items-center justify-between">
                    <label
                      className="input input-sm label-text input-bordered input-primary flex grow items-center gap-2"
                      htmlFor="totalNet"
                    >
                      Sub Total:
                      <input
                        name="totalNet"
                        placeholder="Total Net"
                        id="totalNet"
                        type="number"
                        className="grow"
                        value={bill?.totalAmount || ''}
                        readOnly
                        aria-readonly
                      />
                    </label>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <label
                      className="input input-sm label-text input-bordered input-primary flex grow items-center gap-2"
                      htmlFor="discount"
                    >
                      Discount:
                      <input
                        name="discount"
                        placeholder="Enter Discount Here"
                        id="discount"
                        type="number"
                        className={'grow'}
                        value={bill?.discount || ''}
                        onChange={(e) =>
                          setBill({
                            ...bill,
                            discount: parseInt(e.target.value) || '',
                          } as IBill)
                        }
                      />
                    </label>
                  </div>
                  <dialog id="tax_modal" className="modal">
                    <div className="modal-box">
                      <h3 className="text-center text-lg font-bold">Tax</h3>
                      <div className="tax-table">
                        <table className="table table-zebra">
                          <thead>
                            <tr className="text-center">
                              <th>Sn</th>
                              <th>Checkbox</th>
                              <th>Tax Name</th>
                              <th>Percentage/Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tax.map((tax, taxIndex) => (
                              <tr
                                key={tax._id.toString()}
                                className="hover text-center"
                                onClick={() => handleRowClick(tax._id.toString())}
                              >
                                <td>{taxIndex + 1}</td>
                                <td>
                                  <label htmlFor={tax.taxName} className="flex items-center justify-center">
                                    <input
                                      type="checkbox"
                                      className="checkbox-primary checkbox checkbox-sm"
                                      name={tax.taxName}
                                      id={tax.taxName}
                                      // defaultChecked={bill?.tax?.some((t) => t._id === tax._id)}
                                      checked={bill?.tax?.some((t) => t._id === tax._id) ?? false}
                                      onChange={() => handleRowClick(tax._id.toString())}
                                    />
                                  </label>
                                </td>
                                <td>{tax.taxName}</td>
                                <td>
                                  {tax.taxType === 'Percentage' ? `${tax.taxPercentage}%` : `${tax.taxPercentage}`}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="modal-action">
                        <form method="dialog">
                          <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
                          <button className="btn btn-sm">Close</button>
                        </form>
                      </div>
                    </div>
                  </dialog>
                  {/* Tax options select */}
                  <div className="flex flex-row items-center justify-between gap-1">
                    <label className="label-text" htmlFor="taxOptions">
                      Tax
                    </label>
                    <button
                      className="btn btn-primary btn-sm"
                      name="taxOptions"
                      id="taxOptions"
                      onClick={() => (document.getElementById('tax_modal') as HTMLDialogElement)?.showModal()}
                    >
                      <PlusCircleIcon className="h-5 w-5 text-primary-content" />
                      Add
                    </button>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <label
                      className="input input-sm label-text input-bordered input-primary flex items-center gap-2"
                      htmlFor="grandTotal"
                    >
                      Grand Total:
                      <input
                        name="grandTotal"
                        placeholder="Grand Total"
                        id="grandTotal"
                        type="number"
                        className="grow"
                        value={bill?.grandTotal || ''}
                        readOnly
                        aria-readonly
                      />
                    </label>
                  </div>
                </div>
              </div>
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
