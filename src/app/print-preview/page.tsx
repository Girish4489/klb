'use client';
import { IBill, IReceipt } from '@/models/klm';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import handleError from '../util/error/handleError';
import { ApiGet } from '../util/makeApiRequest/makeApiRequest';
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

  const thermalPrintOptions = `
    size: Custom;
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 0;
    margin-right: 0;
    width: 80mm;
    height: auto;
  `;

  const a4PrintOptions = `
    size: A4 portrait;
    margin: 1cm;
  `;

  useEffect(() => {
    async function getBillData(type: string, billNumber: number) {
      if (type === 'Customer Bill' || type === 'Worker Bill') {
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
      if ((type === 'Customer Bill' || type === 'Worker Bill') && billNumber) {
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

    // Get billnumber and type by search url
    if (typeof window !== 'undefined') {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const billNumberParam = parseInt(urlSearchParams.get('billNumber') || '0', 10);
      const typeParam = urlSearchParams.get('type') || '';
      setBillNumber(billNumberParam);
      setType(typeParam);

      fetchData(typeParam, billNumberParam);
    }
  }, [a4PrintOptions, billNumber, thermalPrintOptions, type]);

  const handlePrint = () => {
    window.print();
  };

  const commonStyles = `
    body {
      margin: 0;
      padding: 0;
      background-color: #fff;
    }
    body {
      font: 12px Georgia, 'Times New Roman', Times, serif;
      color: #333;
    }
    h1, h2, h3, h4, h5, h6 {
      font: bold 100% Georgia, 'Times New Roman', Times, serif;
      color: #333;
    }
    hr {
      margin: 10px, 10px;
    }
    .flex {
      display: flex;
    }
    .flex-row {
      flex-direction: row;
    }
    .flex-col {
      flex-direction: column;
    }
    .items-center {
      align-items: center;
    }
    .justify-center {
      justify-content: center;
    }
    .justify-between {
      justify-content: space-between;
    }
    .justify-around {
      justify-content: space-around;
    }
    .justify-evenly {
      justify-content: space-evenly;
    }
    .justify-start {
      justify-content: flex-start;
    }
    .grow-1 {
      flex-grow: 1;
    }
    :root {
      --gap-2: 2px;
      --gap-4: 4px;
      --gap-8: 8px;
    }
    .gap-2 {
      gap: var(--gap-2);
    }
    .gap-4 {
      gap: var(--gap-4);
    }
    .gap-8 {
      gap: var(--gap-8);
    }
    :root {
      --padding-2: 2px;
      --padding-4: 4px;
      --padding-8: 8px;
    }
    .padding-2 {
      padding: var(--padding-2);
    }
    .padding-4 {
      padding: var(--padding-4);
    }
    .padding-8 {
      padding: var(--padding-8);
    }
    :root {
      --margin-2: 2px;
      --margin-4: 4px;
      --margin-8: 8px;
    }
    .m-2 {
      margin: var(--margin-2);
    }
    .m-4 {
      margin: var(--margin-4);
    }
    .m-8 {
      margin: var(--margin-8);
    }
    .text-center {
      text-align: center;
    }
    .billType {
      font: bold 100% Georgia, 'Times New Roman', Times, serif;
      color: #333;
      padding: 0%;
      margin: 0%;
      text-align: center;
    }
    .field {
      display: flex;
      flex-direction: row;
      gap: 2px;
      align-items: center;
      justify-content: space-between;
    }
    .address {
      grid-column: 1 / span 2;
    }
    .field h2 {
      margin: 0;
      padding: 1px;
      text-align: center;
      font-size: small;
      font-weight: bold;
    }
    .field h3 {
      margin: 0;
      padding: 1px;
      flex-grow: 1;
      text-align: justify;
      font-size: small;
      font-weight: bold;
    }
    .customer-details {
      display: grid;
      width: 50%;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 10px;
    }
    .w-50per {
      width: 50%;
    }
    .header-box {
      text-align: center;
      display: table;
      width: 96%;
      margin: 0 auto;
      padding: 5px;
      border: #333 solid 1px;
      border-radius: 10px;
      gap: 2px;
    }
    .process-box {
      text-align: center;
      border: #333 solid 1px;
      border-radius: 10px;
      padding: var(--padding-2);
      gap: 2px;
    }
    .profile {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .profile img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      aspect-ratio: 1/1;
      place-items: center;
      border: 1px solid black;
      object-fit: fill;
    }
    .profile img:hover {
      transform: scale(1.05);
      opacity: 0.9;
    }
    .w-full {
      width: 100%;
    }
    .w-fit {
      width: fit-content;
    }
    .mx-2 {
      margin-left: var(--margin-2);
      margin-right: var(--margin-2);
    }
    .mx-4 {
      margin-left: var(--margin-4);
      margin-right: var(--margin-4);
    }
    .mx-8 {
      margin-left: var(--margin-8);
      margin-right: var(--margin-8);
    }
    .my-2 {
      margin-top: var(--margin-2);
      margin-bottom: var(--margin-2);
    }
    .my-4 {
      margin-top: var(--margin-4);
      margin-bottom: var(--margin-4);
    }
    .my-8 {
      margin-top: var(--margin-8);
      margin-bottom: var(--margin-8);
    }
  `;

  const customerBillStyles = `
    @page {
      ${a4PrintOptions}
    }
    .order-details {
      break-before: avoid;
      page-break-inside: avoid;
      page-break-after: auto;
    }
  `;

  const workerBillStyles = `
    @page {
      ${a4PrintOptions}
    }
    .order-details {
      break-before: avoid;
      page-break-inside: avoid;
      page-break-after: auto;
    }
  `;

  const receiptStyles = `
    @page {
      ${thermalPrintOptions}
    }
    .receipt {
      width: 300px;
      margin: 50px auto;
      border: 1px solid #ddd;
      padding: 10px;
      text-align: center;
    }
    .receipt th, td {
      border: 1px solid #ddd;
    }
    .receipt tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    .receipt tr {
      text-align: left;
    }
  `;

  const getStyle = (type: string) => {
    switch (type) {
      case 'Customer Bill':
        return commonStyles + customerBillStyles;
      case 'Worker Bill':
        return commonStyles + workerBillStyles;
      case 'Receipt':
        return commonStyles + receiptStyles;
      default:
        return commonStyles;
    }
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
        <WorkerBillPreview bill={bill} isDataLoaded={isDataLoaded} klm={klm} style={getStyle(type)} />
      )}
      {type === 'Receipt' && (
        <ReceiptPreview receipt={receipt} cal={cal} isDataLoaded={isDataLoaded} klm={klm} style={getStyle(type)} />
      )}
    </span>
  );
};

export default PrintPreviewPage;
