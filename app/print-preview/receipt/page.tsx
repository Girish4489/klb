'use client';
import LoadingSpinner from '@components/LoadingSpinner';
import { useCompany } from '@context/companyContext';
import { getStyle } from '@data/printStyles';
import { IReceipt } from '@models/klm';
import klm from '@public/klm.png';
import handleError from '@utils/error/handleError';
import { ApiGet, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import { toast } from '@utils/toast/toast';
import { getSearchParam } from '@utils/url/urlUtils';
import { useEffect, useState } from 'react';
import PrintHeader from '../components/PrintHeader';
import ReceiptPreview from '../components/ReceiptPreview';

interface PrintReceiptResponse extends ApiResponse {
  receipts: IReceipt[];
  bill?: {
    totalAmount: number;
    discount: number;
    grandTotal: number;
    paidAmount: number;
    dueAmount: number;
  };
}

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
    async function fetchData(): Promise<void> {
      const receiptNumberToHighlight = parseInt(getSearchParam('receiptNumber') || '0', 10);
      setReceiptNumberToHighlight(receiptNumberToHighlight);
      const billNumber = parseInt(getSearchParam('billNumber') || '0', 10);

      if (!billNumber) {
        toast.error(`${type} number is required`);
        return;
      }

      setBackUrl(`/dashboard/transaction/receipt?billNumber=${billNumber}&receiptNumber=${receiptNumberToHighlight}`);

      try {
        const response = await ApiGet.printDocument.PrintReceipts<PrintReceiptResponse>(type, billNumber);
        if (!response) {
          throw new Error('No response from server');
        }

        if (response.success) {
          setReceipts(response.receipts || []);
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
          throw new Error(response.message ?? 'Failed to fetch data');
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
