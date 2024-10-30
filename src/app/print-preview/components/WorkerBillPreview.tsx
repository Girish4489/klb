'use client';

import { IBill } from '@/models/klm';
import React from 'react';

import QrGenerator from '@/app/components/Barcode/BarcodeGenerator';
import { formatDS, formatDSNT } from '@/app/util/format/dateUtils';
import Image from 'next/image';

interface WorkerBillPreviewProps {
  bill: IBill | undefined;
  isDataLoaded: boolean;
  klm: { src: string };
  style: string;
  type: string;
}

const WorkerBillPreview: React.FC<WorkerBillPreviewProps> = ({ bill, isDataLoaded, klm, style, type }) => {
  if (!isDataLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <span className="preview bg-white">
      {bill && (
        <div className="mx-2 mb-0 flex h-full flex-col justify-between gap-2">
          <style>{style}</style>
          <span className="flex shrink flex-col gap-2">
            <h4 className="billType">Worker Bill</h4>
            <div className="header-box">
              <div className="flex flex-row items-center justify-between gap-4">
                <div className="flex flex-row items-center gap-4">
                  <span className="profile flex h-24 w-24">
                    <Image src={klm.src} width={96} height={90} alt="Profile" className="m-auto w-24" priority />
                  </span>
                  <hr className="divider divider-horizontal m-0 w-0.5 rounded-box bg-black" />
                </div>
                <div className="item-center flex grow flex-col justify-between">
                  <span className="field">
                    <h2>Bill No:</h2>
                    <h3>{bill?.billNumber}</h3>
                  </span>
                  <span className="field">
                    <h2>Bill By:</h2>
                    <h3>{bill?.billBy?.name}</h3>
                  </span>
                  <span className="flex gap-4 text-sm font-extrabold">
                    <h2>Due Date:</h2>
                    <h3>{bill?.dueDate ? formatDS(bill?.dueDate) : ''}</h3>
                  </span>
                  <hr className="divider divider-horizontal m-0 w-0.5 rounded-box bg-black" />
                </div>
                <div className="header-col flex flex-col justify-start text-center">
                  <h2 id="text-center">Barcode</h2>
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
                    </span>
                    <hr style={{ margin: 0, padding: 0 }} />
                    {order.styleProcess.length > 0 && (
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
                    )}
                    {order.orderNotes ||
                      (order.measurement && (
                        <span className="flex w-full flex-row items-center gap-8">
                          {order.orderNotes && (
                            <span className="flex items-center gap-2">
                              <h1>Note:</h1>
                              <p className="process-box">{(order.orderNotes ?? '').split('\n')}</p>
                            </span>
                          )}
                          {order.measurement && (
                            <span className="flex grow items-center gap-2">
                              <h1>Measurement:</h1>
                              <p className="process-box">
                                {(order.measurement ?? '').split('\n').map((line, index) => (
                                  <React.Fragment key={index}>
                                    {line}
                                    <br />
                                  </React.Fragment>
                                ))}
                              </p>
                            </span>
                          )}
                        </span>
                      ))}
                    {order.dimension.length > 0 && (
                      <span className="flex w-full flex-col items-center gap-1">
                        {/* <h1>Dimensions:</h1> */}
                        {order.dimension.length > 0 && <hr className={`w-full`} />}
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
                    )}
                  </div>
                  <span className="py-[1]" />
                </span>
              ))}
            </span>
          </span>
          <span
            className={`fixed bottom-0 m-auto w-full grow gap-2 bg-white text-center ${type === 'Both' ? 'hidden' : ''}`}
          >
            <hr className="m-auto my-1 w-[96%] rounded-box border-2 border-black" />
            <span className="padding-4 border-1 rounded-20 m-auto flex w-[96%] flex-row items-center justify-between gap-4 border-solid bg-white">
              <span className="field">
                <h2>Bill By:</h2>
                <h3>{bill?.billBy?.name}</h3>
              </span>
              <span className="flex flex-col items-center justify-start">
                <span className="flex flex-row items-center gap-4">
                  <h2 className="my-2">Date:</h2>
                  <h3 className="my-2">{bill?.date ? formatDSNT(bill?.date) : ''}</h3>
                </span>
                <span className="flex flex-row items-center gap-4">
                  <h2 className="my-2">Due Date:</h2>
                  <h3 className="my-2">{bill?.dueDate ? formatDSNT(bill?.dueDate) : ''}</h3>
                </span>
              </span>
              <span className="field">
                <h2>Customer Sign</h2>
              </span>
            </span>
          </span>
        </div>
      )}
    </span>
  );
};

export default WorkerBillPreview;
