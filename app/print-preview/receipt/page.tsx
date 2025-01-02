'use client';
import LoadingSpinner from '@components/LoadingSpinner';
import { useCompany } from '@context/companyContext';
import { getStyle } from '@data/printStyles';
import { IBill, IReceipt } from '@models/klm';
import klm from '@public/klm.png';
import handleError from '@utils/error/handleError';
import { ApiGet, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import { toast } from '@utils/toast/toast';
import { getSearchParam } from '@utils/url/urlUtils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PrintHeader from '../components/PrintHeader';
import ReceiptPreview from '../components/ReceiptPreview';

interface PrintReceiptResponse extends ApiResponse {
  receipts: IReceipt[];
  bill: IBill;
}

interface ICal {
  totalAmount: number;
  taxAmount: number;
  grandTotal: number;
  paidAmount: number;
  discount: number;
  dueAmount: number;
}

const ReceiptPage: React.FC = () => {
  const [receipts, setReceipts] = useState<IReceipt[]>([]);
  const { company } = useCompany();
  const [cal, setCal] = useState<ICal>({
    totalAmount: 0,
    taxAmount: 0,
    grandTotal: 0,
    paidAmount: 0,
    discount: 0,
    dueAmount: 0,
  });
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [receiptNumberToHighlight, setReceiptNumberToHighlight] = useState<number>(0);
  const [backUrl, setBackUrl] = useState<string>('/dashboard/transaction/receipt');
  const type: string = 'Receipt';

  // Memoize URL parameters
  const urlParams = useMemo(() => {
    const receiptNumber = parseInt(getSearchParam('receiptNumber') || '0', 10);
    const billNumber = parseInt(getSearchParam('billNumber') || '0', 10);
    return { receiptNumber, billNumber };
  }, []);

  // Memoize calculation function
  const calculateTotals = useCallback((bill: IBill, receipts: IReceipt[], receiptNumber: number) => {
    const highlightedReceipts = receipts.filter((r) => r.receiptNumber <= receiptNumber);
    const totalAmount = bill.totalAmount || 0;
    const taxAmount = highlightedReceipts.reduce((sum, r) => sum + (r.taxAmount || 0), 0);
    const grandTotal = totalAmount + taxAmount;
    const paidAmount = highlightedReceipts.reduce((sum, r) => sum + (r.amount || 0), 0);
    const discount = highlightedReceipts.reduce((sum, r) => sum + (r.discount || 0), 0);
    const dueAmount = grandTotal - paidAmount - discount;

    return {
      totalAmount,
      taxAmount,
      grandTotal,
      paidAmount,
      discount,
      dueAmount,
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchData(): Promise<void> {
      const { receiptNumber, billNumber } = urlParams;

      if (!billNumber) {
        toast.error(`${type} number is required`);
        return;
      }

      setReceiptNumberToHighlight(receiptNumber);
      setBackUrl(`/dashboard/transaction/receipt?billNumber=${billNumber}&receiptNumber=${receiptNumber}`);

      try {
        const response = await ApiGet.printDocument.PrintReceipts<PrintReceiptResponse>(type, billNumber);

        if (!isMounted) return;

        if (!response?.success) {
          throw new Error(response?.message ?? 'Failed to fetch data');
        }

        const { receipts = [], bill } = response;

        if (!receipts.length) {
          throw new Error('No receipts found');
        }

        if (!bill?.totalAmount || bill.totalAmount <= 0) {
          throw new Error('Invalid bill amount');
        }

        setReceipts(receipts);
        setCal(calculateTotals(bill, receipts, receiptNumber));
        setIsDataLoaded(true);
        toast.success(<b>{response.message} fetched successfully</b>);
      } catch (error) {
        if (isMounted) {
          handleError.toast(error);
          setIsDataLoaded(true); // Set loaded even on error to remove spinner
        }
      }
    }

    fetchData();

    // Cleanup function
    return (): void => {
      isMounted = false;
    };
  }, [urlParams, calculateTotals, type]); // Only depend on stable dependencies

  if (!receipts || !company) {
    return null;
  }
  if (!isDataLoaded) {
    return <LoadingSpinner classStyle="h-screen" />;
  }

  return (
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
  );
};

export default ReceiptPage;
