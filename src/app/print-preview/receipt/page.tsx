'use client';
import PrintHeader from '@/app/print-preview/components/PrintHeader';
import ReceiptPreview from '@/app/print-preview/components/ReceiptPreview';
import LoadingSpinner from '@components/LoadingSpinner';
import { useCompany } from '@context/companyContext';
import { getStyle } from '@data/printStyles';
import { IReceipt } from '@models/klm';
import klm from '@public/klm.png';
import handleError from '@util/error/handleError';
import { ApiGet } from '@util/makeApiRequest/makeApiRequest';
import { getSearchParam } from '@util/url/urlUtils';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ReceiptPage: React.FC = () => {
  const [receipts, setReceipts] = useState<IReceipt[]>([]);
  const { company } = useCompany();
  const [cal, setCal] = useState({
    totalAmount: 0,
    discount: 0,
    grandTotal: 0,
    paidAmount: 0,
    dueAmount: 0,
  });
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [receiptNumberToHighlight, setReceiptNumberToHighlight] = useState<number>(0);
  const [backUrl, setBackUrl] = useState<string>('/dashboard/transaction/receipt');
  const type: string = 'Receipt';

  useEffect(() => {
    async function fetchData() {
      const receiptNumberToHighlight = parseInt(getSearchParam('receiptNumber') || '0', 10);
      setReceiptNumberToHighlight(receiptNumberToHighlight);
      const billNumber = parseInt(getSearchParam('billNumber') || '0', 10);

      if (!billNumber) {
        toast.error(`${type} number is required`);
        return;
      }

      setBackUrl(`/dashboard/transaction/receipt?billNumber=${billNumber}&receiptNumber=${receiptNumberToHighlight}`);

      try {
        const response = await ApiGet.printDocument.PrintReceipts(type, billNumber);
        if (response?.success) {
          setReceipts((response.receipts as IReceipt[]) || []);
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
        <LoadingSpinner classStyle="h-screen" />
      ) : (
        <>
          <PrintHeader backUrl={backUrl} isLoading={!isDataLoaded} />
          <ReceiptPreview
            receipts={receipts}
            cal={cal}
            isDataLoaded={isDataLoaded}
            klm={klm}
            company={company}
            style={getStyle('Receipt')}
            highlightReceiptNumber={receiptNumberToHighlight}
          />
        </>
      )}
    </>
  );
};

export default ReceiptPage;
