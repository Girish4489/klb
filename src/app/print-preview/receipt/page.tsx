'use client';
import LoadingSpinner from '@/app/print-preview/components/LoadingSpinner';
import PrintHeader from '@/app/print-preview/components/PrintHeader';
import ReceiptPreview from '@/app/print-preview/components/ReceiptPreview';
import handleError from '@/app/util/error/handleError';
import { ApiGet } from '@/app/util/makeApiRequest/makeApiRequest';
import { getSearchParam } from '@/app/util/url/urlUtils';
import { IReceipt } from '@/models/klm';
import { getStyle } from '@data/printStyles';
import klm from '@public/klm.png';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ReceiptPage: React.FC = () => {
  const [receipt, setReceipt] = useState<IReceipt>();
  const [cal, setCal] = useState({
    totalAmount: 0,
    discount: 0,
    grandTotal: 0,
    paidAmount: 0,
    dueAmount: 0,
  });
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [backUrl, setBackUrl] = useState<string>('/dashboard/transaction/receipt');
  const type: string = 'Receipt';
  useEffect(() => {
    async function fetchData() {
      const receiptNumber = parseInt(getSearchParam('receiptNumber') || '0', 10);

      if (!receiptNumber) {
        toast.error(`${type} number is required`);
        return;
      }

      setBackUrl(`/dashboard/transaction/receipt?receiptNumber=${receiptNumber}`);

      try {
        const response = await ApiGet.printDocument.PrintReceipt(type, receiptNumber);
        if (response?.success) {
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
          toast.success(<b>{response.message} fetched successfully</b>);
          setIsDataLoaded(true);
        } else {
          toast.error(response?.message || 'Failed to fetch data');
        }
      } catch (error) {
        handleError.toast(error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      {!isDataLoaded ? (
        <LoadingSpinner />
      ) : (
        <>
          <PrintHeader backUrl={backUrl} isLoading={!isDataLoaded} />
          <ReceiptPreview
            receipt={receipt}
            cal={cal}
            isDataLoaded={isDataLoaded}
            klm={klm}
            style={getStyle('Receipt')}
          />
        </>
      )}
    </>
  );
};

export default ReceiptPage;
