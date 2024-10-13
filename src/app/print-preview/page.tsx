'use client';
import { a4PrintOptions, getStyle, thermalPrintOptions } from '@/../data/printStyles';
import handleError from '@/app/util/error/handleError';
import { ApiGet } from '@/app/util/makeApiRequest/makeApiRequest';
import { IBill, IReceipt } from '@/models/klm';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CustomerBillPreview from './CustomerBillPreview';
import ReceiptPreview from './ReceiptPreview';
import WorkerBillPreview from './WorkerBillPreview';
import klm from '/public/klm.png';

const PrintPreviewPage = () => {
  const [billNumber, setBillNumber] = useState<number>(0);
  const [type, setType] = React.useState<string>('');
  const [bill, setBill] = useState<IBill>();
  const [receipt, setReceipt] = useState<IReceipt>();
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const router = useRouter();

  const [cal, setCal] = useState<{
    totalAmount: number;
    discount: number;
    grandTotal: number;
    paidAmount: number;
    dueAmount: number;
  }>({
    totalAmount: 0,
    discount: 0,
    grandTotal: 0,
    paidAmount: 0,
    dueAmount: 0,
  });

  useEffect(() => {
    async function getBillData(type: string, billNumber: number) {
      if (type === 'Customer Bill' || type === 'Worker Bill' || type === 'Both') {
        // Fetch the bill data from the server
        const response = await ApiGet.printDocument.PrintBill(type, billNumber);
        if (response.success === true) {
          setBill(response.bill);
          return response.message;
        } else if (response.success === false) {
          toast.error(response.message);
          return;
        }
        return;
      }
    }

    async function getReceiptData(type: string, receiptNumber: number) {
      if (type === 'Receipt') {
        if (!receiptNumber) {
          toast.error('Receipt number is required');
          return;
        }
        // Fetch the receipt data from the server
        const response = await ApiGet.printDocument.PrintReceipt(type, receiptNumber);
        if (response.success === true) {
          setReceipt(response.receipt);
          if (response.bill) {
            setCal({
              totalAmount: response.bill.totalAmount || 0,
              discount: response.bill.discount || 0,
              grandTotal: response.bill.grandTotal || 0,
              paidAmount: response.bill.paidAmount || 0,
              dueAmount: response.bill.dueAmount || 0,
            });
          }
          return response.message;
        } else if (response.success === false) {
          toast.error(response.message);
          return;
        }
        return;
      }
    }

    async function fetchData(type: string, billNumber: number) {
      if ((type === 'Customer Bill' || type === 'Worker Bill' || type === 'Both') && billNumber) {
        try {
          await toast.promise(getBillData(type, billNumber), {
            loading: 'Loading...',
            success: (message) => <b>{message}</b>,
            error: (error) => <b>{error.message}</b>,
          });
          setIsDataLoaded(true);
        } catch (error) {
          handleError.log(error);
        }
      } else if (type === 'Receipt' && billNumber) {
        try {
          await toast.promise(getReceiptData(type, billNumber), {
            loading: 'Loading...',
            success: (message) => <b>{message}</b>,
            error: (error) => <b>{error.message}</b>,
          });
          setIsDataLoaded(true);
        } catch (error) {
          handleError.log(error);
        }
      }
    }

    // Get billnumber and type by search params from next/navigation
    const searchParams = new URLSearchParams(window.location.search);
    const billNumberParam = parseInt(searchParams.get('billNumber') || '0', 10);
    const typeParam = searchParams.get('type') || '';
    setBillNumber(billNumberParam);
    setType(typeParam);

    fetchData(typeParam, billNumberParam);
  }, [a4PrintOptions, billNumber, thermalPrintOptions, type]);

  const handlePrint = () => {
    window.print();
  };

  const billPathWithParam = `/dashboard/work-manage/bill?billNumber=${billNumber}`;
  const receiptPathWithParam = `/dashboard/transaction/receipt?receiptNumber=${billNumber}`;

  return (
    <span className="preview bg-white">
      <span className="print-button space-x-2 bg-white p-1">
        <button
          className="btn btn-primary btn-sm m-2 text-center"
          onClick={() => router.push(type === 'Receipt' ? receiptPathWithParam : billPathWithParam)}
        >
          Back
        </button>
        <button className="btn btn-primary btn-sm m-2 text-center" onClick={handlePrint}>
          Print
        </button>
      </span>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        .print-button {
          display: block;
        }
        .preview div {
          background-color: #fff;
        }
        @media print {
          .print-button {
            display: none;
          }
        }
      `}</style>
      {type === 'Customer Bill' && (
        <CustomerBillPreview bill={bill} isDataLoaded={isDataLoaded} klm={klm} style={getStyle(type)} />
      )}
      {type === 'Worker Bill' && (
        <WorkerBillPreview bill={bill} isDataLoaded={isDataLoaded} klm={klm} style={getStyle(type)} type={type} />
      )}
      {type === 'Both' && (
        <>
          <CustomerBillPreview bill={bill} isDataLoaded={isDataLoaded} klm={klm} style={getStyle('Customer Bill')} />
          <div style={{ pageBreakBefore: 'always' }}></div>
          <WorkerBillPreview
            bill={bill}
            isDataLoaded={isDataLoaded}
            klm={klm}
            style={getStyle('Worker Bill')}
            type={type}
          />
        </>
      )}
      {type === 'Receipt' && (
        <ReceiptPreview receipt={receipt} cal={cal} isDataLoaded={isDataLoaded} klm={klm} style={getStyle(type)} />
      )}
    </span>
  );
};

export default PrintPreviewPage;
