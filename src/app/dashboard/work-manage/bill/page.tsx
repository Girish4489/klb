'use client';
import { IBill, ICategory } from '@/models/klm';
import axios from 'axios';
import { Types } from 'mongoose';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
// import 'tslib';

export default function BillPage() {
  const router = useRouter();

  const [category, setCategory] = React.useState<ICategory[]>([]);
  const [bill, setBill] = React.useState<IBill>();
  const [newBill, setNewBill] = React.useState<boolean>(false);
  const [oldBill, setOldBill] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchCategory = async () => {
      const res = await axios.get('/api/dashboard/master-record/category');
      if (res.data.success === true) {
        setCategory(res.data.categories);
      } else {
        router.refresh();
        throw new Error(res.data.message);
      }
    };
    fetchCategory();
  }, [router]);

  React.useEffect(() => {
    // TODO: remove console
    // eslint-disable-next-line no-console
    console.log(bill);
  }, [bill]);

  React.useEffect(() => {
    if (newBill === true) {
      setOldBill(false);
    } else if (oldBill === true) {
      setNewBill(false);
    }
  }, [newBill, oldBill]);

  const createNewBill = () => {
    // Perform actions to create a new bill using billInfo state
    setNewBill(true);
    setBill({
      billNumber: 0,
      date: new Date(),
      dueDate: new Date(),
      urgent: false,
      trail: false,
      mobile: 0,
      name: '',
      email: '',
      totalAmount: 0,
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
        setOldBill(true);
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

  const handleRemoveLastOrder = () => {
    if (bill?.order) {
      setBill({ ...bill, order: bill.order.slice(0, -1) } as IBill);
    }
  };

  const handleRemoveOrder = (index: number) => () => {
    if (bill?.order) {
      setBill({ ...bill, order: bill.order.filter((_, i) => i !== index) } as IBill);
    }
  };

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
        {newBill && (
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
              <span className="btn btn-secondary btn-xs select-none font-extrabold" onClick={handleRemoveLastOrder}>
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
                                  const selectedCategoryName = e.target.value;
                                  const updatedOrder = bill.order.map((o, i) => {
                                    if (i === index) {
                                      return {
                                        ...o,
                                        category: {
                                          catId: selectedCategoryId ? selectedCategoryId : undefined,
                                          categoryName: selectedCategoryName,
                                        },
                                      };
                                    }
                                    return o;
                                  });
                                  setBill(
                                    (prevBill) =>
                                      ({
                                        ...prevBill,
                                        order: updatedOrder,
                                      }) as IBill,
                                  );
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
                        ;{/* TODO add logic to set the dimensions in bill */}
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
                                  <div className="flex flex-col flex-wrap gap-1">
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
                                                    dimensionTypeName:
                                                      e.target.value === 'none' ? null : typ.dimensionTypeName,
                                                    dimensionName: e.target.value === 'none' ? null : e.target.value,
                                                    note: '',
                                                  },
                                                }
                                              : o,
                                          ),
                                        } as IBill);
                                      }}
                                    >
                                      <option value="none">Select dimension</option>
                                      {typ.dimensionTypes &&
                                        typ.dimensionTypes.map((dim: any, dimIndex: any) => (
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
                                    />
                                  </div>
                                </div>
                              ));
                            }
                            return null;
                          })}
                        </div>
                        ; ; ;
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
                                onChange={(e) =>
                                  setBill({
                                    ...bill,
                                    order: bill.order?.map((o, i) =>
                                      i === index ? { ...o, amount: e.target.value ? parseInt(e.target.value) : 0 } : o,
                                    ),
                                  } as IBill)
                                }
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                      ;{/* TODO add logic to set styles in bill */}
                      <div className="flex flex-col items-center gap-1 rounded-box border-2 border-base-300 bg-base-200 p-2 max-sm:w-full max-sm:items-start">
                        {/* styles */}
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
                                                  styleProcessName:
                                                    e.target.value === 'none' ? null : styleProcess.styleProcessName,
                                                  styleName: e.target.value === 'none' ? null : e.target.value,
                                                },
                                              }
                                            : o,
                                        ),
                                      } as IBill);
                                    }}
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
                      ; ;
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
                        {bill?.order?.map((order, index) => (
                          <tr key={index}>
                            <th>{index + 1}</th>
                            <td>{order.amount}</td>
                            <td>0</td>
                            <td>0</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex flex-col gap-1 overflow-auto rounded-box border-4 border-base-300 bg-base-200 p-2">
                  <div className="flex flex-row items-center justify-between gap-1">
                    <label className="label label-text" htmlFor="total">
                      Total
                    </label>
                    <input
                      name="total"
                      placeholder="Total"
                      id="total"
                      type="number"
                      className="input input-bordered w-32 max-sm:input-sm"
                    />
                  </div>
                  <div className="flex flex-row items-center justify-between gap-1">
                    <label className="label label-text" htmlFor="discount">
                      Discount
                    </label>
                    <input
                      name="discount"
                      placeholder="Discount"
                      id="discount"
                      type="number"
                      className="input input-bordered w-32 max-sm:input-sm"
                    />
                  </div>
                  <div className="flex flex-row items-center justify-between gap-1">
                    <label className="label label-text" htmlFor="grandTotal">
                      Grand Total
                    </label>
                    <input
                      name="grandTotal"
                      placeholder="Grand Total"
                      id="grandTotal"
                      type="number"
                      className="input input-bordered w-32 max-sm:input-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </span>
        )}
        {/* old bill */}
        {oldBill && (
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
                    value={bill?.date?.toString()}
                    onChange={(e) =>
                      setBill({
                        ...bill,
                        date: new Date(e.target.value),
                      } as IBill)
                    }
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
                    value={bill?.dueDate?.toString()}
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
                +
              </span>
              <span className="btn btn-secondary btn-xs select-none font-extrabold" onClick={handleRemoveLastOrder}>
                -
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
                                onChange={(e) =>
                                  setBill((prevBill) => {
                                    if (!prevBill) return prevBill;
                                    return {
                                      ...prevBill,
                                      order: (prevBill.order || []).map((o, i) =>
                                        i === index
                                          ? {
                                              ...o,
                                              category: {
                                                catId: new Types.ObjectId(
                                                  e.target.selectedOptions[0]?.getAttribute('itemID') || '',
                                                ) as Types.ObjectId,
                                                categoryName: e.target.value,
                                              },
                                            }
                                          : o,
                                      ),
                                    } as IBill;
                                  })
                                }
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
                              className="btn btn-secondary btn-xs select-none font-extrabold max-sm:hidden"
                              onClick={handleRemoveOrder(index)}
                            >
                              -
                            </span>
                            <span
                              className="btn btn-secondary btn-xs hidden select-none font-extrabold max-sm:flex"
                              onClick={handleRemoveOrder(index)}
                            >
                              Remove
                            </span>
                          </div>
                        </div>
                        {/* 2nd row */}
                        <div className="flex flex-row justify-between gap-1 max-sm:flex-wrap">
                          {category
                            .filter((cat) => cat._id === order.category.catId)
                            .map((cat, catIndex) => (
                              <span key={catIndex}>
                                {cat.dimension?.map((typ: any, typIndex: any) => (
                                  <div
                                    key={typIndex}
                                    className="flex w-full flex-row flex-wrap items-center gap-1 max-sm:justify-between"
                                  >
                                    <label htmlFor="fn" className="label label-text">
                                      {typ.dimensionTypeName}
                                    </label>
                                    <div className="flex flex-col flex-wrap gap-1">
                                      <select name="fn" id="fn" className="select select-primary select-sm max-w-sm">
                                        <option value="none">soon</option>
                                        {typ.types &&
                                          typ.types.map((dim: any, dimIndex: any) => (
                                            <option key={dimIndex} value={dim.dimensionName}>
                                              {dim.dimensionName}
                                            </option>
                                          ))}
                                      </select>
                                      <input
                                        type="text"
                                        name="fnNote"
                                        placeholder="F/N Note"
                                        className="input input-primary input-sm"
                                        value={typ.note}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </span>
                            ))}
                        </div>
                        {/* 3rd row */}
                        <div className="flex flex-row justify-between">
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
                                value={order.amount}
                                onChange={(e) =>
                                  setBill({
                                    ...bill,
                                    order: bill.order?.map((o, i) =>
                                      i === index ? { ...o, amount: parseInt(e.target.value) } : o,
                                    ),
                                  } as IBill)
                                }
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* styles */}
                      <div className="flex flex-col items-center gap-1 rounded-box border-2 border-base-300 bg-base-200 p-2 max-sm:w-full max-sm:items-start">
                        <h2 className="label label-text p-0 text-center">Style</h2>

                        <div className="flex w-full flex-col flex-wrap justify-between max-sm:flex-row">
                          <label className="label label-text pb-0.5"></label>
                          <select className="select select-primary select-sm">
                            <option value="none">soon</option>
                          </select>
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
                          <th></th>
                          <th>Name</th>
                          <th>Job</th>
                          <th>Color</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* row 1 */}
                        <tr>
                          <th>1</th>
                          <td>Cy</td>
                          <td>Quality</td>
                          <td>Blue</td>
                        </tr>
                        {/* row 2 */}
                        <tr>
                          <th>2</th>
                          <td>Hart</td>
                          <td>Desktop</td>
                          <td>Purple</td>
                        </tr>
                        {/* row 3 */}
                        <tr>
                          <th>3</th>
                          <td>Brice</td>
                          <td>Tax</td>
                          <td>Red</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex flex-col gap-1 overflow-auto rounded-box border-4 border-base-300 bg-base-200 p-2">
                  <div className="flex flex-row items-center justify-between gap-1">
                    <label className="label label-text" htmlFor="total">
                      Total
                    </label>
                    <input
                      name="total"
                      placeholder="Total"
                      id="total"
                      type="number"
                      className="input input-bordered w-32 max-sm:input-sm"
                    />
                  </div>
                  <div className="flex flex-row items-center justify-between gap-1">
                    <label className="label label-text" htmlFor="discount">
                      Discount
                    </label>
                    <input
                      name="discount"
                      placeholder="Discount"
                      id="discount"
                      type="number"
                      className="input input-bordered w-32 max-sm:input-sm"
                    />
                  </div>
                  <div className="flex flex-row items-center justify-between gap-1">
                    <label className="label label-text" htmlFor="grandTotal">
                      Grand Total
                    </label>
                    <input
                      name="grandTotal"
                      placeholder="Grand Total"
                      id="grandTotal"
                      type="number"
                      className="input input-bordered w-32 max-sm:input-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </span>
        )}
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
