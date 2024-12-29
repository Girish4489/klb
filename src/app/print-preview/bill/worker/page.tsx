'use client';
import PrintHeader from '@/app/print-preview/components/PrintHeader';
import WorkerBillPreview from '@/app/print-preview/components/WorkerBillPreview';
import LoadingSpinner from '@components/LoadingSpinner';
import { useCompany } from '@context/companyContext';
import { getStyle } from '@data/printStyles';
import { IBill } from '@models/klm';
import klm from '@public/klm.png';
import handleError from '@utils/error/handleError';
import { ApiGet, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import { toast } from '@utils/toast/toast';
import { getSearchParam } from '@utils/url/urlUtils';
import { useEffect, useState } from 'react';

interface PrintBillResponse extends ApiResponse {
  success: boolean;
  message: string;
  bill: IBill;
}

const WorkerBillPage: React.FC = () => {
  const [bill, setBill] = useState<IBill>();
  const { company } = useCompany();
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const type = 'Worker Bill';
  const [backUrl, setBackUrl] = useState<string>('/dashboard/work-manage/bill');

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const billNumber = parseInt(getSearchParam('billNumber') || '0', 10);

      if (!billNumber) {
        toast.error(`${type} number is required`);
        return;
      }

      setBackUrl(`/dashboard/work-manage/bill?billNumber=${billNumber}`);

      try {
        const response = await ApiGet.printDocument.PrintBill<PrintBillResponse>(type, billNumber);
        if (!response || !response.success) {
          throw new Error(response?.message || 'Failed to fetch data');
        }
        setBill(response.bill);
        toast.success(<b>{response.message} fetched successfully</b>);
        setIsDataLoaded(true);
      } catch (error) {
        handleError.toast(error);
      }
    }

    fetchData();
  }, [type]);

  return (
    <>
      {!isDataLoaded ? (
        <LoadingSpinner classStyle="h-screen" />
      ) : (
        <>
          <PrintHeader backUrl={backUrl} isLoading={!isDataLoaded} />
          <WorkerBillPreview
            bill={bill}
            company={company}
            isDataLoaded={isDataLoaded}
            klm={klm}
            style={getStyle(type)}
            type={type}
          />
        </>
      )}
    </>
  );
};

export default WorkerBillPage;
