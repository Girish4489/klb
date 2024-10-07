import { IBill } from '@/models/klm';
import React from 'react';

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
              <div className="flex flex-row items-center justify-between">
                <div className="item-center flex flex-row gap-4">
                  <span className="profile">
                    <Image src={klm.src} width={80} height={80} alt="Profile" />
                  </span>
                  <hr className="divider-horizontal w-0.5 rounded bg-black" />
                  <span className="flex flex-col items-center justify-center">
                    <h2 id="header">Kalamandir Ladies boutique</h2>
                    <address>1st Floor, Muddurandappa Complex Opp/BH Road, Gowribidanur - 561208</address>
                  </span>
                </div>
                <hr className="divider-horizontal w-0.5 rounded bg-black" />
                <div className="item-center flex flex-col justify-between">
                  <span className="field">
                    <h2>Phone:</h2>
                    <h3>9845371322</h3>
                  </span>
                  <span className="field">
                    <h2>Email:</h2>
                    <h3>kalamandir2106@gmail.com</h3>
                  </span>
                  <span className="field">
                    <h2>GST No:</h2>
                    <h3></h3>
                  </span>
                </div>
              </div>
              <hr className="divider-vertical my-1 h-0.5 rounded bg-black" />
              <div className="flex flex-row justify-between">
                <div className="customer-details grow">
                  <span className="field">
                    <h2>Bill No:</h2>
                    <h3>{bill?.billNumber}</h3>
                  </span>
                  <span className="field">
                    <h2>Bill Date:</h2>
                    <h3>{bill?.date ? formatDS(bill?.date) : ''}</h3>
                  </span>
                  <span className="field">
                    <h2>Name:</h2>
                    <h3>{bill?.name}</h3>
                  </span>
                  <span className="field">
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
                <div className="header-col w-50per flex flex-col justify-start text-center">
                  <h2 id="text-center">Barcode</h2>
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
                    <span className="flex flex-row items-center justify-center gap-8">
                      <h1>Amount:</h1>
                      <h2>{order.amount}</h2>
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
          <span className="fixed bottom-0 m-auto w-full grow gap-2 bg-white text-center">
            <hr className="m-auto w-[95%] border border-solid" />
            <span className="m-auto flex flex-row items-stretch justify-between gap-2" style={{ width: '95%' }}>
              <span className="process-box">
                <span className="field">
                  <h2>Total:</h2>
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
              <span className="process-box grow-1">
                <div className="header-col flex flex-col justify-start text-center">
                  <h2 id="text-center">Barcode</h2>
                </div>
              </span>
              <span className="process-box flex">
                <span className="field">
                  <h2>Grand:</h2>
                  <h3>{bill?.grandTotal}</h3>
                </span>
              </span>
            </span>
            <span className="m-auto flex w-[95%] flex-row items-center justify-between">
              <span className="flex w-full grow flex-row items-center gap-2">
                <h1>Bill By:</h1>
                <h2 className="pl-2">{bill?.billBy?.name}</h2>
              </span>
              <h2>Signature</h2>
            </span>
          </span>
        </div>
      )}
    </>
  );
};
export default CustomerBillPreview;
