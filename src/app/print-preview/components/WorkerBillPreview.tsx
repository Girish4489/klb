'use client';

import { IBill } from '@models/klm';
import React from 'react';

import QrGenerator from '@components/Barcode/BarcodeGenerator';
import { ICompany } from '@models/companyModel';
import { formatDS, formatDSNT } from '@utils/format/dateUtils';
import Image from 'next/image';

interface WorkerBillPreviewProps {
  bill: IBill | undefined;
  company: ICompany | undefined;
  isDataLoaded: boolean;
  klm: { src: string };
  style: string;
  type: string;
}

const WorkerBillPreview: React.FC<WorkerBillPreviewProps> = ({ bill, company, isDataLoaded, klm, style, type }) => {
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
                    <Image
                      src={company?.logos?.small || klm.src}
                      width={96}
                      height={90}
                      alt="Company Profile"
                      className="m-auto w-24"
                      priority
                    />
                  </span>
                  <hr className="divider divider-horizontal rounded-box m-0 w-0.5 bg-black" />
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
                    <h3>
                      {bill?.dueDate
                        ? formatDS(new Date(new Date(bill.dueDate).setDate(new Date(bill.dueDate).getDate() - 2)))
                        : ''}
                    </h3>
                  </span>
                  <hr className="divider divider-horizontal rounded-box m-0 w-0.5 bg-black" />
                </div>
                <div className="header-col flex flex-col justify-start text-center">
                  <h2 id="text-center">Barcode</h2>
                  {bill.billNumber && bill.billNumber.toString().length > 0 && (
                    <QrGenerator
                      content={
                        bill?.billNumber
                          ? `${company?.name ? `Company Name=${company.name}\n` : ''}${
                              company?.contactDetails.address ? `Address=${company.contactDetails.address}\n` : ''
                            }billNumber=${bill.billNumber.toString()}`
                          : ''
                      }
                      size={90}
                    />
                  )}
                </div>
              </div>
            </div>
            <hr className="rounded-box m-auto my-1.5 w-[95%] border-2 border-black" />
            {/* <span className="py-1" /> */}
            <span>
              {bill?.order.map((order, orderIndex) => (
                <span className="orders flex flex-col" key={orderIndex}>
                  <div className="m-auto flex table w-[96%] break-inside-avoid break-after-auto flex-col gap-0.5 rounded-sm border border-black p-1 text-center">
                    <span className="flex flex-row items-center justify-between gap-8">
                      <span className="flex flex-row items-center gap-8">
                        <h1>{orderIndex + 1}.</h1>
                        <span className="flex flex-row items-center gap-4 text-base">
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
                    <hr className="rounded-box m-auto my-0.5 w-[100%] border border-dashed border-black" />
                    {order.styleProcess.length > 0 && (
                      <span className="flex w-full flex-col items-center gap-1">
                        {/* <h1>Styles:</h1> */}
                        <span className="flex w-full items-center gap-8 text-base">
                          {order.styleProcess.map((style, styleIndex) => (
                            <span
                              key={styleIndex}
                              // className="item-center process-box grow-1 flex flex-col justify-start"
                              className="item-center font-base rounded-box flex w-fit flex-col justify-start border border-black px-2 py-0.5"
                            >
                              <span className="flex w-fit flex-row items-center justify-around gap-8">
                                <h1>
                                  {styleIndex + 1}. {style.styleProcessName}:{' '}
                                </h1>
                                <hr />
                                <p>{style.styleName}</p>
                              </span>
                            </span>
                          ))}
                        </span>
                        {order.styleProcess.length > 0 && (
                          <hr className="rounded-box m-auto my-0.5 w-[100%] border border-black" />
                        )}
                      </span>
                    )}
                    <span className="flex w-full flex-row items-center gap-8">
                      {order.orderNotes && (
                        <span className="flex items-center gap-2">
                          <h1>Notes:</h1>
                          <p className="rounded-box text-pretty border border-black px-2 py-0.5 text-base font-extrabold">
                            {(order.orderNotes ?? '').split('\n')}
                          </p>
                        </span>
                      )}
                      {order.measurement && (
                        <span className="flex grow items-center gap-2">
                          <h1>Measurement:</h1>
                          <p className="rounded-box text-pretty border border-black px-2 py-0.5 text-base font-extrabold">
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
                    {order.dimension.length > 0 && (
                      <span className="flex w-full flex-col items-center gap-1">
                        {/* <h1>Dimensions:</h1> */}
                        {order.dimension.length > 0 && (
                          <hr className="rounded-box m-auto my-0.5 w-[100%] border border-black" />
                        )}
                        <span className="flex w-full items-start gap-8">
                          {order.dimension.map((dimension, dimensionIndex) => (
                            <span
                              key={dimensionIndex}
                              className="item-center rounded-box flex w-fit flex-col items-center justify-start border border-black"
                            >
                              <span className="flex flex-row items-center justify-around gap-0.5 text-base">
                                <h1 className="px-1 py-0.5 text-base">
                                  {dimensionIndex + 1}. {dimension.dimensionTypeName}:{' '}
                                </h1>
                                <p className="content-center px-2 text-center">{dimension.dimensionName}</p>
                              </span>
                              <hr className="m-auto h-0.5 w-full border border-solid border-black" />
                              <span className="flex flex-row items-center justify-center gap-8 text-base">
                                <p>{dimension.note}</p>
                              </span>
                            </span>
                          ))}
                        </span>
                      </span>
                    )}
                  </div>
                  {orderIndex < bill.order.length - 1 && (
                    <hr className="rounded-box m-auto my-1.5 w-[95%] border-2 border-black" />
                  )}
                </span>
              ))}
            </span>
          </span>
          <span
            className={`fixed bottom-0 m-auto w-full grow gap-2 bg-white text-center ${type === 'Both' ? 'hidden' : ''}`}
          >
            <hr className="rounded-box m-auto my-1 w-[96%] border-2 border-black" />
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
                  <h3 className="my-2">
                    {bill?.dueDate
                      ? formatDS(new Date(new Date(bill.dueDate).setDate(new Date(bill.dueDate).getDate() - 2)))
                      : ''}
                  </h3>
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
