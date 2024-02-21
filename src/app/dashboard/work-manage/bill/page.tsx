'use client';
import { userConfirmaion } from '@/app/util/confirmation/confirmationUtil';
import { ApiGet } from '@/app/util/makeApiRequest/makeApiRequest';
import { IBill, ICategory, ITax } from '@/models/klm';
import axios from 'axios';
import { Types } from 'mongoose';
import React from 'react';
import toast from 'react-hot-toast';

export default function BillPage() {
  const [category, setCategory] = React.useState<ICategory[]>([]);
  const [tax, setTax] = React.useState<ITax[]>([]);
  const [bill, setBill] = React.useState<IBill>();

  React.useEffect(() => {
    (async () => {
      try {
        const cat = await ApiGet.Category();
        const tax = await ApiGet.Tax();
        if (cat.success === true) {
          setCategory(cat.categories);
          setTax(tax);
        } else {
          toast.error('An error occurred while fetching category and tax data\nPlease try again later.');
          throw new Error(cat.message || tax.message);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    })();
  }, []);

  React.useEffect(() => {
    // TODO: remove console
    // eslint-disable-next-line no-console
    console.log('current bill:', bill);
  }, [bill]);

  const createNewBill = () => {
    setBill({
      date: new Date(),
      dueDate: new Date(),
      urgent: false,
      trail: false,
      name: '',
      email: '',
      paidAmount: 0,
      dueAmount: 0,
      paymentStatus: 'Unpaid',
      billBy: new Types.ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IBill);
  };

  const searchOldBill = async (e: React.FormEvent<HTMLFormElement>) => {
    const billNo = e.currentTarget.billSearch.value;
    const search = async (billNo: number) => {
      const res = await axios.get('/api/dashboard/work-manage/bill', { params: { billNo } });
      if (res.data.success === true) {
        setBill(res.data.bill);
        return res.data.message;
      } else {
        throw new Error(res.data.message);
      }
    };
    try {
      await toast.promise(search(billNo), {
        loading: 'Searching and fetching bill...',
        success: (message) => <b>{message}</b>,
        error: (err) => <b>{err.message}</b>,
      });
    } catch (error: any) {
      // console.log(error.message);
    }
  };

  const handleNewOrder = () => {
    setBill({
      ...bill,
      order: [
        ...(bill?.order || []),
        {
          category: {
            catId: new Types.ObjectId(),
            categoryName: '',
          },
          work: false,
          barcode: false,
          measurement: '',
          amount: 0,
          status: 'Pending',
        },
      ],
    } as IBill);
  };

  function handleRemoveOrder(index: number): React.MouseEventHandler<HTMLButtonElement> | undefined {
    return async () => {
      const Confirmed = await userConfirmaion({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this order?',
      });
      if (!Confirmed) return;

      try {
        if (index >= 0 && (bill?.order?.length ?? 0) >= 0) {
          // Remove the order at the specified index and update the total amount
          const updatedOrder = bill?.order.filter((_, i) => i !== index);
          const newTotalAmount = updatedOrder?.reduce((total, item) => total + (item.amount || 0), 0);
          setBill({
            ...bill,
            order: updatedOrder,
            totalAmount: newTotalAmount,
          } as IBill);
        }
      } catch (error) {}
    };
  }

  const handleRowClick = (taxId: string) => {
    // Find the tax object with the given ID
    const selectedTax = tax.find((t) => t._id === taxId);
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

  const handleTotal = async () => {
    if (!bill?.order) return;
    setBill({ ...bill, totalAmount: bill.order.reduce((total, item) => total + (item.amount || 0), 0) } as IBill);
  };

  const calculateGrandTotal = React.useCallback(() => {
    let totalTaxes = 0;

    // Check if taxes are selected or present
    if (bill?.tax && bill.tax.length > 0) {
      // Calculate total taxes
      bill.tax.forEach((tax) => {
        if (tax.taxType === 'Percentage') {
          totalTaxes += ((bill.totalAmount - bill?.discount) * tax.taxPercentage) / 100;
        } else {
          totalTaxes += tax.taxPercentage; // Direct amount tax
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

  return (
    <span className="table-column h-full">
      <div className="flex h-full w-full flex-col shadow max-sm:table-cell">
        <div className="flex flex-row flex-wrap items-center justify-between gap-1 rounded-box bg-accent/10 px-3 py-1.5 backdrop-blur-xl">
          <span className="new">
            <button className="btn btn-primary btn-sm" onClick={createNewBill}>
              New
            </button>
          </span>
          <form onSubmit={searchOldBill} className="search flex flex-row flex-wrap items-center gap-2 max-sm:flex-col">
            <div className="flex flex-row items-center gap-1">
              <label htmlFor="billSearch" className="label-text">
                Bill No
              </label>
              <input
                name="billSearch"
                id="billSearch"
                onFocus={(e) => e.target.select()}
                className="input input-bordered input-primary input-sm w-40 bg-accent/5 max-sm:input-sm"
                type="number"
                required
                placeholder="Bill Search"
              />
            </div>
            <button className="btn btn-primary btn-sm max-sm:w-full">Search</button>
          </form>
        </div>
        {/* new bill */}

        <span className="contents">
          {/* Bill header */}
          <div className="flex w-full flex-none justify-between gap-1 rounded-box border border-base-300 p-1 max-sm:max-h-48 max-sm:flex-col max-sm:overflow-auto">
            <div className="flex flex-row flex-wrap items-center gap-1">
              <div className="flex flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
                <label className="label label-text" htmlFor="billNo">
                  Bill No
                </label>
                <input
                  name="billNo"
                  placeholder="Bill No"
                  id="billNo"
                  type="number"
                  value={bill?.billNumber}
                  onChange={(e) => setBill({ ...bill, billNumber: parseInt(e.target.value) } as IBill)}
                  className="input input-bordered input-primary w-32 max-sm:input-sm"
                />
              </div>
              <div className="flex flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
                <label className="label label-text" htmlFor="date">
                  Date
                </label>
                <input
                  name="date"
                  id="date"
                  type="date"
                  value={bill?.date?.toISOString().split('T')[0]}
                  onChange={(e) => setBill({ ...bill, date: new Date(e.target.value) } as IBill)}
                  className="input input-bordered input-primary max-sm:input-sm"
                />
              </div>
              <div className="flex flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
                <label className="label label-text" htmlFor="dueDate">
                  Due Date
                </label>
                <input
                  name="dueDate"
                  id="dueDate"
                  type="date"
                  value={bill?.dueDate?.toISOString().split('T')[0]}
                  onChange={(e) => setBill({ ...bill, dueDate: new Date(e.target.value) } as IBill)}
                  className="input input-bordered input-primary max-sm:input-sm"
                />
              </div>
              <div className="flex flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
                <label className="label label-text" htmlFor="urgent">
                  Urgent
                </label>
                <input
                  name="urgent"
                  id="urgent"
                  type="checkbox"
                  className="checkbox-primary checkbox"
                  checked={bill?.urgent}
                  onChange={(e) => setBill({ ...bill, urgent: e.target.checked } as IBill)}
                />
              </div>
              <div className="flex flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
                <label className="label label-text" htmlFor="trail">
                  Trail
                </label>
                <input
                  name="trail"
                  id="trail"
                  type="checkbox"
                  className="checkbox-primary checkbox"
                  checked={bill?.trail}
                  onChange={(e) => setBill({ ...bill, trail: e.target.checked } as IBill)}
                />
              </div>
              <div className="flex flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
                <label className="label label-text" htmlFor="mobile">
                  Mobile
                </label>
                <input
                  name="mobile"
                  placeholder="Mobile No"
                  id="mobile"
                  type="number"
                  className="input input-bordered input-primary max-sm:input-sm"
                  value={bill?.mobile}
                  onChange={(e) => setBill({ ...bill, mobile: parseInt(e.target.value) } as IBill)}
                />
              </div>
              <div className="flex flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
                <label className="label label-text" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Customer Name"
                  id="name"
                  className="input input-bordered input-primary max-sm:input-sm"
                  value={bill?.name}
                  onChange={(e) => setBill({ ...bill, name: e.target.value } as IBill)}
                />
              </div>
              <div className="flex flex-row flex-wrap items-center max-sm:w-full max-sm:justify-between">
                <label className="label label-text" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Customer Email"
                  id="email"
                  className="input input-bordered input-primary max-sm:input-sm"
                  value={bill?.email}
                  onChange={(e) => setBill({ ...bill, email: e.target.value } as IBill)}
                />
              </div>
            </div>
          </div>
          {/* increase or decrease */}
          <div className="mx-2 flex h-fit flex-row gap-2 rounded-box bg-accent/15 px-2 py-1 backdrop-blur-xl">
            <span className="btn btn-primary btn-xs select-none font-extrabold" onClick={handleNewOrder}>
              Add
            </span>
            <span
              className="btn btn-secondary btn-xs select-none font-extrabold"
              onClick={handleRemoveOrder((bill?.order?.length ?? 0) - 1)}
            >
              Remove
            </span>
          </div>
          {/* items and track in row */}
          <div className="flex h-full w-full flex-row items-start gap-1 rounded-box bg-base-300 p-1 max-sm:flex-col max-sm:items-center">
            <div className="flex h-full grow flex-col justify-between rounded-box border border-base-300">
              <div className="flex max-h-96 min-h-[92%] w-full grow flex-col gap-1 overflow-auto rounded-box bg-base-200">
                {/* orders */}
                {bill?.order?.map((order, index) => (
                  <div
                    key={index}
                    className="flex w-full justify-between gap-1 rounded-box border border-base-300 bg-base-100 p-1 shadow max-sm:flex-wrap max-sm:justify-around"
                  >
                    <div className="flex grow flex-col gap-1 rounded-box border-2 border-base-300 bg-base-200 p-2 shadow">
                      {/* 1st row */}
                      <div className="flex w-full flex-row items-center justify-between gap-1 max-sm:flex-col-reverse">
                        <div className="flex w-full flex-row flex-wrap justify-start gap-1">
                          <div className="flex flex-row items-center justify-between gap-1 max-sm:w-full">
                            <label htmlFor="slNo" className="label label-text">
                              Sl No
                            </label>
                            <input
                              type="text"
                              name="slNo"
                              placeholder="Sl No"
                              className="input input-bordered input-primary input-sm w-16 select-none"
                              value={index + 1}
                              readOnly
                            />
                          </div>
                          <div className="flex flex-row items-center justify-between gap-1 max-sm:w-full">
                            <label htmlFor="category" className="label label-text">
                              Category
                            </label>
                            <select
                              name="category"
                              className="select select-primary select-sm"
                              onChange={(e) => {
                                const selectedCategoryId = e.target.selectedOptions[0]?.getAttribute('itemID');
                                if (selectedCategoryId) {
                                  setBill({
                                    ...bill,
                                    order: bill.order?.map((o, i) =>
                                      i === index
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
                                      i === index
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
                              <option value={'none'}>soon</option>
                              {category?.map((category, categoryIndex) => (
                                <option key={categoryIndex} value={category.categoryName} itemID={category._id}>
                                  {category.categoryName}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex flex-row items-center justify-between gap-1 max-sm:w-full">
                            <label htmlFor="work" className="label label-text">
                              Work
                            </label>
                            <input
                              type="checkbox"
                              name="work"
                              className="checkbox-primary checkbox checkbox-sm"
                              checked={order.work}
                              onChange={(e) =>
                                setBill({
                                  ...bill,
                                  order: bill.order?.map((o, i) =>
                                    i === index ? { ...o, work: e.target.checked } : o,
                                  ),
                                } as IBill)
                              }
                            />
                          </div>
                          <div className="flex flex-row items-center justify-between gap-1 max-sm:w-full">
                            <label htmlFor="barcode" className="label label-text">
                              Barcode
                            </label>
                            <input
                              type="checkbox"
                              name="barcode"
                              className="checkbox-primary checkbox checkbox-sm"
                              checked={order.barcode}
                              onChange={(e) =>
                                setBill({
                                  ...bill,
                                  order: bill.order?.map((o, i) =>
                                    i === index ? { ...o, barcode: e.target.checked } : o,
                                  ),
                                } as IBill)
                              }
                            />
                          </div>
                        </div>
                        {/* remove secific order */}
                        <div className="flex items-center justify-end max-sm:w-full">
                          <span
                            className="btn btn-secondary btn-xs select-none font-bold"
                            onClick={handleRemoveOrder(index)}
                          >
                            Remove
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-row justify-between gap-1 max-sm:flex-wrap">
                        {/*2nd row  Render dropdown select options for dimensions based on the selected category */}
                        {(category || []).map((cat) => {
                          if (cat._id === bill?.order?.[index]?.category?.catId?.toString()) {
                            return cat.dimension?.map((typ: any, typIndex: any) => (
                              <div
                                key={typIndex}
                                className="flex w-full flex-row flex-wrap items-center gap-1 max-sm:justify-between"
                              >
                                <label htmlFor={typ.dimensionTypeName} className="label label-text">
                                  {typ.dimensionTypeName}
                                </label>
                                <div className="flex- col  flex flex-wrap gap-1">
                                  <select
                                    name={typ.dimensionTypeName}
                                    id={typ.dimensionTypeName}
                                    className="select select-primary select-sm max-w-sm"
                                    onChange={(e) => {
                                      setBill({
                                        ...bill,
                                        order: bill.order?.map((o, i) =>
                                          i === index
                                            ? {
                                                ...o,
                                                dimension: {
                                                  ...o.dimension,
                                                  [typIndex]: {
                                                    dimensionTypeName: typ.dimensionTypeName,
                                                    dimensionName: e.target.value === 'none' ? null : e.target.value,
                                                  },
                                                },
                                              }
                                            : o,
                                        ),
                                      } as IBill);
                                    }}
                                  >
                                    <option value="none">Select dimension</option>
                                    {typ.dimensionTypes &&
                                      typ.dimensionTypes.map((dim: any, dimIndex: number) => (
                                        <option key={dimIndex} value={dim.dimensionName}>
                                          {dim.dimensionName}
                                        </option>
                                      ))}
                                  </select>
                                  <input
                                    type="text"
                                    name={typ.dimensionTypeName}
                                    placeholder={`${typ.dimensionTypeName} Note`}
                                    className="input input-primary input-sm"
                                    value={typ.note}
                                    onChange={(e) => {
                                      setBill({
                                        ...bill,
                                        order: bill.order?.map((o, i) =>
                                          i === index
                                            ? {
                                                ...o,
                                                dimension: {
                                                  ...o.dimension,
                                                  [typIndex]: {
                                                    ...o.dimension[typIndex],
                                                    note: e.target.value,
                                                  },
                                                },
                                              }
                                            : o,
                                        ),
                                      } as IBill);
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
                          <span className="flex grow flex-row justify-between max-sm:w-full">
                            <label htmlFor="measure" className="label label-text">
                              Measure
                            </label>
                            <textarea
                              name="measure"
                              placeholder="Measure"
                              className="textarea textarea-bordered textarea-primary textarea-sm grow"
                              value={order.measurement}
                              onChange={(e) =>
                                setBill({
                                  ...bill,
                                  order: bill.order?.map((o, i) =>
                                    i === index ? { ...o, measurement: e.target.value } : o,
                                  ),
                                } as IBill)
                              }
                            />
                          </span>
                          <span className="flex flex-row justify-between max-sm:w-full">
                            <label htmlFor="amount" className="label label-text">
                              Amount
                            </label>
                            <input
                              name="amount"
                              placeholder="Amount"
                              type="number"
                              className="input input-bordered input-primary input-sm max-w-32"
                              value={order.amount || ''}
                              onChange={(e) => {
                                const amount = parseFloat(e.currentTarget.value) || 0;
                                const updatedOrder = bill.order.map((o, i) =>
                                  i === index ? { ...o, amount: amount } : o,
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
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* style */}
                    <div className="flex flex-col items-center gap-1 rounded-box border-2 border-base-300 bg-base-200 p-2 max-sm:w-full max-sm:items-start">
                      <h2 className="label label-text p-0 text-center">Style</h2>
                      <div className="flex w-full flex-col flex-wrap justify-between gap-1 max-sm:flex-row">
                        {(category || []).map((cat) => {
                          if (cat._id === bill?.order?.[index]?.category?.catId?.toString()) {
                            return cat.styleProcess?.map((styleProcess: any, styleProcessIndex: any) => (
                              <div
                                key={styleProcessIndex}
                                className="flex w-full flex-row flex-wrap items-center gap-1 rounded-box bg-base-300 p-2 max-sm:justify-between"
                              >
                                <label className="label label-text pb-0.5" htmlFor={styleProcess.styleProcessName}>
                                  {styleProcess.styleProcessName}
                                </label>
                                <select
                                  name={styleProcess.styleProcessName}
                                  className="select select-primary select-sm"
                                  onChange={(e) => {
                                    setBill({
                                      ...bill,
                                      order: bill.order?.map((o, i) =>
                                        i === index
                                          ? {
                                              ...o,
                                              styleProcess: {
                                                ...o.styleProcess,
                                                [styleProcessIndex]: {
                                                  styleProcessName: styleProcess.styleProcessName,
                                                  styleName: e.target.value === 'none' ? null : e.target.value,
                                                },
                                              },
                                            }
                                          : o,
                                      ),
                                    } as IBill);
                                  }}
                                  value={order.styleProcess?.[styleProcessIndex]?.styleName || 'none'}
                                >
                                  <option value="none">Select style</option>
                                  {styleProcess.styles?.map((styles: any, stylesIndex: any) => (
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
              <div className="mx-1 flex items-center justify-between gap-1 rounded-box border-t-2 border-base-300 bg-base-200 p-2">
                <span className="flex gap-2 pl-2">
                  <button className="btn btn-primary btn-sm">Save</button>
                  <button className="btn btn-secondary btn-sm">Update</button>
                  <button className="btn btn-accent btn-sm">Print</button>
                </span>
                <div className="flex flex-row justify-between gap-1 max-sm:flex-col">
                  <div className="flex flex-row items-center justify-between">
                    <b className="label-text">Paid:</b>
                    <p className="label label-text">0000</p>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <b className="label-text">Due:</b>
                    <p className="label label-text">0000</p>
                  </div>
                </div>
              </div>
            </div>
            {/* items track row */}
            <div className="flex h-full flex-col justify-between gap-1 overflow-hidden rounded-box border-2 border-base-100 bg-base-200 max-sm:w-[90%]">
              <div className="grow overflow-auto rounded-box border-4 border-base-300 bg-base-100">
                <div className="m-0 flex h-full max-h-96 w-full flex-col p-0">
                  <table className="table table-zebra table-pin-rows table-pin-cols">
                    <caption className="w-full caption-top text-center">
                      <h2 className="underline underline-offset-4">Items Track</h2>
                    </caption>
                    {/* head */}
                    <thead>
                      <tr>
                        <th>Sn</th>
                        <th>Amt</th>
                        <th>Tax</th>
                        <th>Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* row 1 */}
                      {/* Initialize the running total variable */}
                      {bill?.order?.map((order, index) => {
                        let runningTotal: number = 0;
                        return (
                          <tr key={index}>
                            <th>{index + 1}</th>
                            <td>{order.amount}</td>
                            <td>0</td>
                            <td>
                              {/* Calculate the running total */}
                              {bill.order.slice(0, index + 1).map((o) => {
                                runningTotal += o.amount;
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
                <div className="flex flex-row items-center justify-between gap-1">
                  <label className="label-text" htmlFor="totalNet">
                    Total Net
                  </label>
                  <input
                    name="totalNet"
                    placeholder="Total Net"
                    id="totalNet"
                    type="number"
                    className="input input-bordered input-sm w-32"
                    value={bill?.totalAmount || ''}
                    readOnly
                    aria-readonly
                  />
                </div>
                <div className="flex flex-row items-center justify-between gap-1">
                  <label className="label-text" htmlFor="discount">
                    Discount
                  </label>
                  <input
                    name="discount"
                    placeholder="Discount"
                    id="discount"
                    type="number"
                    className={`input input-bordered input-sm w-32`}
                    value={bill?.discount || ''}
                    onChange={(e) =>
                      setBill({
                        ...bill,
                        discount: parseInt(e.target.value) || '',
                      } as IBill)
                    }
                  />
                </div>
                <dialog id="tax_modal" className="modal">
                  <div className="modal-box">
                    <h3 className="text-center text-lg font-bold">Tax</h3>
                    <div className="tax-table">
                      <table className="table table-zebra">
                        <thead>
                          <tr>
                            <th>Sn</th>
                            <th>Checkbox</th>
                            <th>Tax Name</th>
                            <th>Percentage/Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tax.map((tax, taxIndex) => (
                            <tr key={tax._id} className="hover" onClick={() => handleRowClick(tax._id)}>
                              <td>{taxIndex + 1}</td>
                              <td>
                                <label htmlFor={tax.taxName}>
                                  <input
                                    type="checkbox"
                                    className="checkbox-primary checkbox checkbox-sm"
                                    name={tax.taxName}
                                    id={tax.taxName}
                                    defaultChecked={bill?.tax?.some((t) => t._id === tax._id)}
                                    checked={bill?.tax?.some((t) => t._id === tax._id)}
                                  />
                                </label>
                              </td>
                              <td>{tax.taxName}</td>
                              <td>{tax.taxType === 'Percentage' ? `${tax.taxPercentage}%` : `${tax.taxPercentage}`}</td>
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
                    onClick={() => (document.getElementById('tax_modal') as HTMLDialogElement)?.showModal()}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-row items-center justify-between gap-1">
                  <label className="label-text" htmlFor="grandTotal">
                    Grand Total
                  </label>
                  <input
                    name="grandTotal"
                    placeholder="Grand Total"
                    id="grandTotal"
                    type="number"
                    className="input input-bordered input-sm w-32"
                    value={bill?.grandTotal || ''}
                    readOnly
                    aria-readonly
                  />
                </div>
              </div>
            </div>
          </div>
        </span>
      </div>
      {/* track table */}
      {bill && (
        <div className="my-0.5 flex max-h-96 w-full flex-col rounded-box bg-base-300 p-2">
          <div className="overflow-x-auto rounded-box border-2 border-base-300 bg-base-100">
            <table className="table table-zebra table-pin-rows">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>BillNumber</th>
                  <th>Mobile</th>
                  <th>Date</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <th>1</th>
                  <td>0000</td>
                  <td>00</td>
                  <td>000</td>
                  <td>000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </span>
  );
}
