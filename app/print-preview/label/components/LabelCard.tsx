import QrGenerator from '@components/Barcode/BarcodeGenerator';
import { ICompany } from '@models/companyModel';
import { IBill } from '@models/klm';
import React from 'react';
import { LabelType } from './LabelSelector';

interface LabelCardProps {
  order: IBill['order'][0];
  orderIndex: number;
  billNumber: string;
  company: ICompany;
  labelType: LabelType;
}

const LabelCard: React.FC<LabelCardProps> = ({ order, orderIndex, billNumber, company, labelType }) => {
  if (labelType === 'folded') {
    return (
      <div className="grid gap-4 text-black print:grid-cols-1 print:gap-0">
        {/* Fold Line Label Only */}
        <div
          className="card page-break-inside-avoid mx-auto h-auto max-h-[30mm] w-[60mm] border border-gray-200
          bg-white p-2 print:mx-0 print:border print:border-dashed print:p-1"
        >
          <div className="space-y-1 text-center text-[8pt]">
            <div className="font-bold">{company.name}</div>
            {order.category?.categoryName && <div>{order.category.categoryName}</div>}
            {order.color && (
              <div className="flex items-center justify-center gap-1">
                <span>Color:</span>
                <span className="h-3 w-3 rounded-full border" style={{ backgroundColor: order.color.hex }}></span>
                <span>{order.color.name}</span>
              </div>
            )}
            <div className="text-[6pt] opacity-70">Fold Line</div>
          </div>
        </div>
      </div>
    );
  }

  // Default clothing label
  return (
    <div className="grid gap-4 text-black print:grid-cols-1 print:gap-0">
      {/* Regular Label - Fixed width for standard label size */}
      <div
        className="card page-break-inside-avoid mx-auto h-auto max-h-[120mm] w-[60mm] border border-gray-200
        bg-white p-2 shadow-lg print:mx-0 print:border-0 print:p-1 print:shadow-none"
      >
        <div className="space-y-1 text-[8pt]">
          <div className="text-center font-bold">{company.name}</div>
          <div className="text-center">
            {company.contactDetails?.address && (
              <div className="text-[6pt] opacity-70">{company.contactDetails.address}</div>
            )}
            {company.contactDetails?.phones?.[0] && (
              <div className="text-[6pt] opacity-70">Ph: {company.contactDetails.phones[0]}</div>
            )}
          </div>

          <div className="my-1 border-t border-gray-200"></div>

          <div className="flex justify-between">
            <span>Bill: #{billNumber}</span>
            <span>Order: #{orderIndex}</span>
          </div>

          {order.category?.categoryName && <div>Item: {order.category.categoryName}</div>}

          {order.color && (
            <div className="flex items-center gap-1">
              <span>Color:</span>
              <span className="h-3 w-3 rounded-full border" style={{ backgroundColor: order.color.hex }}></span>
              <span>{order.color.name}</span>
            </div>
          )}

          {/* Measurements with smaller text */}
          {order.measurement && (
            <div className="text-[6pt]">
              <div className="font-semibold">Measurements:</div>
              <div className="whitespace-pre-wrap opacity-70">{order.measurement}</div>
            </div>
          )}

          {/* Style Process with smaller text */}
          {order.styleProcess && order.styleProcess.length > 0 && (
            <div className="text-[6pt]">
              <div className="font-semibold">Style:</div>
              {order.styleProcess.map((style, idx) => (
                <div key={idx} className="opacity-70">
                  {style.styleProcessName}: {style.styleName}
                </div>
              ))}
            </div>
          )}

          <div className="mt-2 flex justify-center">
            <QrGenerator
              content={`billNumber=${billNumber}&orderNumber=${orderIndex}`}
              size={80}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabelCard;
