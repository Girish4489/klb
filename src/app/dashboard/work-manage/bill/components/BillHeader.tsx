import { IBill } from '@/models/klm';
import { InputField } from '@dashboard/work-manage/bill/components/InputField';
import React from 'react';

export interface BillHeaderProps {
  bill: IBill;
  setBill: React.Dispatch<React.SetStateAction<IBill | undefined>>;
}

const BillHeader: React.FC<BillHeaderProps> = ({ bill, setBill }) => {
  return (
    <div className="flex w-full flex-wrap gap-x-1 gap-y-2 p-2">
      <InputField
        label="Bill No"
        id="billNo"
        type="number"
        value={bill.billNumber ?? ''}
        readOnly
        onChange={() => {}}
        autoComplete="off"
        className="min-w-10"
        labelClass="input-primary"
        inputClass="grow"
      />
      <InputField
        label="Date"
        id="date"
        type="date"
        value={bill.date ? new Date(bill.date).toISOString().split('T')[0] : ''}
        onChange={(e) =>
          setBill((prevBill) => (prevBill ? ({ ...prevBill, date: new Date(e.target.value) } as IBill) : prevBill))
        }
        className="min-w-16"
        labelClass="input-primary"
        dateClass="grow"
      />
      <InputField
        label="Due Date"
        id="dueDate"
        type="date"
        value={bill.dueDate ? new Date(bill.dueDate).toISOString().split('T')[0] : ''}
        onChange={(e) =>
          setBill((prevBill) => (prevBill ? ({ ...prevBill, dueDate: new Date(e.target.value) } as IBill) : prevBill))
        }
        className="min-w-16"
        labelClass="input-primary"
        dateClass="grow"
      />
      <InputField
        label="Mobile"
        id="mobile"
        type="tel"
        value={bill.mobile ?? ''}
        placeholder="Mobile No"
        onChange={(e) =>
          setBill((prevBill) =>
            prevBill
              ? ({
                  ...prevBill,
                  mobile: parseInt(e.target.value.slice(0, 10)) || undefined,
                } as IBill)
              : prevBill,
          )
        }
        className=""
        labelClass="input-primary"
        inputClass="grow"
      />
      <InputField
        label="Name"
        id="name"
        type="text"
        value={bill.name ?? ''}
        placeholder="Customer Name"
        autoComplete="name"
        onChange={(e) =>
          setBill((prevBill) => (prevBill ? ({ ...prevBill, name: e.target.value } as IBill) : prevBill))
        }
        className="min-w-16"
        labelClass="input-primary"
        inputClass="grow"
      />
      <InputField
        label="Email"
        id="email"
        type="email"
        value={bill.email ?? ''}
        placeholder="Customer Email"
        autoComplete="email"
        onChange={(e) =>
          setBill((prevBill) => (prevBill ? ({ ...prevBill, email: e.target.value } as IBill) : prevBill))
        }
        className="min-w-16"
        labelClass="input-primary"
        inputClass="grow"
      />
      <InputField
        label="Urgent"
        id="urgent"
        type="checkbox"
        value={bill.urgent || false}
        onChange={(e) =>
          setBill((prevBill) =>
            prevBill ? ({ ...prevBill, urgent: (e.target as HTMLInputElement).checked } as IBill) : prevBill,
          )
        }
        className="min-w-16"
        labelClass="btn-neutral"
        checkboxClass="checkbox-primary grow"
      />
      <InputField
        label="Trail"
        id="trail"
        type="checkbox"
        value={bill.trail || false}
        onChange={(e) =>
          setBill((prevBill) =>
            prevBill ? ({ ...prevBill, trail: (e.target as HTMLInputElement).checked } as IBill) : prevBill,
          )
        }
        className="min-w-16"
        labelClass="btn-neutral"
        checkboxClass="checkbox-primary grow"
      />
    </div>
  );
};

export default BillHeader;
