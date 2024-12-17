import { IReceipt } from '@models/klm';
import React from 'react';

import QrGenerator from '@components/Barcode/BarcodeGenerator';
import { EnvelopeIcon, FaceSmileIcon, PhoneIcon, WalletIcon } from '@heroicons/react/24/solid';
import { ICompany } from '@models/companyModel';
import { formatDS } from '@utils/format/dateUtils';
import Image from 'next/image';

interface ReceiptPreviewProps {
  receipts: IReceipt[] | undefined;
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
  highlightReceiptNumber?: number;
}

const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({
  receipts,
  cal,
  isDataLoaded,
  klm,
  company,
  style,
  highlightReceiptNumber,
}) => {
  if (!isDataLoaded) {
    return <div>Loading...</div>;
  }

  if (!receipts || receipts?.length === 0) {
    return <div>No Receipts found</div>;
  }

  const highlightedReceiptIndex = receipts.findIndex((receipt) => receipt.receiptNumber === highlightReceiptNumber);
  if (highlightedReceiptIndex === -1) {
    return <div>No Receipt found</div>;
  }

  const filteredReceipts = receipts.slice(0, highlightedReceiptIndex + 1);
  const highlightedReceipt = filteredReceipts[highlightedReceiptIndex];

  const totalPaid = filteredReceipts.reduce((acc, receipt) => acc + receipt.amount, 0);
  const totalDiscount = filteredReceipts.reduce((acc, receipt) => acc + receipt.discount, 0);
  const totalTax = filteredReceipts.reduce((acc, receipt) => acc + receipt.taxAmount, 0);
  const previousPayments = totalPaid - highlightedReceipt.amount;
  const isFullyPaid = highlightedReceipt?.paymentType === 'fullyPaid' || cal.dueAmount <= 0;

  return (
    <span>
      {receipts?.length > 0 && (
        <>
          <div className="m-1 mx-auto my-[50px] w-[300px] border border-solid border-gray-400 p-2 text-center">
            <style>{style}</style>
            <h2 className="m-px">Receipt</h2>
            <div className="flex flex-col items-center gap-2">
              {/* Company Header Section */}
              <div className="card card-side flex-col border border-dashed border-black/50 shadow-md">
                <h2 id="header" className="card-title mx-auto grow text-lg">
                  {company?.name ?? 'Kalamandir Ladies Boutique'}
                </h2>
                <div className="card-body grow flex-row gap-0.5 bg-transparent p-1 pb-2 text-slate-500">
                  <figure className="w-[30%]">
                    <Image
                      src={company?.logos?.medium && company.logos.medium !== '' ? company.logos.medium : klm.src}
                      width={180}
                      height={180}
                      alt="Logo"
                    />
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
                  <td className="p-1">{highlightedReceipt?.bill?.billNumber ?? ''}</td>
                </tr>
                <tr className="text-left">
                  <th className="p-1 text-left">Customer Name:</th>
                  <td className="p-1">{highlightedReceipt?.bill?.name ?? ''}</td>
                </tr>
                <tr className="bg-gray-200 text-left">
                  <th className="p-1 text-left">Mobile:</th>
                  <td className="p-1">{highlightedReceipt?.bill?.mobile ?? ''}</td>
                </tr>
                <tr className="text-left">
                  <th className="p-1 text-left">Pay Method:</th>
                  <td className="p-1">{highlightedReceipt?.paymentMethod ?? ''}</td>
                </tr>
                <tr className="bg-gray-200 text-left">
                  <th className="p-1 text-left">Receipt By:</th>
                  <td className="p-1">{highlightedReceipt?.receiptBy?.name ?? ''}</td>
                </tr>
                <tr className="text-left">
                  <th className="p-1 text-left">Receipt Mode:</th>
                  <td className="p-1">{highlightedReceipt?.paymentMethod ?? ''}</td>
                </tr>
                <tr className="bg-gray-200 text-left">
                  <th className="p-1 text-left">Date:</th>
                  <td className="p-1">
                    {highlightedReceipt?.paymentDate ? formatDS(highlightedReceipt?.paymentDate) : ''}
                  </td>
                </tr>
              </tbody>
            </table>
            <hr className="mx-auto my-1 w-[90%] border border-dashed border-black/60" />
            <table className="w-full border-collapse border-black text-slate-600">
              <thead>
                <tr className="rounded-box bg-gray-200 p-1 text-gray-700">
                  <th>SI No</th>
                  <th>Paid</th>
                  {filteredReceipts.some((receipt) => receipt.discount > 0) && <th>Discount</th>}
                  {filteredReceipts.some((receipt) => receipt.tax?.length > 0) && <th>Tax</th>}
                </tr>
              </thead>
              <tbody className="rounded-box p-1">
                {filteredReceipts.map((receipt, index) => (
                  <tr
                    key={index}
                    className={
                      receipt.receiptNumber === highlightReceiptNumber
                        ? 'bg-gray-400'
                        : index % 2 !== 0
                          ? 'bg-gray-200'
                          : ''
                    }
                  >
                    <td>{index + 1}</td>
                    <td>{receipt?.amount ?? ''}</td>
                    {filteredReceipts.some((receipt) => receipt.discount > 0) && (
                      <td>{receipt?.discount > 0 ? receipt?.discount : ''}</td>
                    )}
                    {filteredReceipts.some((receipt) => receipt.tax?.length > 0) && (
                      <td>
                        {receipt?.tax?.length > 0
                          ? receipt?.tax?.map((tax, taxIndex) => (
                              <div key={taxIndex}>
                                {tax.taxName}: {tax.taxPercentage}%
                              </div>
                            ))
                          : ''}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <hr className="mx-auto my-1 w-[90%] border border-dashed border-black/60" />
            {/* Calculated table */}
            <table className="w-full text-slate-600">
              <tbody className="flex flex-col gap-[1px] p-1">
                {/* Bill Total */}
                <tr className="flex w-full flex-row items-center justify-between bg-gray-200 text-xs font-semibold">
                  <th className="p-1">Bill Total:</th>
                  <td className="p-1">{cal.totalAmount}</td>
                </tr>

                {/* Bill Discount */}
                {totalDiscount > 0 && (
                  <tr className="flex w-full flex-row items-center justify-between bg-gray-200 text-xs font-semibold">
                    <th className="p-1">Bill Discount:</th>
                    <td className="p-1">-{totalDiscount}</td>
                  </tr>
                )}

                {/* Tax Amount */}
                {totalTax > 0 && (
                  <tr className="flex w-full flex-row items-center justify-between bg-gray-200 text-xs font-semibold">
                    <th className="p-1">Tax Amount:</th>
                    <td className="p-1">{totalTax}</td>
                  </tr>
                )}

                {/* Bill Grand Total */}
                <tr className="flex w-full flex-row items-center justify-between bg-gray-200 text-xs font-semibold">
                  <th className="p-1">Bill Grand Total:</th>
                  <td className="p-1">{cal.grandTotal}</td>
                </tr>

                {/* Previous Payments */}
                {previousPayments > 0 && !isFullyPaid && (
                  <tr className="flex w-full flex-row items-center justify-between">
                    <th className="p-1">Previous/Advance:</th>
                    <td className="p-1">{previousPayments}</td>
                  </tr>
                )}

                {/* Current Payment */}
                <tr className="flex w-full flex-row items-center justify-between text-xs font-semibold">
                  <th className="p-1">Current Payment:</th>
                  <td className="p-1">{highlightedReceipt?.amount}</td>
                </tr>

                {/* Receipt Discount */}
                {highlightedReceipt?.discount > 0 && (
                  <tr className="flex w-full flex-row items-center justify-between">
                    <th className="p-1">Receipt Discount:</th>
                    <td className="p-1">-{highlightedReceipt.discount}</td>
                  </tr>
                )}

                {/* Total Paid */}
                <tr className="flex w-full flex-row items-center justify-between bg-gray-200 text-xs font-semibold">
                  <th className="p-1">Total Paid:</th>
                  <td className="p-1">{totalPaid}</td>
                </tr>

                {/* Balance Due */}
                <tr className="flex w-full flex-row items-center justify-between bg-gray-200 text-xs font-semibold">
                  <th className="p-1">Balance Due:</th>
                  <td className="p-1">{cal.dueAmount}</td>
                </tr>
              </tbody>
            </table>
            <span className="mb-1 flex items-center justify-around rounded-box border border-dashed border-black/50 px-2 py-1 shadow-md">
              <div className="flex">
                <QrGenerator
                  content={`billNumber=${highlightedReceipt?.bill?.billNumber ?? ''}&receiptNumber=${highlightReceiptNumber ?? ''}`}
                  size={60}
                />
              </div>
              <span className="flex grow flex-col items-center justify-around gap-2 text-slate-800">
                <span>
                  Thank You <span className="text-black">{`\u{1F64F}`}</span>
                </span>
                {totalDiscount > 0 ? <span>{`Hurray! You saved ${totalDiscount}₹`}</span> : ''}
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
