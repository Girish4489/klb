import { IBill } from '@/models/klm';
import React from 'react';

import QrGenerator from '@/app/components/Barcode/BarcodeGenerator';
import Image from 'next/image';
import { formatDS } from '../util/format/dateUtils';

interface CustomerBillPreviewProps {
  bill: IBill | undefined;
  isDataLoaded: boolean;
  klm: { src: string };
  style: string;
}

const CustomerBillPreview: React.FC<CustomerBillPreviewProps> = ({ bill, isDataLoaded, klm, style }) => {
  if (!isDataLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {bill && (
        <div className="mx-2 mb-0 flex h-full flex-col justify-between gap-2 bg-white">
          <style>{style}</style>
          <span className="flex shrink flex-col gap-2">
            <h4 className="billType">Customer Bill</h4>
            <div className="header-box">
              <div className="flex flex-row items-center justify-between gap-4">
                <div className="flex flex-row items-center gap-4">
                  <span className="profile flex h-24 w-24">
                    <Image src={klm.src} width={96} height={90} alt="Profile" className="m-auto w-24" priority />
                  </span>
                  <hr className="divider divider-horizontal m-0 w-0.5 rounded-box bg-black" />
                </div>
                <span className="flex grow flex-col items-center justify-center">
                  <h2 id="header" className="text-xl font-bold">
                    Kalamandir Ladies boutique
                  </h2>
                  <address className="text-lg">
                    1st Floor, Muddurandappa Complex Opp/BH Road, Gowribidanur - 561208
                  </address>
                </span>
                <hr className="divider-horizontal w-0.5 rounded bg-black" />
                <div className="item-center flex flex-col justify-between gap-1">
                  <span className="field text-base">
                    <h2>Phone:</h2>
                    <h3>98453 71322</h3>
                  </span>
                  <span className="field text-base">
                    <h2>Phone:</h2>
                    <h3>93532 71763</h3>
                  </span>
                  <span className="field text-base">
                    <h2>Email:</h2>
                    <h3>
                      <a href="mailto:kalamandir2106@gmail.com">kalamandir2106@gmail.com</a>
                    </h3>
                  </span>
                  <span className="field text-base">
                    <h2>GST No:</h2>
                    <h3></h3>
                  </span>
                </div>
              </div>
              <hr className="m-auto my-1 w-[98%] border-spacing-x-4 rounded-box border border-l-4 border-r-8 border-dashed border-zinc-500" />
              <div className="flex flex-row justify-between">
                <div className="customer-details grow">
                  <span className="field">
                    <h2>Bill No:</h2>
                    <h3>{bill?.billNumber}</h3>
                  </span>
                  <span className="flex gap-4 text-sm font-extrabold">
                    <h2>Bill Date:</h2>
                    <h3>{bill?.date ? formatDS(bill?.date) : ''}</h3>
                  </span>
                  <span className="field">
                    <h2>Name:</h2>
                    <h3>{bill?.name}</h3>
                  </span>
                  <span className="flex gap-4 text-sm font-extrabold">
                    <h2>Due Date:</h2>
                    <h3>{bill?.dueDate ? formatDS(bill?.dueDate) : ''}</h3>
                  </span>
                  <span className="field">
                    <h2>Mobile:</h2>
                    <h3>{bill?.mobile}</h3>
                  </span>
                  <span className="field">
                    <h2>Email:</h2>
                    <h3>{bill?.email}</h3>
                  </span>
                  <span className="field address">
                    <h2>Address:</h2>
                    <h3></h3>
                  </span>
                </div>
                <hr className="divider-horizontal w-0.5 rounded bg-black" />
                <div className="header-col flex flex-col justify-start text-center">
                  <h2 id="text-center">QR Code</h2>
                  {bill.billNumber && bill.billNumber.toString().length > 0 && (
                    <QrGenerator content={`billNumber=${bill?.billNumber.toString()}` || ''} size={90} />
                  )}
                </div>
              </div>
            </div>
            <hr className="m-auto my-1.5 w-[95%] rounded-box border-2 border-black" />
            {/* <span className="py-1" /> */}
            <span>
              {bill?.order.map((order, orderIndex) => (
                <span className="orders flex flex-col gap-4" key={orderIndex}>
                  <div className="table m-auto flex w-[96%] break-inside-avoid break-after-auto flex-col gap-1 rounded border border-black p-1 text-center">
                    <span className="flex flex-row items-center justify-between gap-8">
                      <span className="flex flex-row items-center gap-8">
                        <h1>{orderIndex + 1}.</h1>
                        <span className="flex flex-row items-center gap-4">
                          {/* <h1>Category:</h1> */}
                          <p>{order.category?.categoryName}</p>
                        </span>
                      </span>
                      <span className="flex flex-row items-center justify-center gap-8">
                        <h1>Work:</h1>
                        <p>{order.work ? 'Yes' : 'No'}</p>
                      </span>
                      <span className="flex flex-row items-center justify-center gap-8">
                        <h1>Qr Code:</h1>
                        <p>{order.barcode ? 'Yes' : 'No'}</p>
                      </span>
                      <span className="flex flex-row items-center justify-center gap-1">
                        <h1>Color:</h1>
                        <p>
                          {order.color?.name
                            ? order.color.name
                                .split(/(?=[A-Z])/)
                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')
                            : 'NA'}
                        </p>
                        {/* <b>|</b>
                        <p>{order.color?.hex ? order.color.hex : 'NA'}</p> */}
                      </span>
                      <span className="flex flex-row items-center justify-center gap-8">
                        <h1>Amount:</h1>
                        <h2>{order.amount}</h2>
                      </span>
                    </span>
                    <hr style={{ margin: 0, padding: 0 }} />
                    <span className="flex w-full flex-col items-center gap-1">
                      {/* <h1>Styles:</h1> */}
                      <span className="flex w-full items-center gap-8">
                        {order.styleProcess.map((style, styleIndex) => (
                          <span
                            key={styleIndex}
                            // className="item-center process-box grow-1 flex flex-col justify-start"
                            className="item-center flex w-fit flex-col justify-start rounded-box border border-black px-2 py-1 font-normal"
                          >
                            <span className="flex w-fit flex-row items-center justify-around gap-8">
                              <h1>
                                {styleIndex + 1}). {style.styleProcessName}:{' '}
                              </h1>
                              <hr />
                              <p>{style.styleName}</p>
                            </span>
                          </span>
                        ))}
                      </span>
                      {order.styleProcess.length > 0 && <hr className={`w-full`} />}
                    </span>
                    <span className="flex w-full flex-row items-center gap-8">
                      <span className="flex items-center gap-2">
                        <h1>Note:</h1>
                        {order.orderNotes && <p className="process-box">{(order.orderNotes ?? '').split('\n')}</p>}
                      </span>
                      <span className="flex grow items-center gap-2">
                        <h1>Measurement:</h1>
                        {order.measurement && (
                          <p className="process-box">
                            {(order.measurement ?? '').split('\n').map((line, index) => (
                              <React.Fragment key={index}>
                                {line}
                                <br />
                              </React.Fragment>
                            ))}
                          </p>
                        )}
                      </span>
                    </span>
                    <span className="flex w-full flex-col items-center gap-1">
                      {/* <h1>Dimensions:</h1> */}
                      {order.styleProcess.length > 0 && <hr className={`w-full`} />}
                      <span className="flex w-full items-start gap-8">
                        {order.dimension.map((dimension, dimensionIndex) => (
                          <span
                            key={dimensionIndex}
                            // className="item-center process-box grow-1 flex flex-col justify-start"
                            className="item-center flex w-fit flex-col items-center justify-start rounded-box border border-black px-2 py-1"
                          >
                            <span className="flex flex-row items-center justify-around gap-8">
                              <h1>
                                {dimensionIndex + 1}). {dimension.dimensionTypeName}:{' '}
                              </h1>
                              <hr />
                              <p>{dimension.dimensionName}</p>
                            </span>
                            <hr className="m-0 w-full border bg-black p-0" />
                            <span className="flex flex-row items-center justify-center gap-8">
                              <p>{dimension.note}</p>
                            </span>
                          </span>
                        ))}
                      </span>
                    </span>
                  </div>
                  <span className="py-[1]" />
                </span>
              ))}
            </span>
          </span>
          <span className={`fixed bottom-0 m-auto flex w-full shrink flex-col gap-2 bg-white text-center`}>
            <div className="m-auto w-[95%]">
              <hr className="m-auto my-1 rounded-box border-2 border-black" />
              <span className="flex gap-4">
                <div className="header-col process-box flex flex-col justify-start text-center">
                  {bill.billNumber && bill.billNumber.toString().length > 0 && (
                    <QrGenerator content={`billNumber=${bill?.billNumber.toString()}` || ''} size={60} />
                  )}
                </div>
                <div className="process-box my-auto flex h-full w-full grow flex-row items-stretch justify-between gap-4 px-4">
                  <span className="h-full grow">
                    <span className="field">
                      <h2 className="text-nowrap">Sub Total:</h2>
                      <h3>{bill?.totalAmount}</h3>
                    </span>
                    <span className="field">
                      <h2>Discount:</h2>
                      <h3>{bill?.discount}</h3>
                    </span>
                    <span className="field">
                      <h2>Tax:</h2>
                      <h3>000</h3>
                    </span>
                  </span>

                  <span className="field grow justify-center">
                    <h2>Grand:</h2>
                    <h3>{bill?.grandTotal}</h3>
                  </span>
                  <span className="flex grow flex-row items-center justify-around gap-4 ">
                    <span className="flex flex-row items-center gap-2">
                      <h1>Bill By:</h1>
                      <h2 className="pl-2">{bill?.billBy?.name}</h2>
                    </span>
                    <h2>Signature</h2>
                  </span>
                </div>
              </span>
            </div>
          </span>
        </div>
      )}
    </>
  );
};
export default CustomerBillPreview;
