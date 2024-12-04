'use client';
import { ArrowLeftCircleIcon, PrinterIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import React from 'react';

interface PrintHeaderProps {
  backUrl: string;
  isLoading: boolean;
}

const PrintHeader: React.FC<PrintHeaderProps> = ({ backUrl, isLoading }) => {
  const router = useRouter();

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    router.push(backUrl);
  };

  return (
    <span className="print-header flex gap-2 space-x-2 p-2 pb-1">
      <button className="btn btn-primary btn-sm" onClick={handleBack} disabled={isLoading}>
        <ArrowLeftCircleIcon className="h-5 w-5" />
        Back
      </button>
      <button className="btn btn-primary btn-sm" onClick={handlePrint} disabled={isLoading}>
        <PrinterIcon className="h-5 w-5" />
        Print
      </button>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        .print-header {
          display: block;
        }
        @media print {
          .print-header {
            display: none;
          }
        }
      `}</style>
    </span>
  );
};

export default PrintHeader;
