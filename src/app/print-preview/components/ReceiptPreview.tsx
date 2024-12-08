import { IReceipt } from '@models/klm';
import React from 'react';

import QrGenerator from '@components/Barcode/BarcodeGenerator';
import { EnvelopeIcon, FaceSmileIcon, PhoneIcon, WalletIcon } from '@heroicons/react/24/solid';
import { ICompany } from '@models/companyModel';
import { formatDS } from '@util/format/dateUtils';
import Image from 'next/image';

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
  company: ICompany | undefined;
  style: string;
}

const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ receipt, cal, isDataLoaded, klm, company, style }) => {
  if (!isDataLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <span>
      {receipt && (
        <>
          <div className="m-1 mx-auto my-[50px] w-[300px] border border-solid border-gray-400 p-2 text-center">
            <style>{style}</style>
            <h2 className="m-px">Receipt</h2>
            <div className="flex flex-col items-center gap-2">
              <div className="card card-side flex-col border border-dashed border-black/50 shadow-md">
                <h2 id="header" className="card-title mx-auto grow text-lg">
                  {company?.name ?? 'Kalamandir Ladies Boutique'}
                </h2>
                <div className="card-body grow flex-row gap-0.5 bg-transparent p-1 pb-2 text-slate-500">
                  <figure className="w-[30%]">
                    <Image src={klm.src} width={180} height={180} alt="Profile" />
                  </figure>
                  <address className="w-[70%] content-center text-sm font-medium">
                    {company?.contactDetails?.address ??
                      '1st Floor, Muddurandappa Complex Opp/BH Road, Gowribidanur - 561208'}
                  </address>
                </div>
              </div>
              <hr className="my-1 w-[90%] border border-dashed border-black/60" />
              <div className="item-center flex w-full flex-col justify-between px-2 text-black">
                {company?.contactDetails?.phones?.length ? (
                  company.contactDetails.phones.map((phone, index) => (
                    <span key={index} className="flex justify-between text-black">
                      <span className="flex items-center gap-1">
                        <PhoneIcon className="h-auto w-2 text-gray-800" />
                        <h2 className="text-gray-800">Phone:</h2>
                      </span>
                      <h3 className="text-gray-800">{phone.replace(/(\d{5})(\d{5})/, '$1 $2')}</h3>
                    </span>
                  ))
                ) : (
                  <>
                    <span className="flex justify-between text-black">
                      <span className="flex items-center gap-1">
                        <PhoneIcon className="h-auto w-2 text-gray-800" />
                        <h2 className="text-gray-800">Phone:</h2>
                      </span>
                      <h3 className="text-gray-800">98453 71322</h3>
                    </span>
                    <span className="flex justify-between">
                      <span className="flex items-center gap-1">
                        <PhoneIcon className="h-auto w-2 text-gray-800" />
                        <h2 className="text-gray-800">Phone:</h2>
                      </span>
                      <h3 className="text-gray-800">93532 71763</h3>
                    </span>
                  </>
                )}
                {company?.contactDetails?.emails?.length ? (
                  company.contactDetails.emails.map((email, index) => (
                    <span key={index} className="flex justify-between">
                      <span className="flex items-center gap-1">
                        <EnvelopeIcon className="h-auto w-2 text-gray-800" />
                        <h2 className="text-gray-800">Email:</h2>
                      </span>
                      <h3 className="text-gray-800">
                        <a href={`mailto:${email}`}>{email}</a>
                      </h3>
                    </span>
                  ))
                ) : (
                  <span className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <EnvelopeIcon className="h-auto w-2 text-gray-800" />
                      <h2 className="text-gray-800">Email:</h2>
                    </span>
                    <h3 className="text-gray-800">kalamandir2106@gmail.com</h3>
                  </span>
                )}

                <span className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <WalletIcon className="h-auto w-2 text-gray-800" />
                    <h2 className="text-gray-800">GST No:</h2>
                  </span>
                  <h3 className="text-gray-800">{company?.gstNumber ?? ''}</h3>
                </span>
              </div>
              <hr className="my-1 w-[90%] border border-dashed border-black/60" />
            </div>
            <table className="w-full rounded-box text-slate-600">
              <tbody className="rounded-box p-1">
                <tr className="bg-gray-200 text-left">
                  <th className="p-1 text-left">Bill No:</th>
                  <td className="p-1">{receipt?.bill?.billNumber ?? ''}</td>
                </tr>
                <tr className="text-left">
                  <th className="p-1 text-left">Receipt No:</th>
                  <td className="p-1">{receipt?.receiptNumber ?? ''}</td>
                </tr>
                <tr className="bg-gray-200 text-left">
                  <th className="p-1 text-left">Receipt Date:</th>
                  <td className="p-1">{receipt?.paymentDate ? formatDS(receipt?.paymentDate) : ''}</td>
                </tr>
                <tr className="text-left">
                  <th className="p-1 text-left">Customer Name:</th>
                  <td className="p-1">{receipt?.bill?.name ?? ''}</td>
                </tr>
                <tr className="bg-gray-200 text-left">
                  <th className="p-1 text-left">Mobile:</th>
                  <td className="p-1">{receipt?.bill?.mobile ?? ''}</td>
                </tr>
                <tr className="text-left">
                  <th className="p-1 text-left">Pay Method:</th>
                  <td className="p-1">{receipt?.paymentMethod ?? ''}</td>
                </tr>
                <tr className="bg-gray-200 text-left">
                  <th className="p-1 text-left">Receipt By:</th>
                  <td className="p-1">{receipt?.receiptBy?.name ?? ''}</td>
                </tr>
              </tbody>
            </table>
            <hr className="mx-auto my-1 w-[90%] border border-dashed border-black/60" />
            <table className="w-full border-collapse border-black text-slate-600">
              <thead>
                <tr className="rounded-box bg-gray-200 p-1 text-gray-700">
                  <th>SI No</th>
                  <th>Paid</th>
                  {receipt.discount > 0 && <th>Discount</th>}
                  {receipt.tax?.length > 0 && <th>Tax</th>}
                </tr>
              </thead>
              <tbody className="rounded-box p-1">
                <tr>
                  <td>1</td>
                  <td>{receipt?.amount ?? ''}</td>
                  {receipt?.discount > 0 && <td>{receipt?.discount ?? ''}</td>}
                  {receipt?.tax?.length > 0 && (
                    <td>
                      {receipt?.tax?.map((tax, index) => (
                        <div key={index}>
                          {tax.taxName}: {tax.taxPercentage}%
                        </div>
                      )) ?? ''}
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
            <hr className="mx-auto my-1 w-[90%] border border-dashed border-black/60" />
            <table className="w-full text-slate-600">
              <tbody className="flex flex-col gap-[1px] p-1">
                {/* Sub Total: Amount before discount */}
                <tr className="flex w-full flex-row items-center justify-between bg-gray-200 text-xs font-semibold">
                  <th className="p-1">Sub Total:</th>
                  <td className="p-1">{cal.totalAmount}</td>
                </tr>
                {/* Discount: Shown if applied */}
                {cal.discount > 0 && (
                  <tr className="flex w-full flex-row items-center justify-between bg-gray-200 text-xs font-semibold">
                    <th className="p-1">Discount:</th>
                    <td className="p-1">-{cal.discount}</td>
                  </tr>
                )}
                {/* Net Total: Amount after discount */}
                <tr className="flex w-full flex-row items-center justify-between bg-gray-200 text-xs font-semibold">
                  <th className="p-1">Net Total:</th>
                  <td className="p-1">{cal.grandTotal}</td>
                </tr>
                {/* Advance Payment: Paid previously in advance */}
                {cal.paidAmount - receipt.amount > 0 && (
                  <tr className="flex w-full flex-row items-center justify-between">
                    <th className="p-1">Advance Payment:</th>
                    <td className="p-1">{cal.paidAmount - receipt.amount}</td>
                  </tr>
                )}
                {/* Current Payment: Payment for this receipt */}
                <tr className="flex w-full flex-row items-center justify-between text-xs font-semibold">
                  <th className="p-1">Current Payment:</th>
                  <td className="p-1">{receipt.amount}</td>
                </tr>
                {/* Total Paid: Sum of all payments */}
                <tr className="flex w-full flex-row items-center justify-between">
                  <th className="p-1">Total Paid:</th>
                  <td className="p-1">{cal.paidAmount}</td>
                </tr>
                {/* Balance Due: Remaining amount */}
                <tr className="flex w-full flex-row items-center justify-between bg-gray-200 text-xs font-semibold">
                  <th className="p-1">Balance Due:</th>
                  <td className="p-1">{cal.dueAmount}</td>
                </tr>
              </tbody>
            </table>
            <span className="mb-1 flex items-center justify-around rounded-box border border-dashed border-black/50 px-2 py-1 shadow-md">
              <div className="flex">
                <QrGenerator
                  content={`billNumber=${receipt.bill?.billNumber ?? ''}&receiptNumber=${receipt.receiptNumber ?? ''}`}
                  size={60}
                />
              </div>
              <span className="flex grow flex-col items-center justify-around gap-2 text-slate-800">
                <span>
                  Thank You <span className="text-black">{`\u{1F64F}`}</span>
                </span>
                {cal.discount > 0 ? <span>{`Hurray! You saved ${cal.discount}₹`}</span> : ''}
                <span className="flex items-center gap-2">
                  Visit Again
                  <FaceSmileIcon className="h-5 w-auto text-gray-600" />
                </span>
              </span>
            </span>
            <div className="zig-zag-line-horizontal my-0.5 h-6 w-full bg-gray-600"></div>
          </div>
        </>
      )}
    </span>
  );
};

export default ReceiptPreview;
