'use client';
import LoadingSpinner from '@components/LoadingSpinner';
import { useCompany } from '@context/companyContext';
import { IBill } from '@models/klm';
import { getSearchParam } from '@utils/url/urlUtils';
import React, { useEffect, useState } from 'react';
import PrintHeader from '../components/PrintHeader';
import LabelCard from './components/LabelCard';
import LabelSelector, { LabelType } from './components/LabelSelector';

const BillOrderLabels: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [orderList, setOrderList] = useState<IBill['order']>([]);
  const [labelType, setLabelType] = useState<LabelType>('clothing');
  const billNumber = getSearchParam('billNumber');
  const { company } = useCompany();

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

  if (!billNumber || !orderList.length || !company) {
    return <div>Required details are missing.</div>;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="print:hidden">
        <PrintHeader backUrl={`/dashboard/work-manage/labelling?billNumber=${billNumber}`} isLoading={false} />
        <LabelSelector selectedType={labelType} onChange={setLabelType} />
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 print:grid-cols-2 print:gap-0 print:px-1 print:py-2">
        {orderList.map((order, index) => (
          <LabelCard
            key={index}
            order={order}
            orderIndex={index + 1}
            billNumber={billNumber}
            company={company}
            labelType={labelType}
          />
        ))}
      </div>
    </div>
  );
};

export default BillOrderLabels;
