import { IReceipt } from '@/models/klm';
import React from 'react';

import Image from 'next/image';
import { formatDSNT } from '../util/format/dateUtils';

interface ReceiptPreviewProps {
  receipt: IReceipt | undefined;
  cal: {
    totalAmount: number;
    discount: number;
    grandTotal: number;
    paidAmount: number;
    dueAmount: number;
  };
  isDataLoaded: boolean;
  klm: { src: string };
  style: string;
}

const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ receipt, cal, isDataLoaded, klm, style }) => {
  if (!isDataLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <span>
      {receipt && (
        <>
          <div className="receipt m-1">
            <style>{style}</style>
            <h2 className="m-px">Receipt</h2>
            <div className="flex flex-col items-center gap-2">
              <div className="card card-side shadow-sm">
                <figure>
                  <Image src={klm.src} width={180} height={180} alt="Profile" />
                </figure>
                <div className="card-body bg-transparent p-2 text-slate-500">
                  <h2 id="header">Kalamandir Ladies boutique</h2>
                  <address>1st Floor, Muddurandappa Complex Opp/BH Road, Gowribidanur - 561208</address>
                </div>
              </div>

              <hr className="w-[90%] border" style={{ width: '90%', borderWidth: '1px' }} />
              <div className="item-center flex w-full flex-col justify-between">
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
              <hr className="w-[90%] border" style={{ width: '90%', borderWidth: '1px' }} />
            </div>
            <table className="w-full border-collapse text-slate-600">
              <tbody>
                <tr>
                  <th>Bill No:</th>
                  <td>{receipt?.bill?.billNumber ?? ''}</td>
                </tr>
                <tr>
                  <th>Receipt No:</th>
                  <td>{receipt?.receiptNumber ?? ''}</td>
                </tr>
                <tr>
                  <th>Receipt Date:</th>
                  <td>{receipt?.paymentDate ? formatDSNT(receipt?.paymentDate) : ''}</td>
                </tr>
                <tr>
                  <th>Customer Name:</th>
                  <td>{receipt?.bill?.name ?? ''}</td>
                </tr>
                <tr>
                  <th>Mobile:</th>
                  <td>{receipt?.bill?.mobile ?? ''}</td>
                </tr>
                <tr>
                  <th>Pay Method:</th>
                  <td>{receipt?.paymentMethod ?? ''}</td>
                </tr>
              </tbody>
            </table>
            <hr />
            <table className="w-full border-collapse border-black text-slate-600">
              <thead>
                <tr>
                  <th>SI No</th>
                  <th>Bill No</th>
                  <th>Paid</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>{receipt?.bill?.billNumber ?? ''}</td>
                  <td>{receipt?.amount ?? ''}</td>
                </tr>
              </tbody>
            </table>
            <hr />
            <table className="w-full border-collapse text-slate-600">
              <tbody>
                <tr className="flex w-full flex-row items-center justify-between">
                  <th>Total Amount:</th>
                  <td>{cal.totalAmount}</td>
                </tr>
                <tr className="flex w-full flex-row items-center justify-between">
                  <th>Discount:</th>
                  <td>{cal.discount}</td>
                </tr>
                <tr className="flex w-full flex-row items-center justify-between">
                  <th>Grand Net:</th>
                  <td>{cal.grandTotal}</td>
                </tr>
                <tr className="flex w-full flex-row items-center justify-between">
                  <th>Amount Paid:</th>
                  <td>{cal.paidAmount}</td>
                </tr>
                <tr className="flex w-full flex-row items-center justify-between">
                  <th>Balance:</th>
                  <td>{cal.dueAmount}</td>
                </tr>
              </tbody>
            </table>
            <hr />
            <span className="flex flex-col gap-2 text-slate-800">
              <span>Thank You</span>
              {cal.discount > 0 ? <span>{`Hurray You saved ${cal.discount}₹ !`}</span> : ''}
              <span>Visit Again</span>
            </span>
          </div>
        </>
      )}
    </span>
  );
};

export default ReceiptPreview;
