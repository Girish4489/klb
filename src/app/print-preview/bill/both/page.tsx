'use client';
import CustomerBillPreview from '@/app/print-preview/components/CustomerBillPreview';
import LoadingSpinner from '@/app/print-preview/components/LoadingSpinner';
import PrintHeader from '@/app/print-preview/components/PrintHeader';
import WorkerBillPreview from '@/app/print-preview/components/WorkerBillPreview';
import handleError from '@/app/util/error/handleError';
import { ApiGet } from '@/app/util/makeApiRequest/makeApiRequest';
import { getSearchParam } from '@/app/util/url/urlUtils';
import { IBill } from '@/models/klm';
import { getStyle } from '@data/printStyles';
import klm from '@public/klm.png';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const BothBillPage: React.FC = () => {
  const [bill, setBill] = useState<IBill>();
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const type = 'Both';
  const [backUrl, setBackUrl] = useState<string>('/dashboard/work-manage/bill');

  useEffect(() => {
    async function fetchData() {
      const billNumber = parseInt(getSearchParam('billNumber') || '0', 10);

      if (!billNumber) {
        toast.error(`${type} number is required`);
        return;
      }

      setBackUrl(`/dashboard/work-manage/bill?billNumber=${billNumber}`);

      try {
        const response = await ApiGet.printDocument.PrintBill(type, billNumber);
        if (response?.success) {
          setBill(response.bill);
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
  }, [type]);

  return (
    <>
      {!isDataLoaded ? (
        <LoadingSpinner /> // Use the LoadingSpinner component
      ) : (
        <>
          <PrintHeader backUrl={backUrl} isLoading={!isDataLoaded} />
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
    </>
  );
};

export default BothBillPage;
