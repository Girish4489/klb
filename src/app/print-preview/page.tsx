'use client';
import { getStyle } from '@/../data/printStyles';
import handleError from '@/app/util/error/handleError';
import { ApiGet } from '@/app/util/makeApiRequest/makeApiRequest';
import { IBill, IReceipt } from '@/models/klm';
import { ArrowLeftCircleIcon, PrinterIcon } from '@heroicons/react/24/solid';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CustomerBillPreview from './CustomerBillPreview';
import ReceiptPreview from './ReceiptPreview';
import WorkerBillPreview from './WorkerBillPreview';
import klm from '/public/klm.png';

const PrintPreviewPage = () => {
  const [billNumber, setBillNumber] = useState<number>(0);
  const [type, setType] = useState<string>('');
  const [bill, setBill] = useState<IBill>();
  const [receipt, setReceipt] = useState<IReceipt>();
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const router = useRouter();

  return (
    <Suspense
      fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Loading...
          <progress className="progress w-56"></progress>
        </div>
      }
    >
      <PrintPreviewContent
        billNumber={billNumber}
        setBillNumber={setBillNumber}
        type={type}
        setType={setType}
        bill={bill}
        setBill={setBill}
        receipt={receipt}
        setReceipt={setReceipt}
        isDataLoaded={isDataLoaded}
        setIsDataLoaded={setIsDataLoaded}
        router={router}
      />
    </Suspense>
  );
};

interface PrintPreviewContentProps {
  billNumber: number;
  setBillNumber: React.Dispatch<React.SetStateAction<number>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  bill?: IBill;
  setBill: React.Dispatch<React.SetStateAction<IBill | undefined>>;
  receipt?: IReceipt;
  setReceipt: React.Dispatch<React.SetStateAction<IReceipt | undefined>>;
  isDataLoaded: boolean;
  setIsDataLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  router: ReturnType<typeof useRouter>;
}

const PrintPreviewContent: React.FC<PrintPreviewContentProps> = ({
  billNumber,
  setBillNumber,
  type,
  setType,
  bill,
  setBill,
  receipt,
  setReceipt,
  isDataLoaded,
  setIsDataLoaded,
  router,
}) => {
  const searchParams = useSearchParams();

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
    async function fetchData(type: string, number: number) {
      if (!number) {
        toast.error(`${type} number is required`);
        return;
      }

      try {
        let response;
        if (type === 'Customer Bill' || type === 'Worker Bill' || type === 'Both') {
          response = await ApiGet.printDocument.PrintBill(type, number);
        } else if (type === 'Receipt') {
          response = await ApiGet.printDocument.PrintReceipt(type, number);
        }

        if (response?.success) {
          if (type === 'Receipt') {
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
          } else {
            setBill(response.bill);
          }
          toast.success(<b>{response.message} fetched successfully</b>);
          setIsDataLoaded(true);
        } else {
          toast.error(response?.message || 'Failed to fetch data');
        }
      } catch (error) {
        handleError.toast(error);
      }
    }

    // Get billnumber and type by search params from next/navigation
    const billNumberParam = parseInt(searchParams.get('billNumber') || '0', 10);
    const typeParam = searchParams.get('type') || '';
    setBillNumber(billNumberParam);
    setType(typeParam);

    fetchData(typeParam, billNumberParam);
  }, [searchParams]);

  const handlePrint = () => {
    window.print();
  };

  const billPathWithParam = `/dashboard/work-manage/bill?billNumber=${billNumber}`;
  const receiptPathWithParam = `/dashboard/transaction/receipt?receiptNumber=${billNumber}`;

  return (
    <Suspense
      fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Loading...
          <progress className="progress w-56"></progress>
        </div>
      }
    >
      <span className="preview bg-white">
        <span className="print-button space-x-2 bg-white p-1">
          <button
            className="btn btn-primary btn-sm m-2 text-center"
            onClick={() => router.push(type === 'Receipt' ? receiptPathWithParam : billPathWithParam)}
          >
            <ArrowLeftCircleIcon className="h-6 w-6" />
            Back
          </button>
          <button className="btn btn-primary btn-sm m-2 text-center" onClick={handlePrint}>
            <PrinterIcon className="h-6 w-6" />
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
    </Suspense>
  );
};

export default PrintPreviewPage;
