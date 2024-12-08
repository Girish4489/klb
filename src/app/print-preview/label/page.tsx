'use client';
import QrGenerator from '@/app/components/Barcode/BarcodeGenerator';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import PrintHeader from '@/app/print-preview/components/PrintHeader';
import { IBill } from '@/models/klm';
import { getSearchParam } from '@util/url/urlUtils';
import React, { useEffect, useState } from 'react';

const BillOrderLabels: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [orderList, setOrderList] = useState<IBill['order']>([]);
  const billNumber = getSearchParam('billNumber');

  useEffect(() => {
    const orders = sessionStorage.getItem('selectedOrderDetails');
    if (orders) {
      setOrderList(JSON.parse(orders));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!billNumber || !orderList.length) {
    return <div>Bill number or orders are missing.</div>;
  }

  return (
    <div className="bg-white">
      <PrintHeader backUrl={`/dashboard/work-manage/labelling?billNumber=${billNumber}`} isLoading={false} />
      <div className="flex flex-col gap-1 p-1">
        {orderList.map((order, index) => (
          <div key={index} className="p-0.5">
            <QrGenerator
              content={`billNumber=${billNumber}&orderNumber=${index + 1}`}
              size={128}
              className="rounded-box ring-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillOrderLabels;
