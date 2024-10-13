'use client';

import { IBill } from '@/models/klm';
import React from 'react';

import Image from 'next/image';
import { formatDS, formatDSNT } from '../util/format/dateUtils';

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
              <div className="flex flex-row items-center justify-between">
                <div className="item-center flex grow flex-row gap-4">
                  <span className="profile w-24">
                    <Image src={klm.src} width={90} height={80} alt="Profile" className="w-24" priority />
                  </span>
                  <hr className="divider-horizontal w-0.5 rounded bg-black" />
                  <div className="header-col flex grow flex-col justify-start text-center">
                    <h2 id="text-center">Barcode</h2>
                  </div>
                </div>
                <hr className="divider-horizontal w-0.5 rounded bg-black" />
                <div className="item-center flex flex-col justify-between">
                  <span className="field">
                    <h2>Bill No:</h2>
                    <h3>{bill?.billNumber}</h3>
                  </span>
                  <span className="field">
                    <h2>Bill By:</h2>
                    <h3>{bill?.billBy?.name}</h3>
                  </span>
                  <span className="field">
                    <h2>Due Date:</h2>
                    <h3>{bill?.dueDate ? formatDS(bill?.dueDate) : ''}</h3>
                  </span>
                </div>
              </div>
            </div>
            <span className="orders flex flex-col gap-px">
              {bill?.order.map((order, orderIndex) => (
                <div
                  key={orderIndex}
                  className="table m-auto flex w-[96%] break-inside-avoid break-after-auto flex-col gap-1 rounded border border-black p-1 text-center"
                >
                  <span className="flex flex-row items-center justify-between gap-8">
                    <span className="flex flex-row items-center gap-8">
                      <h1>{orderIndex + 1}.</h1>
                      <span className="flex flex-row items-center gap-4">
                        <h1>Category:</h1>
                        <h2>{order.category?.categoryName}</h2>
                      </span>
                    </span>
                    <span className="flex flex-row items-center justify-center gap-8">
                      <h1>Work:</h1>
                      <h2>{order.work ? 'Yes' : 'No'}</h2>
                    </span>
                    <span className="flex flex-row items-center justify-center gap-8">
                      <h1>Qr Code:</h1>
                      <h2>{order.barcode ? 'Yes' : 'No'}</h2>
                    </span>
                    <span className="flex flex-row items-center justify-center gap-1">
                      <h1>Color:</h1>
                      <h2>
                        {`${
                          order.color?.name &&
                          order.color.name
                            .split(/(?=[A-Z])/)
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')
                        } | ${order.color?.hex && order.color.hex}`}{' '}
                      </h2>
                    </span>
                  </span>
                  <hr style={{ margin: 0, padding: 0 }} />
                  <span className="flex flex-row items-center gap-8">
                    <h1>Styles:</h1>
                    {order.styleProcess.map((style, styleIndex) => (
                      <span key={styleIndex} className="item-center process-box grow-1 flex flex-col justify-start">
                        <span className="flex flex-row items-center justify-around gap-8">
                          <h1>
                            {styleIndex + 1}). {style.styleProcessName}
                          </h1>
                          <hr />
                          <h2>{style.styleName}</h2>
                        </span>
                      </span>
                    ))}
                  </span>
                  <hr style={{ margin: 0, padding: 0 }} />
                  <span className="flex flex-row items-center gap-8">
                    <h1>Measurement:</h1>
                    <h2>{order.measurement}</h2>
                  </span>
                  <hr style={{ margin: 0, padding: 0 }} />
                  <span className="flex flex-row items-center gap-8">
                    <h1>Dimensions:</h1>
                    {order.dimension.map((dimension, dimensionIndex) => (
                      <span key={dimensionIndex} className="item-center process-box grow-1 flex flex-col justify-start">
                        <span className="flex flex-row items-center justify-around gap-8">
                          <h1>
                            {dimensionIndex + 1}). {dimension.dimensionTypeName}
                          </h1>
                          <hr />
                          <h2>{dimension.dimensionName}</h2>
                        </span>
                        <hr style={{ width: '100%', margin: 0, padding: 0 }} />
                        <span className="flex flex-row items-center justify-center gap-8">
                          <h1>{dimension.note}</h1>
                        </span>
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </span>
          </span>
          <span
            className={`fixed bottom-0 m-auto w-full grow gap-2 bg-white text-center ${type === 'Both' ? 'hidden' : ''}`}
          >
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
